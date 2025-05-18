
// src/app/shopping-list/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { ShoppingListItem } from '@/lib/types';
import { ShoppingListDisplay } from '@/components/ShoppingListDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, ListFilter, Recycle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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

// This type is for the final list passed to ShoppingListDisplay
interface AggregatedShoppingListItem {
  key: string; // Unique key for React list, e.g., "Flour-gram"
  name: string;
  totalQuantity: number; // This will be the display quantity (e.g., 1.25 for kg)
  unit: string; // This will be the display unit (e.g., "kg")
  checked: boolean;
}

// Internal type for aggregation map using base units
interface InternalAggregatedItem {
    name: string;
    totalBaseQuantity: number;
    baseUnit: string;
    originalUnitForDisplay: string; // Store the first original unit encountered for non-convertible types
    checked: boolean; // This might need refinement, how to handle checked status across aggregations
}

const unitMap: { [key: string]: { baseUnit: string; multiplier: number; type: 'weight' | 'volume' | 'count' | 'other' } } = {
  // Weight - Base: gram
  g: { baseUnit: 'gram', multiplier: 1, type: 'weight' },
  gram: { baseUnit: 'gram', multiplier: 1, type: 'weight' },
  grams: { baseUnit: 'gram', multiplier: 1, type: 'weight' },
  gm: { baseUnit: 'gram', multiplier: 1, type: 'weight' },
  gms: { baseUnit: 'gram', multiplier: 1, type: 'weight' },
  kg: { baseUnit: 'gram', multiplier: 1000, type: 'weight' },
  kilogram: { baseUnit: 'gram', multiplier: 1000, type: 'weight' },
  kilograms: { baseUnit: 'gram', multiplier: 1000, type: 'weight' },
  // Volume - Base: milliliter
  ml: { baseUnit: 'milliliter', multiplier: 1, type: 'volume' },
  milliliter: { baseUnit: 'milliliter', multiplier: 1, type: 'volume' },
  milliliters: { baseUnit: 'milliliter', multiplier: 1, type: 'volume' },
  millilitre: { baseUnit: 'milliliter', multiplier: 1, type: 'volume' },
  millilitres: { baseUnit: 'milliliter', multiplier: 1, type: 'volume' },
  l: { baseUnit: 'milliliter', multiplier: 1000, type: 'volume' },
  liter: { baseUnit: 'milliliter', multiplier: 1000, type: 'volume' },
  liters: { baseUnit: 'milliliter', multiplier: 1000, type: 'volume' },
  litre: { baseUnit: 'milliliter', multiplier: 1000, type: 'volume' },
  litres: { baseUnit: 'milliliter', multiplier: 1000, type: 'volume' },
  // Common Kitchen Units (treated as 'other' or 'count' depending on interpretation)
  tbsp: { baseUnit: 'tablespoon', multiplier: 1, type: 'other' },
  tbs: { baseUnit: 'tablespoon', multiplier: 1, type: 'other' },
  tablespoon: { baseUnit: 'tablespoon', multiplier: 1, type: 'other' },
  tablespoons: { baseUnit: 'tablespoon', multiplier: 1, type: 'other' },
  tsp: { baseUnit: 'teaspoon', multiplier: 1, type: 'other' },
  tsps: { baseUnit: 'teaspoon', multiplier: 1, type: 'other' },
  teaspoon: { baseUnit: 'teaspoon', multiplier: 1, type: 'other' },
  teaspoons: { baseUnit: 'teaspoon', multiplier: 1, type: 'other' },
  cup: { baseUnit: 'cup', multiplier: 1, type: 'other' },
  cups: { baseUnit: 'cup', multiplier: 1, type: 'other' },
  // Pieces / Counts
  pc: { baseUnit: 'piece', multiplier: 1, type: 'count' },
  pcs: { baseUnit: 'piece', multiplier: 1, type: 'count' },
  piece: { baseUnit: 'piece', multiplier: 1, type: 'count' },
  pieces: { baseUnit: 'piece', multiplier: 1, type: 'count' },
  // Other common recipe units
  can: { baseUnit: 'can', multiplier: 1, type: 'count' },
  cans: { baseUnit: 'can', multiplier: 1, type: 'count' },
  pkg: { baseUnit: 'package', multiplier: 1, type: 'count' },
  package: { baseUnit: 'package', multiplier: 1, type: 'count' },
  packages: { baseUnit: 'package', multiplier: 1, type: 'count' },
  stick: { baseUnit: 'stick', multiplier: 1, type: 'count' },
  sticks: { baseUnit: 'stick', multiplier: 1, type: 'count' },
  bunch: { baseUnit: 'bunch', multiplier: 1, type: 'count' },
  bunches: { baseUnit: 'bunch', multiplier: 1, type: 'count' },
  head: { baseUnit: 'head', multiplier: 1, type: 'count' },
  heads: { baseUnit: 'head', multiplier: 1, type: 'count' },
  slice: { baseUnit: 'slice', multiplier: 1, type: 'count' },
  slices: { baseUnit: 'slice', multiplier: 1, type: 'count' },
  clove: { baseUnit: 'clove', multiplier: 1, type: 'count' },
  cloves: { baseUnit: 'clove', multiplier: 1, type: 'count' },
  pinch: { baseUnit: 'pinch', multiplier: 1, type: 'other' },
  pinches: { baseUnit: 'pinch', multiplier: 1, type: 'other' },
  dash: { baseUnit: 'dash', multiplier: 1, type: 'other' },
  dashes: { baseUnit: 'dash', multiplier: 1, type: 'other' },
  // No unit / special
  '': { baseUnit: 'unit', multiplier: 1, type: 'count' },
  unit: { baseUnit: 'unit', multiplier: 1, type: 'count' },
  units: { baseUnit: 'unit', multiplier: 1, type: 'count' },
  'to taste': { baseUnit: 'to taste', multiplier: 1, type: 'other'},
  'as needed': { baseUnit: 'as needed', multiplier: 1, type: 'other'},
  optional: { baseUnit: 'optional', multiplier: 1, type: 'other'},
  special: { baseUnit: 'special', multiplier: 1, type: 'other' }, // For "to taste" etc from parser
};

function getBaseEquivalent(quantity: number, unit: string): { baseQuantity: number; baseUnit: string; originalUnit: string } {
  const normalizedUnitInput = unit.toLowerCase().replace(/\.$/, '').trim();
  const mapping = unitMap[normalizedUnitInput];

  if (mapping) {
    return {
      baseQuantity: quantity * mapping.multiplier,
      baseUnit: mapping.baseUnit,
      originalUnit: unit 
    };
  }
  return { baseQuantity: quantity, baseUnit: unit.trim() || 'unit', originalUnit: unit };
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

    const internalAggregationMap = new Map<string, InternalAggregatedItem>();

    itemsToConsider.forEach(item => {
      const { baseQuantity, baseUnit, originalUnit } = getBaseEquivalent(item.quantity, item.unit);
      const key = `${item.name.toLowerCase().trim()}-${baseUnit}`;
      
      if (internalAggregationMap.has(key)) {
        const existing = internalAggregationMap.get(key)!;
        existing.totalBaseQuantity += baseQuantity;
      } else {
        internalAggregationMap.set(key, {
          name: item.name, 
          totalBaseQuantity: baseQuantity,
          baseUnit: baseUnit,
          originalUnitForDisplay: originalUnit, // Store the first original unit encountered
          checked: false, 
        });
      }
    });

    // Convert internal aggregation to displayable format (AggregatedShoppingListItem)
    const displayableList: AggregatedShoppingListItem[] = [];
    internalAggregationMap.forEach((aggItem, key) => {
      let displayQuantity = aggItem.totalBaseQuantity;
      let displayUnit = aggItem.baseUnit;

      if (aggItem.baseUnit === 'gram' && aggItem.totalBaseQuantity >= 1000) {
        displayQuantity = aggItem.totalBaseQuantity / 1000;
        displayUnit = 'kg';
      } else if (aggItem.baseUnit === 'milliliter' && aggItem.totalBaseQuantity >= 1000) {
        displayQuantity = aggItem.totalBaseQuantity / 1000;
        displayUnit = 'liter';
      } else if (aggItem.baseUnit === 'gram' || aggItem.baseUnit === 'milliliter') {
        // Keep as grams or milliliters if less than 1000
        displayUnit = aggItem.baseUnit;
      } else {
         // For other units (piece, tbsp, etc.), use the originally stored unit for display consistency if needed, or just baseUnit
        displayUnit = aggItem.originalUnitForDisplay || aggItem.baseUnit;
      }
      
      // Ensure "special" units display correctly without a quantity if quantity is 0
      if (['to taste', 'as needed', 'optional', 'special'].includes(aggItem.baseUnit) && displayQuantity === 0) {
         displayUnit = aggItem.baseUnit; // display "to taste" etc.
      }


      displayableList.push({
        key,
        name: aggItem.name,
        totalQuantity: displayQuantity,
        unit: displayUnit,
        checked: aggItem.checked, 
      });
    });
    
    return displayableList.sort((a,b) => a.name.localeCompare(b.name));

  }, [allShoppingListItems, selectedRecipeTitles, isClient]);

  const [displayedListItems, setDisplayedListItems] = useState<AggregatedShoppingListItem[]>([]);

  useEffect(() => {
    // Reset checked status when underlying aggregated list changes structure
    setDisplayedListItems(aggregatedShoppingList.map(item => ({...item, checked: false })));
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
    setAllShoppingListItems([]); 
    setDisplayedListItems([]); 
    setSelectedRecipeTitles([]); 
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
      checked: false, 
      recipeTitle: "Manually Added",
    };

    setAllShoppingListItems(prevList => [...prevList, newItem]);
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
                  min="0.01" // Allow smaller quantities
                  step="0.01" // Allow finer steps
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
        items={displayedListItems} // This now contains items with final display quantity & unit
        onUpdateItem={handleUpdateAggregatedItem}
        onRemoveItem={handleRemoveAggregatedItem} 
        onClearChecked={handleClearCheckedAggregatedItems} 
        onClearAll={handleClearAllAggregatedItemsFromView} 
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

