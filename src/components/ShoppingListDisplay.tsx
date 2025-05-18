
// src/components/ShoppingListDisplay.tsx
"use client";

import type React from 'react';
import type { ShoppingListItem } from '@/lib/types'; // Keep for type reference if needed, but items prop is new type
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input'; // No more direct editing here
import { Trash2, PackageOpen } from 'lucide-react'; // Removed Edit3, Save, X, Plus, Minus
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
// import { useToast } from "@/hooks/use-toast"; // Toasts handled by parent

// Define the new prop type for aggregated items
interface AggregatedShoppingListItem {
  key: string; 
  name: string;
  totalQuantity: number;
  unit: string;
  checked: boolean;
}

interface ShoppingListDisplayProps {
  items: AggregatedShoppingListItem[];
  onUpdateItem: (updatedItem: AggregatedShoppingListItem) => void; // For checked status
  onRemoveItem: (itemKey: string) => void; // To remove from displayed aggregated list
  onClearChecked: () => void;
  onClearAll: () => void; // Clears the current displayed aggregated list
}

export function ShoppingListDisplay({ 
  items, 
  onUpdateItem, 
  onRemoveItem, 
  onClearChecked, 
  onClearAll
}: ShoppingListDisplayProps) {
  // const { toast } = useToast(); // Parent will handle toasts

  // Editing logic removed as it's complex for aggregated items
  // const [editingItemId, setEditingItemId] = useState<string | null>(null);
  // const [editValues, setEditValues] = useState<{ name: string; quantity: string; unit: string }>({ name: '', quantity: '', unit: '' });


  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <PackageOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-primary mb-2">Your Aggregated Shopping List is Empty</h2>
        <p className="text-muted-foreground">Select recipes or add items manually to see them here.</p>
      </div>
    );
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-primary font-bold">Aggregated Shopping List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Removed grouping by recipeTitle, list is now flat */}
        <ul className="space-y-3">
          {items.map(item => (
            <li key={item.key} className={`flex items-center gap-3 p-3 rounded-md transition-colors ${item.checked ? 'bg-muted/50 opacity-70' : 'bg-card hover:bg-muted/30'}`}>
              <Checkbox
                id={`item-${item.key}`}
                checked={item.checked}
                onCheckedChange={(checked) => onUpdateItem({ ...item, checked: !!checked })}
                aria-label={`Mark ${item.name} as ${item.checked ? 'unchecked' : 'checked'}`}
              />
              {/* Displaying aggregated item - no direct editing or quantity adjustment */}
              <label htmlFor={`item-${item.key}`} className={`flex-grow cursor-pointer ${item.checked ? 'line-through' : ''}`}>
                <span className="font-medium">{item.name}</span>
                <span className="text-sm ml-1">
                  ({item.totalQuantity % 1 === 0 ? item.totalQuantity : item.totalQuantity.toFixed(2)}{' '} 
                  {item.unit || 'unit(s)'})
                </span>
              </label>
              {/* Removed edit and quantity adjustment buttons */}
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
          ))}
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

