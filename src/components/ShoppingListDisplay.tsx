// src/components/ShoppingListDisplay.tsx
"use client";

import type React from 'react';
import { useState, useMemo } from 'react';
import type { ShoppingListItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Trash2, Edit3, Save, X, Plus, Minus, PackageOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface ShoppingListDisplayProps {
  items: ShoppingListItem[];
  onUpdateItem: (updatedItem: ShoppingListItem) => void;
  onRemoveItem: (itemId: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
}

export function ShoppingListDisplay({ items, onUpdateItem, onRemoveItem, onClearChecked, onClearAll }: ShoppingListDisplayProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ name: string; quantity: string; unit: string }>({ name: '', quantity: '', unit: '' });
  const { toast } = useToast();

  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      const groupKey = item.recipeTitle || 'General Items';
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
    onUpdateItem({ 
      id: itemId, 
      name: editValues.name, 
      quantity: newQuantity, 
      unit: editValues.unit, 
      checked: items.find(i => i.id === itemId)?.checked || false,
      recipeTitle: items.find(i => i.id === itemId)?.recipeTitle
    });
    setEditingItemId(null);
    toast({ title: "Item Updated", description: `${editValues.name} has been updated.` });
  };
  
  const handleQuantityChange = (item: ShoppingListItem, amount: number) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity > 0) {
      onUpdateItem({ ...item, quantity: newQuantity });
    } else {
      onRemoveItem(item.id); // Remove if quantity becomes 0 or less
      toast({ title: "Item Removed", description: `${item.name} has been removed from the list.`});
    }
  };


  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <PackageOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold text-primary mb-2">Your Shopping List is Empty</h2>
        <p className="text-muted-foreground">Add ingredients from recipes or manually.</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-primary font-bold">My Shopping List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedItems).map(([recipeTitle, groupItems]) => (
          <div key={recipeTitle}>
            <h3 className="text-lg font-semibold text-accent mb-2 border-b pb-1">{recipeTitle}</h3>
            <ul className="space-y-3">
              {groupItems.map(item => (
                <li key={item.id} className={`flex items-center gap-3 p-3 rounded-md transition-colors ${item.checked ? 'bg-muted/50 line-through text-muted-foreground' : 'bg-card hover:bg-muted/30'}`}>
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.checked}
                    onCheckedChange={(checked) => onUpdateItem({ ...item, checked: !!checked })}
                    aria-label={`Mark ${item.name} as ${item.checked ? 'unchecked' : 'checked'}`}
                  />
                  {editingItemId === item.id ? (
                    <>
                      <Input value={editValues.name} onChange={e => setEditValues(prev => ({...prev, name: e.target.value}))} className="h-8 text-sm flex-grow" aria-label="Edit item name"/>
                      <Input type="number" value={editValues.quantity} onChange={e => setEditValues(prev => ({...prev, quantity: e.target.value}))} className="h-8 text-sm w-16" aria-label="Edit item quantity"/>
                      <Input value={editValues.unit} onChange={e => setEditValues(prev => ({...prev, unit: e.target.value}))} className="h-8 text-sm w-20" aria-label="Edit item unit"/>
                      <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(item.id)} aria-label="Save changes"> <Save className="h-4 w-4 text-green-600"/> </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingItemId(null)} aria-label="Cancel edit"> <X className="h-4 w-4 text-red-600"/> </Button>
                    </>
                  ) : (
                    <>
                      <label htmlFor={`item-${item.id}`} className="flex-grow cursor-pointer">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm ml-1">({item.quantity} {item.unit})</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item, -1)} aria-label={`Decrease quantity of ${item.name}`}> <Minus className="h-4 w-4"/> </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item, 1)} aria-label={`Increase quantity of ${item.name}`}> <Plus className="h-4 w-4"/> </Button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} aria-label={`Edit ${item.name}`}> <Edit3 className="h-4 w-4 text-blue-600"/> </Button>
                      <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.id)} aria-label={`Remove ${item.name}`}> <Trash2 className="h-4 w-4 text-red-600"/> </Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
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
      </CardContent>
    </Card>
  );
}
