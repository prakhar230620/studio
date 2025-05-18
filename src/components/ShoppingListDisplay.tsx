
// src/components/ShoppingListDisplay.tsx
"use client";

import type React from 'react';
import { useState, useMemo } from 'react';
import type { ShoppingListItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Trash2, Edit3, Save, X, Plus, Minus, PackageOpen, RefreshCw, Loader2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShoppingListDisplayProps {
  items: ShoppingListItem[];
  totalCost: number;
  isLoadingPrices: boolean;
  onUpdateItem: (updatedItem: ShoppingListItem) => void;
  onRemoveItem: (itemId: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
  onRefreshPrices: () => void;
}

export function ShoppingListDisplay({ 
  items, 
  totalCost,
  isLoadingPrices,
  onUpdateItem, 
  onRemoveItem, 
  onClearChecked, 
  onClearAll,
  onRefreshPrices
}: ShoppingListDisplayProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; quantity: string; unit: string }>({ name: '', quantity: '', unit: '' });
  const { toast } = useToast();

  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      const groupKey = item.recipeTitle || 'Manually Added'; // Changed 'General Items'
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {} as Record<string, ShoppingListItem[]>);
  }, [items]);

  const handleEdit = (item: ShoppingListItem) => {
    setEditingItemId(item.id);
    setEditValues({ name: item.name, quantity: item.quantity.toString(), unit: item.unit });
  };

  const handleSaveEdit = (itemId: string) => {
    const newQuantity = parseFloat(editValues.quantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      toast({ title: "Invalid quantity", description: "Please enter a valid positive number.", variant: "destructive" });
      return;
    }
    const currentItem = items.find(i => i.id === itemId);
    if (currentItem) {
        onUpdateItem({ 
        ...currentItem, // keep other properties like 'checked', 'recipeTitle', 'price'
        name: editValues.name, 
        quantity: newQuantity, 
        unit: editValues.unit,
        });
    }
    setEditingItemId(null);
    toast({ title: "Item Updated", description: `${editValues.name} has been updated.` });
  };
  
  const handleQuantityChange = (item: ShoppingListItem, amount: number) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity > 0) {
      onUpdateItem({ ...item, quantity: newQuantity });
    } else {
      // If reducing quantity to 0 or less, confirm removal or set to minimum 0.1?
      // For now, let's remove it.
      onRemoveItem(item.id); 
      toast({ title: "Item Removed", description: `${item.name} quantity reached zero.`});
    }
  };


  if (items.length === 0 && !isLoadingPrices) {
    return (
      <div className="text-center py-10">
        <PackageOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-primary mb-2">Your Shopping List is Empty</h2>
        <p className="text-muted-foreground">Add ingredients from recipes or manually.</p>
      </div>
    );
  }
  
  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-primary font-bold">My Shopping List</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRefreshPrices} disabled={isLoadingPrices} aria-label="Refresh prices">
                {isLoadingPrices ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh Prices (Simulated)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedItems).map(([recipeTitle, groupItems]) => (
          <div key={recipeTitle}>
            <h3 className="text-lg font-semibold text-accent mb-2 border-b pb-1">{recipeTitle}</h3>
            <ul className="space-y-3">
              {groupItems.map(item => (
                <li key={item.id} className={`flex items-center gap-3 p-3 rounded-md transition-colors ${item.checked ? 'bg-muted/50 opacity-70' : 'bg-card hover:bg-muted/30'}`}>
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.checked}
                    onCheckedChange={(checked) => onUpdateItem({ ...item, checked: !!checked })}
                    aria-label={`Mark ${item.name} as ${item.checked ? 'unchecked' : 'checked'}`}
                  />
                  {editingItemId === item.id ? (
                    <>
                      <Input value={editValues.name} onChange={e => setEditValues(prev => ({...prev, name: e.target.value}))} className="h-8 text-sm flex-grow" aria-label="Edit item name"/>
                      <Input type="number" value={editValues.quantity} onChange={e => setEditValues(prev => ({...prev, quantity: e.target.value}))} className="h-8 text-sm w-16" aria-label="Edit item quantity" min="0"/>
                      <Input value={editValues.unit} onChange={e => setEditValues(prev => ({...prev, unit: e.target.value}))} className="h-8 text-sm w-20" aria-label="Edit item unit"/>
                      <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(item.id)} aria-label="Save changes"> <Save className="h-4 w-4 text-green-600"/> </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingItemId(null)} aria-label="Cancel edit"> <X className="h-4 w-4 text-red-600"/> </Button>
                    </>
                  ) : (
                    <>
                      <label htmlFor={`item-${item.id}`} className={`flex-grow cursor-pointer ${item.checked ? 'line-through' : ''}`}>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm ml-1">({item.quantity} {item.unit || 'unit(s)'})</span>
                      </label>
                      <div className="flex items-center gap-1">
                        {isLoadingPrices && item.price === undefined ? (
                            <Skeleton className="h-5 w-10" />
                        ) : item.price !== undefined ? (
                          <span className="text-sm font-semibold text-primary w-16 text-right pr-1">
                            {currencyFormatter.format(item.price)}
                          </span>
                        ) : (
                           <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                 <span className="text-sm text-muted-foreground w-16 text-right pr-1">
                                    <Info className="h-4 w-4 inline"/>
                                 </span>
                              </TooltipTrigger>
                              <TooltipContent><p>Price not available</p></TooltipContent>
                            </Tooltip>
                           </TooltipProvider>
                        )}
                        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item, -1)} aria-label={`Decrease quantity of ${item.name}`} className="h-7 w-7"> <Minus className="h-3 w-3"/> </Button>
                        <span className="w-6 text-center tabular-nums">{item.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item, 1)} aria-label={`Increase quantity of ${item.name}`} className="h-7 w-7"> <Plus className="h-3 w-3"/> </Button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} aria-label={`Edit ${item.name}`} className="h-8 w-8"> <Edit3 className="h-4 w-4 text-blue-600"/> </Button>
                      <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)} aria-label={`Remove ${item.name}`} className="h-8 w-8"> <Trash2 className="h-4 w-4 text-red-600"/> </Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        {items.length > 0 && (
            <CardFooter className="flex flex-col items-end gap-2 pt-4 border-t mt-4">
                <div className="text-lg font-semibold">
                    Total Estimated Cost: 
                    {isLoadingPrices && totalCost === 0 ? (
                        <Skeleton className="h-6 w-20 inline-block ml-2" />
                    ) : (
                        <span className="text-primary ml-2">{currencyFormatter.format(totalCost)}</span>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full sm:w-auto justify-end">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto" disabled={!items.some(item => item.checked)}>Clear Checked</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Clear Checked Items?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogDescription>Are you sure you want to remove all checked items from your shopping list?</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onClearChecked}>Clear Checked</AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">Clear All</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Clear Entire List?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogDescription>Are you sure you want to remove ALL items from your shopping list? This cannot be undone.</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onClearAll}>Clear All</AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
          </CardFooter>
        )}
      </CardContent>
    </Card>
  );
}

