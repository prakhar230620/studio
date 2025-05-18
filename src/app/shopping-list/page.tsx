// src/app/shopping-list/page.tsx
"use client";

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { ShoppingListItem } from '@/lib/types';
import { ShoppingListDisplay } from '@/components/ShoppingListDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingListItem[]>('shoppingList', []);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('');
  const { toast } = useToast();

  // Client-side check for hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleUpdateItem = (updatedItem: ShoppingListItem) => {
    setShoppingList(prevList => prevList.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleRemoveItem = (itemId: string) => {
    setShoppingList(prevList => prevList.filter(item => item.id !== itemId));
    toast({ title: "Item Removed", description: "The item has been removed from your list." });
  };
  
  const handleClearChecked = () => {
    setShoppingList(prevList => prevList.filter(item => !item.checked));
    toast({ title: "Checked Items Cleared", description: "All checked items have been removed." });
  };

  const handleClearAll = () => {
    setShoppingList([]);
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
      recipeTitle: "Manually Added" // Or some other general category
    };

    setShoppingList(prevList => [...prevList, newItem]);
    setNewItemName('');
    setNewItemQty('1');
    setNewItemUnit('');
    toast({ title: "Item Added", description: `${newItem.name} has been added to your list.` });
  };

  if (!isClient) {
     return ( // Skeleton or loading state for SSR/hydration
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary">My Shopping List</h1>
        <div className="bg-muted h-64 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
        items={shoppingList}
        onUpdateItem={handleUpdateItem}
        onRemoveItem={handleRemoveItem}
        onClearChecked={handleClearChecked}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
