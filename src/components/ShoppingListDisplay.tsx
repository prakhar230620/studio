
// src/components/ShoppingListDisplay.tsx
"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, PackageOpen, Replace } from 'lucide-react'; // Added Replace
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

interface AggregatedShoppingListItem {
  key: string; 
  name: string;
  totalQuantity: number;
  unit: string;
  checked: boolean;
  baseUnit: string; // For toggling
  totalBaseQuantity: number; // For toggling
  isConvertible: boolean; // For toggling
}

interface ShoppingListDisplayProps {
  items: AggregatedShoppingListItem[];
  onUpdateItem: (updatedItem: AggregatedShoppingListItem) => void;
  onRemoveItem: (itemKey: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
  onToggleUnit: (itemKey: string) => void; // New prop
}

const specialUnits = ['to taste', 'as needed', 'optional', 'special'];

export function ShoppingListDisplay({ 
  items, 
  onUpdateItem, 
  onRemoveItem, 
  onClearChecked, 
  onClearAll,
  onToggleUnit // New prop
}: ShoppingListDisplayProps) {

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <PackageOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-primary mb-2">Your Aggregated Shopping List is Empty</h2>
        <p className="text-muted-foreground">Select recipes or add items manually to see them here.</p>
      </div>
    );
  }
  
  const getNextUnit = (item: AggregatedShoppingListItem): string | null => {
    if (!item.isConvertible) return null;
    if (item.baseUnit === 'gram') {
      return item.unit === 'g' ? 'kg' : 'g';
    }
    if (item.baseUnit === 'milliliter') {
      return item.unit === 'ml' ? 'L' : 'ml';
    }
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-primary font-bold">Aggregated Shopping List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-3">
          {items.map(item => {
            const nextUnit = getNextUnit(item);
            return (
              <li key={item.key} className={`flex items-center gap-3 p-3 rounded-md transition-colors ${item.checked ? 'bg-muted/50 opacity-70' : 'bg-card hover:bg-muted/30'}`}>
                <Checkbox
                  id={`item-${item.key}`}
                  checked={item.checked}
                  onCheckedChange={(checked) => onUpdateItem({ ...item, checked: !!checked })}
                  aria-label={`Mark ${item.name} as ${item.checked ? 'unchecked' : 'checked'}`}
                />
                <label htmlFor={`item-${item.key}`} className={`flex-grow cursor-pointer ${item.checked ? 'line-through' : ''}`}>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm ml-1 text-muted-foreground">
                    { specialUnits.includes(item.unit.toLowerCase()) && item.totalQuantity === 0
                      ? `(${item.unit})`
                      : `(${item.totalQuantity % 1 === 0 ? item.totalQuantity : item.totalQuantity.toFixed(2)} ${item.unit || 'unit(s)'})`
                    }
                  </span>
                </label>
                {item.isConvertible && nextUnit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleUnit(item.key)}
                    aria-label={`Switch unit for ${item.name} to ${nextUnit}`}
                    className="h-7 w-7 text-muted-foreground hover:text-primary"
                    title={`Switch to ${nextUnit}`}
                  >
                    <Replace className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveItem(item.key)} 
                  aria-label={`Remove ${item.name} from this list view`} 
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4 text-red-600"/>
                </Button>
              </li>
            );
          })}
        </ul>
        
        {items.length > 0 && (
            <CardFooter className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-4 border-t mt-4">
                <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full sm:w-auto sm:justify-end">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto" disabled={!items.some(item => item.checked)}>Clear Checked from View</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Clear Checked Items?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogDescription>Are you sure you want to remove all checked items from the current shopping list view?</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onClearChecked}>Clear Checked</AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">Clear All from View</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Clear Entire List View?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogDescription>Are you sure you want to remove ALL items from the current shopping list view? This does not delete your underlying shopping data.</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onClearAll}>Clear All From View</AlertDialogAction>
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

