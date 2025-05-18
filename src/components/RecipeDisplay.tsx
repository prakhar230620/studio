
// src/components/RecipeDisplay.tsx
"use client";

import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Plus, Minus, CheckCircle, ChefHat } from "lucide-react";
import type { Recipe, Ingredient, ShoppingListItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from '@/hooks/useLocalStorage';

interface RecipeDisplayProps {
  recipe: Recipe;
  onAddToShoppingList: (items: ShoppingListItem[]) => void;
  onToggleFavorite: (recipe: Recipe) => void;
}

export function RecipeDisplay({ recipe, onAddToShoppingList, onToggleFavorite }: RecipeDisplayProps) {
  const [currentServings, setCurrentServings] = useState<number>(recipe.servings);
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(recipe.isFavorite || false);

  useEffect(() => {
    setCurrentServings(recipe.servings);
    setIsFavorited(recipe.isFavorite || false);
  }, [recipe]);

  const adjustedIngredients = useMemo(() => {
    if (!recipe.ingredients || recipe.baseServings <= 0) return recipe.ingredients;
    const scaleFactor = currentServings / recipe.baseServings;
    return recipe.ingredients.map(ing => ({
      ...ing,
      quantity: parseFloat((ing.originalQuantity * scaleFactor).toFixed(2)), // Keep 2 decimal places
    }));
  }, [recipe.ingredients, currentServings, recipe.baseServings]);

  const handleServingsChange = (newServings: number) => {
    if (newServings > 0 && newServings <= 100) { // Max 100 servings
      setCurrentServings(newServings);
    }
  };

  const handleAddAllToShoppingList = () => {
    const items: ShoppingListItem[] = adjustedIngredients.map(ing => ({
      id: `${recipe.id}-${ing.id}`,
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      checked: false,
      recipeTitle: recipe.title,
    }));
    onAddToShoppingList(items);
    toast({
      title: "Added to Shopping List!",
      description: `${recipe.title} ingredients are now in your list.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };

  const handleToggleFavorite = () => {
    const newFavoriteStatus = !isFavorited;
    setIsFavorited(newFavoriteStatus);
    onToggleFavorite({ ...recipe, isFavorite: newFavoriteStatus });
    toast({
      title: newFavoriteStatus ? "Added to Favorites!" : "Removed from Favorites",
      description: `${recipe.title} ${newFavoriteStatus ? 'is now a favorite.' : 'is no longer a favorite.'}`,
      action: newFavoriteStatus ? <Heart className="text-red-500 fill-red-500" /> : <Heart className="text-gray-500" />,
    });
  };

  if (!recipe) return null;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl mt-8 animate-fadeIn">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">{recipe.title}</CardTitle>
        {recipe.imageUrl && (
          <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden shadow-md">
            <Image 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              layout="fill" 
              objectFit="cover" 
              data-ai-hint="food photography delicious meal"
              className="transform hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6 px-6 py-8">
        <div>
          <Label htmlFor="servings" className="text-lg font-semibold flex items-center gap-2">
            <ChefHat className="text-accent" /> Servings:
          </Label>
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" size="icon" onClick={() => handleServingsChange(currentServings - 1)} disabled={currentServings <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="servings"
              type="number"
              value={currentServings}
              onChange={(e) => handleServingsChange(parseInt(e.target.value, 10))}
              min="1"
              max="100"
              className="w-20 text-center text-lg"
            />
            <Button variant="outline" size="icon" onClick={() => handleServingsChange(currentServings + 1)} disabled={currentServings >= 100}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-3 text-foreground/90">Ingredients</h3>
          <ul className="list-disc list-inside space-y-2 pl-2 text-foreground/80">
            {adjustedIngredients.map((ing, index) => (
              <li key={index} className="text-base">
                {ing.quantity > 0 ? `${ing.quantity} ` : ""}
                {ing.unit ? `${ing.unit} ` : ""}
                {ing.name}
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <h3 className="text-xl font-semibold mb-3 text-foreground/90">Instructions</h3>
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-foreground/80 whitespace-pre-line">
            {recipe.instructions.split('\n').map((line, index) => (
                <p key={index} className="mb-2">{line}</p>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-6 border-t">
        <Button variant={isFavorited ? "secondary" : "outline"} onClick={handleToggleFavorite} className="w-full sm:w-auto text-base py-3">
          <Heart className={`mr-2 h-5 w-5 ${isFavorited ? 'text-red-500 fill-red-500' : ''}`} />
          {isFavorited ? 'Favorited' : 'Add to Favorites'}
        </Button>
        <Button onClick={handleAddAllToShoppingList} className="w-full sm:w-auto text-base py-3 bg-accent hover:bg-accent/90">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add All to Shopping List
        </Button>
      </CardFooter>
    </Card>
  );
}
