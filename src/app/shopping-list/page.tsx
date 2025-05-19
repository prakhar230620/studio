
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
import { PlusCircle, Trash2, ListFilter, Recycle, Replace, Printer, Share2, CheckCircle } from 'lucide-react';
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

interface AggregatedShoppingListItem {
  key: string;
  name: string;
  totalQuantity: number; 
  unit: string;          
  checked: boolean;
  baseUnit: string;        
  totalBaseQuantity: number; 
  isConvertible: boolean;  
}

interface InternalAggregatedItem {
    name: string;
    totalBaseQuantity: number;
    baseUnit: string;
    checked: boolean; 
}

// Standard conversions: 1 cup = 240ml, 1 tbsp = 15ml, 1 tsp = 5ml
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
  // Common Kitchen Units - Mapped to milliliter
  tbsp: { baseUnit: 'milliliter', multiplier: 15, type: 'volume' },
  tbs: { baseUnit: 'milliliter', multiplier: 15, type: 'volume' },
  tablespoon: { baseUnit: 'milliliter', multiplier: 15, type: 'volume' },
  tablespoons: { baseUnit: 'milliliter', multiplier: 15, type: 'volume' },
  tsp: { baseUnit: 'milliliter', multiplier: 5, type: 'volume' },
  tsps: { baseUnit: 'milliliter', multiplier: 5, type: 'volume' },
  teaspoon: { baseUnit: 'milliliter', multiplier: 5, type: 'volume' },
  teaspoons: { baseUnit: 'milliliter', multiplier: 5, type: 'volume' },
  cup: { baseUnit: 'milliliter', multiplier: 240, type: 'volume' }, // US Cup
  cups: { baseUnit: 'milliliter', multiplier: 240, type: 'volume' },
  // Pieces / Counts - Base: piece
  pc: { baseUnit: 'piece', multiplier: 1, type: 'count' },
  pcs: { baseUnit: 'piece', multiplier: 1, type: 'count' },
  piece: { baseUnit: 'piece', multiplier: 1, type: 'count' },
  pieces: { baseUnit: 'piece', multiplier: 1, type: 'count' },
  // Other common recipe units (mostly counts or specific types)
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
  // "Other" types - not typically aggregated by quantity in the same way as weight/volume/count
  pinch: { baseUnit: 'pinch', multiplier: 1, type: 'other' },
  pinches: { baseUnit: 'pinch', multiplier: 1, type: 'other' },
  dash: { baseUnit: 'dash', multiplier: 1, type: 'other' },
  dashes: { baseUnit: 'dash', multiplier: 1, type: 'other' },
  // No unit / special
  '': { baseUnit: 'unit', multiplier: 1, type: 'count' }, // Default to 'unit' if empty
  unit: { baseUnit: 'unit', multiplier: 1, type: 'count' },
  units: { baseUnit: 'unit', multiplier: 1, type: 'count' },
  'to taste': { baseUnit: 'to taste', multiplier: 1, type: 'other'},
  'as needed': { baseUnit: 'as needed', multiplier: 1, type: 'other'},
  optional: { baseUnit: 'optional', multiplier: 1, type: 'other'},
  special: { baseUnit: 'special', multiplier: 1, type: 'other' }, // For parsed "to taste", etc.
};

const specialUnits = ['to taste', 'as needed', 'optional', 'special'];


function getBaseEquivalent(quantity: number, unit: string): { baseQuantity: number; baseUnit: string } {
  const normalizedUnitInput = unit.toLowerCase().replace(/\.$/, '').trim();
  const mapping = unitMap[normalizedUnitInput];

  if (mapping) {
    return {
      baseQuantity: quantity * mapping.multiplier,
      baseUnit: mapping.baseUnit,
    };
  }
  // Fallback if unit is not in map: treat it as its own base unit (likely 'other' or 'count' type)
  return { baseQuantity: quantity, baseUnit: unit.trim() || 'unit' };
}


export default function ShoppingListPage() {
  const [allShoppingListItems, setAllShoppingListItems] = useLocalStorage<ShoppingListItem[]>('shoppingList', []);
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('');
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  const [isShareApiAvailable, setIsShareApiAvailable] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof navigator.share === 'function') {
      setIsShareApiAvailable(true);
    }
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
      const { baseQuantity, baseUnit } = getBaseEquivalent(item.quantity, item.unit);
      const key = `${item.name.toLowerCase().trim()}-${baseUnit}`; // Key includes base unit for correct aggregation
      
      if (internalAggregationMap.has(key)) {
        const existing = internalAggregationMap.get(key)!;
        existing.totalBaseQuantity += baseQuantity;
      } else {
        internalAggregationMap.set(key, {
          name: item.name, 
          totalBaseQuantity: baseQuantity,
          baseUnit: baseUnit,
          checked: false, // Default checked state for new aggregated items
        });
      }
    });

    const displayableList: AggregatedShoppingListItem[] = [];
    internalAggregationMap.forEach((aggItem, key) => {
      let displayQuantity = aggItem.totalBaseQuantity;
      let displayUnit = aggItem.baseUnit;
      let isConvertible = false;

      // Convert to larger units for display if applicable
      if (aggItem.baseUnit === 'gram') {
        isConvertible = true; // g <-> kg
        if (aggItem.totalBaseQuantity >= 1000) {
          displayQuantity = aggItem.totalBaseQuantity / 1000;
          displayUnit = 'kg';
        } else {
          displayQuantity = aggItem.totalBaseQuantity; 
          displayUnit = 'g'; 
        }
      } else if (aggItem.baseUnit === 'milliliter') {
        isConvertible = true; // ml <-> L
        if (aggItem.totalBaseQuantity >= 1000) {
          displayQuantity = aggItem.totalBaseQuantity / 1000;
          displayUnit = 'L';
        } else {
          displayQuantity = aggItem.totalBaseQuantity; 
          displayUnit = 'ml';
        }
      }
      // Other base units (piece, can, pinch, etc.) are displayed as is
      
      displayableList.push({
        key,
        name: aggItem.name,
        totalQuantity: parseFloat(displayQuantity.toFixed(2)), // Ensure 2 decimal places for display
        unit: displayUnit,
        checked: aggItem.checked, // Will be updated from displayedListItems
        baseUnit: aggItem.baseUnit,
        totalBaseQuantity: aggItem.totalBaseQuantity,
        isConvertible: isConvertible,
      });
    });
    
    return displayableList.sort((a,b) => a.name.localeCompare(b.name));

  }, [allShoppingListItems, selectedRecipeTitles, isClient]);

  const [displayedListItems, setDisplayedListItems] = useState<AggregatedShoppingListItem[]>([]);

  useEffect(() => {
    // Preserve checked state if item already exists in displayedListItems
    setDisplayedListItems(prevDisplayed => {
        return aggregatedShoppingList.map(newItem => {
            const existingItem = prevDisplayed.find(oldItem => oldItem.key === newItem.key);
            return existingItem ? { ...newItem, checked: existingItem.checked } : { ...newItem, checked: false };
        });
    });
  }, [aggregatedShoppingList]);


  const handleUpdateAggregatedItem = (updatedItem: AggregatedShoppingListItem) => {
    setDisplayedListItems(prevList => 
      prevList.map(item => item.key === updatedItem.key ? updatedItem : item)
    );
  };

  const handleRemoveAggregatedItem = (itemKey: string) => {
    const itemToRemove = displayedListItems.find(i => i.key === itemKey);
    setDisplayedListItems(prevList => prevList.filter(item => item.key !== itemKey));
    if (itemToRemove) {
        toast({ 
            title: "Item Removed from View", 
            description: `${itemToRemove.name} has been removed from the current aggregated list.`,
            action: <Trash2 className="text-destructive h-5 w-5" />
        });
    }
  };
  
  const handleToggleUnit = (itemKey: string) => {
    setDisplayedListItems(prevList =>
      prevList.map(item => {
        if (item.key === itemKey && item.isConvertible) {
          const newItem = { ...item };
          if (item.baseUnit === 'gram') {
            if (item.unit === 'g') {
              newItem.unit = 'kg';
              newItem.totalQuantity = parseFloat((item.totalBaseQuantity / 1000).toFixed(2));
            } else { // unit is 'kg'
              newItem.unit = 'g';
              newItem.totalQuantity = item.totalBaseQuantity;
            }
          } else if (item.baseUnit === 'milliliter') {
            if (item.unit === 'ml') {
              newItem.unit = 'L';
              newItem.totalQuantity = parseFloat((item.totalBaseQuantity / 1000).toFixed(2));
            } else { // unit is 'L'
              newItem.unit = 'ml';
              newItem.totalQuantity = item.totalBaseQuantity;
            }
          }
          return newItem;
        }
        return item;
      })
    );
  };

  const handleClearCheckedAggregatedItems = () => {
    setDisplayedListItems(prevList => prevList.filter(item => !item.checked));
    toast({ 
        title: "Checked Items Cleared", 
        description: "Checked items removed from current aggregated view.",
        action: <Trash2 className="text-destructive h-5 w-5" />
    });
  };

  const handleClearAllAggregatedItemsFromView = () => {
    setDisplayedListItems([]);
    toast({ 
        title: "Current List View Cleared", 
        description: "The aggregated list view is now empty.",
        action: <Trash2 className="text-destructive h-5 w-5" />
    });
  };
  
  const handleDeleteRecipeItems = (recipeTitleToDelete: string) => {
    setAllShoppingListItems(prev => prev.filter(item => item.recipeTitle !== recipeTitleToDelete));
    setSelectedRecipeTitles(prev => prev.filter(title => title !== recipeTitleToDelete));
    toast({
      title: `Items for "${recipeTitleToDelete}" Deleted`,
      description: `All shopping list items for ${recipeTitleToDelete} have been removed.`,
      action: <Trash2 className="text-destructive h-5 w-5" />
    });
  };
  
  const handleClearAllUnderlyingData = () => {
    setAllShoppingListItems([]); 
    setSelectedRecipeTitles([]); 
    toast({ 
        title: "All Shopping Data Cleared", 
        description: "Your entire shopping list history is now empty.",
        action: <Recycle className="text-destructive h-5 w-5" />
    });
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
      unit: newItemUnit.trim() || 'unit', 
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
    toast({ 
        title: "Item Added", 
        description: `${newItem.name} has been added to 'Manually Added' items.`,
        action: <CheckCircle className="text-green-500 h-5 w-5" />
    });
  };

  const handlePrintList = () => {
    window.print();
  };

  const handleShareList = async () => {
    if (!navigator.share) {
      toast({ title: "Share API not supported", description: "Your browser does not support the Web Share API.", variant: "destructive" });
      return;
    }
    const listText = displayedListItems
      .map(item => {
        const qtyStr = specialUnits.includes(item.unit.toLowerCase()) && item.totalQuantity === 0 && item.unit !== ''
          ? `` 
          : `${item.totalQuantity % 1 === 0 ? item.totalQuantity : item.totalQuantity.toFixed(2)} ${item.unit || 'unit(s)'}`;
        return `${item.name}${qtyStr ? ` (${qtyStr})` : ''}${item.checked ? ' (Purchased)' : ''}`;
      })
      .join('\n');

    const shareData = {
      title: 'My Shopping List',
      text: `Here's my shopping list:\n${listText}`,
    };
    try {
      await navigator.share(shareData);
      toast({ title: "List Shared!", description: "Your shopping list has been shared." });
    } catch (err: any) {
      if (err.name !== 'AbortError') { 
          toast({ title: "Share Failed", description: "Could not share the list.", variant: "destructive" });
      }
    }
  };


  if (!isClient) {
     return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary">My Shopping List</h1>
        <Card className="w-full max-w-2xl mx-auto shadow-md recipe-filter-card hover:shadow-lg transition-shadow duration-300 ease-in-out"><CardContent className="p-6"><Skeleton className="h-10 w-full" /></CardContent></Card>
        <div className="bg-muted h-64 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-md recipe-filter-card hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center text-primary flex items-center justify-center gap-2">
            <ListFilter className="h-5 w-5" /> Filter Recipes for Shopping List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {uniqueRecipeTitles.length > 0 ? uniqueRecipeTitles.map(title => (
            <div key={title} className="flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3 flex-grow">
                <Checkbox
                  id={`recipe-select-${title.replace(/\s+/g, '-')}`}
                  checked={selectedRecipeTitles.includes(title)}
                  onCheckedChange={(checked) => handleRecipeTitleSelectionChange(title, !!checked)}
                  aria-label={`Select recipe ${title} for shopping list`}
                />
                <Label 
                  htmlFor={`recipe-select-${title.replace(/\s+/g, '-')}`} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-grow truncate"
                  title={title}
                >
                  {title}
                </Label>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive/80 flex-shrink-0">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete all items for recipe {title}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete items for "{title}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently remove all shopping list items associated with the recipe "{title}" from your storage. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteRecipeItems(title)}>
                      Yes, Delete Items
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )) : <p className="text-sm text-muted-foreground text-center py-2">No recipes added to shopping list yet.</p>}
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl mx-auto shadow-md manual-add-item-card hover:shadow-lg transition-shadow duration-300 ease-in-out">
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
                  min="0.01"
                  step="any"
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
      
      {displayedListItems.length > 0 && (
        <Card className="w-full max-w-2xl mx-auto shadow-md shopping-list-page-actions-card hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">List Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-3 p-4">
            <Button onClick={handlePrintList} variant="outline" className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
            </Button>
            {isShareApiAvailable && (
              <Button onClick={handleShareList} variant="outline" className="w-full sm:w-auto">
                <Share2 className="mr-2 h-4 w-4" /> Share List
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <ShoppingListDisplay 
        items={displayedListItems} 
        onUpdateItem={handleUpdateAggregatedItem}
        onRemoveItem={handleRemoveAggregatedItem} 
        onClearChecked={handleClearCheckedAggregatedItems} 
        onClearAll={handleClearAllAggregatedItemsFromView}
        onToggleUnit={handleToggleUnit}
        className="hover:shadow-xl transition-shadow duration-300 ease-in-out"
      />

      {allShoppingListItems.length > 0 && (
        <div className="mt-8 flex justify-center clear-all-underlying-data-button-container">
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

    