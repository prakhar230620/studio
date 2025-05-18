
// src/app/shopping-list/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { ShoppingListItem } from '@/lib/types';
import { ShoppingListDisplay } from '@/components/ShoppingListDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { handleFetchItemPrices } from '@/lib/actions'; // Import the new action
import { Skeleton } from '@/components/ui/skeleton';

export default function ShoppingListPage() {
  const [shoppingListStored, setShoppingListStored] = useLocalStorage<ShoppingListItem[]>('shoppingList', []);
  // pricedShoppingList will hold items with prices, separate from localStorage until we decide to store prices too
  const [pricedShoppingList, setPricedShoppingList] = useState<ShoppingListItem[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const priceFetchMutation = useMutation({
    mutationFn: async (items: ShoppingListItem[]) => {
      // Filter out items that might already have a price if we decide to store them
      // For now, let's assume we always refetch for all items in the current list
      const itemsToPrice = items.map(item => ({...item, price: undefined}));
      return handleFetchItemPrices(itemsToPrice);
    },
    onSuccess: (data) => {
      if ('error' in data) {
        toast({
          title: "Error Fetching Prices",
          description: data.error,
          variant: "destructive",
        });
        // Fallback to showing list without prices if API fails
        setPricedShoppingList(shoppingListStored.map(item => ({...item, price: undefined })));
        setTotalCost(0);
      } else {
        setPricedShoppingList(data.pricedItems);
        setTotalCost(data.totalCost);
        toast({
          title: "Prices Updated",
          description: "Simulated item prices have been fetched.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to Fetch Prices",
        description: error.message,
        variant: "destructive",
      });
      setPricedShoppingList(shoppingListStored.map(item => ({...item, price: undefined })));
      setTotalCost(0);
    }
  });

  useEffect(() => {
    if (isClient && shoppingListStored.length > 0) {
      // Check if the stored list is different from the priced list structure (e.g. items added/removed)
      // or if priced list is empty. This logic might need refinement based on how often prices should refresh.
      const listNeedsPriceUpdate = pricedShoppingList.length !== shoppingListStored.length || 
                                   !pricedShoppingList.every(pItem => shoppingListStored.find(sItem => sItem.id === pItem.id));

      if (listNeedsPriceUpdate || pricedShoppingList.length === 0) {
         priceFetchMutation.mutate(shoppingListStored);
      } else {
        // If lists are structurally the same, ensure pricedShoppingList reflects current checked status etc.
        // This is a bit complex if we don't store prices.
        // A simpler approach: just refetch if shoppingListStored changes significantly.
        // For now, the above check is basic. If items are just checked/unchecked, prices won't refetch.
        // Let's update pricedShoppingList to match structure and checked status of shoppingListStored
        // but keep existing prices if possible.
        const currentPricedItemsMap = new Map(pricedShoppingList.map(item => [item.id, item.price]));
        const updatedPricedList = shoppingListStored.map(sItem => ({
            ...sItem,
            price: currentPricedItemsMap.get(sItem.id) // Keep existing price if item still exists
        }));
        
        const newTotalCost = updatedPricedList.reduce((sum, item) => sum + (item.price || 0), 0);
        setPricedShoppingList(updatedPricedList);
        setTotalCost(parseFloat(newTotalCost.toFixed(2)));

      }
    } else if (isClient && shoppingListStored.length === 0) {
      setPricedShoppingList([]);
      setTotalCost(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, shoppingListStored]); // Rerun when shoppingListStored changes

  const handleUpdateItem = (updatedItem: ShoppingListItem) => {
    // Update in localStorage first
    const newStoredList = shoppingListStored.map(item => item.id === updatedItem.id ? updatedItem : item);
    setShoppingListStored(newStoredList);
    
    // Then update the priced list (locally, prices might become stale until next fetch)
    const newPricedList = pricedShoppingList.map(item => item.id === updatedItem.id ? {...updatedItem, price: item.price} : item);
    setPricedShoppingList(newPricedList);
    
    // Recalculate total cost based on the locally updated priced list
    const newTotalCost = newPricedList.reduce((sum, item) => sum + (item.price || 0), 0);
    setTotalCost(parseFloat(newTotalCost.toFixed(2)));
  };

  const handleRemoveItem = (itemId: string) => {
    setShoppingListStored(prevList => prevList.filter(item => item.id !== itemId));
    // pricedShoppingList will update via useEffect watching shoppingListStored
    toast({ title: "Item Removed", description: "The item has been removed from your list." });
  };
  
  const handleClearChecked = () => {
    setShoppingListStored(prevList => prevList.filter(item => !item.checked));
    toast({ title: "Checked Items Cleared", description: "All checked items have been removed." });
  };

  const handleClearAll = () => {
    setShoppingListStored([]);
    toast({ title: "List Cleared", description: "Your shopping list is now empty." });
  };

  const handleAddItemManually = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      toast({ title: "Invalid Item", description: "Please enter an item name.", variant: "destructive" });
      return;
    }
    const quantity = parseFloat(newItemQty);
    if (isNaN(quantity) || quantity <= 0) {
      toast({ title: "Invalid Quantity", description: "Please enter a valid positive quantity.", variant: "destructive" });
      return;
    }

    const newItem: ShoppingListItem = {
      id: `manual-${Date.now()}`,
      name: newItemName.trim(),
      quantity: quantity,
      unit: newItemUnit.trim(),
      checked: false,
      recipeTitle: "Manually Added",
      // Price will be fetched by the useEffect
    };

    setShoppingListStored(prevList => [...prevList, newItem]);
    setNewItemName('');
    setNewItemQty('1');
    setNewItemUnit('');
    toast({ title: "Item Added", description: `${newItem.name} has been added to your list.` });
  };

  const listToDisplay = useMemo(() => {
    // If prices are fetching, or pricedShoppingList is empty but shoppingListStored isn't,
    // it implies we should show stored items (possibly without prices yet).
    if (priceFetchMutation.isPending || (pricedShoppingList.length === 0 && shoppingListStored.length > 0)) {
      return shoppingListStored.map(item => ({...item, price: pricedShoppingList.find(p => p.id === item.id)?.price}));
    }
    return pricedShoppingList;
  }, [priceFetchMutation.isPending, pricedShoppingList, shoppingListStored]);


  if (!isClient) {
     return ( 
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary">My Shopping List</h1>
        <Card className="w-full max-w-2xl mx-auto shadow-md"><CardContent className="p-6"><Skeleton className="h-10 w-full" /></CardContent></Card>
        <div className="bg-muted h-64 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="text-yellow-500 mr-2 h-5 w-5" />
        <p className="text-sm text-muted-foreground">Prices shown are for simulation purposes only.</p>
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Add Item Manually</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItemManually} className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:gap-3">
            <div className="flex-grow">
              <label htmlFor="itemName" className="sr-only">Item Name</label>
              <Input 
                id="itemName"
                type="text" 
                value={newItemName} 
                onChange={e => setNewItemName(e.target.value)} 
                placeholder="Item name (e.g., Apples)"
                className="text-base"
              />
            </div>
            <div className="flex gap-3">
              <div className="w-1/2 sm:w-auto">
                <label htmlFor="itemQty" className="sr-only">Quantity</label>
                <Input 
                  id="itemQty"
                  type="number" 
                  value={newItemQty} 
                  onChange={e => setNewItemQty(e.target.value)} 
                  placeholder="Qty"
                  min="0.1"
                  step="0.1"
                  className="w-full text-base"
                />
              </div>
              <div className="w-1/2 sm:w-auto">
                <label htmlFor="itemUnit" className="sr-only">Unit</label>
                <Input 
                  id="itemUnit"
                  type="text" 
                  value={newItemUnit} 
                  onChange={e => setNewItemUnit(e.target.value)} 
                  placeholder="Unit (e.g., kg, pcs)"
                  className="w-full text-base"
                />
              </div>
            </div>
            <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Item
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <ShoppingListDisplay 
        items={listToDisplay}
        totalCost={totalCost}
        isLoadingPrices={priceFetchMutation.isPending}
        onUpdateItem={handleUpdateItem}
        onRemoveItem={handleRemoveItem}
        onClearChecked={handleClearChecked}
        onClearAll={handleClearAll}
        onRefreshPrices={() => shoppingListStored.length > 0 && priceFetchMutation.mutate(shoppingListStored)}
      />
    </div>
  );
}

