
// src/app/shopping-list/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { ShoppingListItem } from '@/lib/types';
import { ShoppingListDisplay } from '@/components/ShoppingListDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox'; // Added Checkbox
import { Label } from '@/components/ui/label'; // Added Label
import { PlusCircle, Trash2, ListFilter, Recycle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AggregatedShoppingListItem {
  key: string; // Unique key for React list, e.g., "Flour-gram"
  name: string;
  totalQuantity: number;
  unit: string;
  checked: boolean;
  // sourceRecipeTitles: string[]; // For future reference
}

export default function ShoppingListPage() {
  const [allShoppingListItems, setAllShoppingListItems] = useLocalStorage<ShoppingListItem[]>('shoppingList', []);
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const uniqueRecipeTitles = useMemo(() => {
    const titles = new Set(allShoppingListItems.map(item => item.recipeTitle || "Manually Added"));
    return Array.from(titles);
  }, [allShoppingListItems]);

  const [selectedRecipeTitles, setSelectedRecipeTitles] = useState<string[]>([]);

  // Initialize selectedRecipeTitles to all unique titles when component mounts or titles change
  useEffect(() => {
    if (isClient) {
      setSelectedRecipeTitles(uniqueRecipeTitles);
    }
  }, [uniqueRecipeTitles, isClient]);

  const handleRecipeTitleSelectionChange = (title: string, isSelected: boolean) => {
    setSelectedRecipeTitles(prev => 
      isSelected ? [...prev, title] : prev.filter(t => t !== title)
    );
  };
  
  const aggregatedShoppingList = useMemo((): AggregatedShoppingListItem[] => {
    if (!isClient) return [];

    const itemsToConsider = allShoppingListItems.filter(item => 
      selectedRecipeTitles.includes(item.recipeTitle || "Manually Added")
    );

    const aggregationMap = new Map<string, AggregatedShoppingListItem>();

    itemsToConsider.forEach(item => {
      // Normalize units for common items (e.g., tbsp and tablespoon) - basic for now
      let normalizedUnit = item.unit.toLowerCase().replace(/\.$/, ''); // remove trailing dot
      if (normalizedUnit === 'tbsp' || normalizedUnit === 'tbs') normalizedUnit = 'tablespoon';
      if (normalizedUnit === 'tsp' || normalizedUnit === 'tsps') normalizedUnit = 'teaspoon';
      if (normalizedUnit === 'pcs' || normalizedUnit === 'piece') normalizedUnit = 'pc';


      const key = `${item.name.toLowerCase().trim()}-${normalizedUnit}`;
      
      if (aggregationMap.has(key)) {
        const existing = aggregationMap.get(key)!;
        existing.totalQuantity += item.quantity;
        // existing.sourceRecipeTitles.push(item.recipeTitle || "Manually Added");
      } else {
        aggregationMap.set(key, {
          key,
          name: item.name, // Preserve original casing for display from first item
          totalQuantity: item.quantity,
          unit: item.unit, // Preserve original casing for unit display
          checked: false, // Default to unchecked for aggregated items
          // sourceRecipeTitles: [item.recipeTitle || "Manually Added"],
        });
      }
    });
    return Array.from(aggregationMap.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [allShoppingListItems, selectedRecipeTitles, isClient]);

  // State for managing the checked status and existence of items in the displayed aggregated list
  const [displayedListItems, setDisplayedListItems] = useState<AggregatedShoppingListItem[]>([]);

  useEffect(() => {
    setDisplayedListItems(aggregatedShoppingList.map(item => ({...item, checked: false }))); // Reset checked status on aggregation change
  }, [aggregatedShoppingList]);


  const handleUpdateAggregatedItem = (updatedItem: AggregatedShoppingListItem) => {
    setDisplayedListItems(prevList => 
      prevList.map(item => item.key === updatedItem.key ? updatedItem : item)
    );
  };

  const handleRemoveAggregatedItem = (itemKey: string) => {
    setDisplayedListItems(prevList => prevList.filter(item => item.key !== itemKey));
    const itemToRemove = displayedListItems.find(i => i.key === itemKey);
    if (itemToRemove) {
        toast({ title: "Item Removed from View", description: `${itemToRemove.name} has been removed from the current aggregated list.` });
    }
  };
  
  const handleClearCheckedAggregatedItems = () => {
    setDisplayedListItems(prevList => prevList.filter(item => !item.checked));
    toast({ title: "Checked Items Cleared", description: "Checked items removed from current aggregated view." });
  };

  const handleClearAllAggregatedItemsFromView = () => {
    setDisplayedListItems([]);
    toast({ title: "Current List View Cleared", description: "The aggregated list view is now empty." });
  };
  
  const handleClearAllUnderlyingData = () => {
    setAllShoppingListItems([]); // This clears the local storage
    setDisplayedListItems([]); // Also clear the view
    setSelectedRecipeTitles([]); // Reset selections
    toast({ title: "All Shopping Data Cleared", description: "Your entire shopping list history is now empty." });
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
      checked: false, // Default for underlying item
      recipeTitle: "Manually Added",
    };

    setAllShoppingListItems(prevList => [...prevList, newItem]);
    // If "Manually Added" wasn't selected, select it now
    if (!selectedRecipeTitles.includes("Manually Added")) {
        setSelectedRecipeTitles(prev => [...prev, "Manually Added"]);
    }

    setNewItemName('');
    setNewItemQty('1');
    setNewItemUnit('');
    toast({ title: "Item Added", description: `${newItem.name} has been added to 'Manually Added' items.` });
  };


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
      <Card className="w-full max-w-2xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center text-primary flex items-center justify-center gap-2">
            <ListFilter className="h-5 w-5" /> Filter Recipes for Shopping List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {uniqueRecipeTitles.length > 0 ? uniqueRecipeTitles.map(title => (
            <div key={title} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <Checkbox
                id={`recipe-select-${title.replace(/\s+/g, '-')}`}
                checked={selectedRecipeTitles.includes(title)}
                onCheckedChange={(checked) => handleRecipeTitleSelectionChange(title, !!checked)}
              />
              <Label htmlFor={`recipe-select-${title.replace(/\s+/g, '-')}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-grow">
                {title}
              </Label>
            </div>
          )) : <p className="text-sm text-muted-foreground text-center">No recipes added to shopping list yet.</p>}
        </CardContent>
      </Card>

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
        items={displayedListItems}
        onUpdateItem={handleUpdateAggregatedItem}
        onRemoveItem={handleRemoveAggregatedItem} // Remove from current view
        onClearChecked={handleClearCheckedAggregatedItems} // Clear checked from current view
        onClearAll={handleClearAllAggregatedItemsFromView} // Clear all from current view
      />

      {allShoppingListItems.length > 0 && (
        <div className="mt-8 flex justify-center">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                        <Recycle className="h-4 w-4" /> Clear All Underlying Shopping Data
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action will permanently delete ALL items from your shopping list storage (across all recipes and manually added items). This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                    onClick={handleClearAllUnderlyingData}
                    >
                    Yes, delete all data
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      )}
    </div>
  );
}

