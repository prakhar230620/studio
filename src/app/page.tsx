// src/app/page.tsx
"use client";

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { RecipeForm } from '@/components/RecipeForm';
import { RecipeDisplay } from '@/components/RecipeDisplay';
import { handleGenerateRecipeAction } from '@/lib/actions';
import type { Recipe, ShoppingListItem } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function HomePage() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favoriteRecipes', []);
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingListItem[]>('shoppingList', []);

  const mutation = useMutation({
    mutationFn: handleGenerateRecipeAction,
    onSuccess: (data) => {
      if ('error' in data) {
        console.error("Error from action:", data.error);
        // Display error to user, perhaps using a toast or alert
      } else {
        const updatedRecipe = { ...data, isFavorite: favorites.some(fav => fav.id === data.id) };
        setCurrentRecipe(updatedRecipe);
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
       // Display error to user
    }
  });

  const handleFormSubmit = async (data: { prompt: string }) => {
    setCurrentRecipe(null); // Clear previous recipe
    await mutation.mutateAsync({ prompt: data.prompt });
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.id === recipe.id);
      if (isAlreadyFavorite) {
        return prev.filter(fav => fav.id !== recipe.id);
      } else {
        return [...prev, { ...recipe, isFavorite: true }];
      }
    });
    if (currentRecipe && currentRecipe.id === recipe.id) {
      setCurrentRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleAddToShoppingList = (items: ShoppingListItem[]) => {
    setShoppingList(prevList => {
      const newList = [...prevList];
      items.forEach(item => {
        const existingItemIndex = newList.findIndex(i => i.name === item.name && i.unit === item.unit && i.recipeTitle === item.recipeTitle);
        if (existingItemIndex > -1) {
          newList[existingItemIndex].quantity += item.quantity;
        } else {
          newList.push(item);
        }
      });
      return newList;
    });
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <RecipeForm 
        onRecipeGenerated={(recipe) => setCurrentRecipe(recipe)}
        isLoading={mutation.isPending}
        onSubmitPrompt={handleFormSubmit}
        error={mutation.isError ? (mutation.error as Error).message : (mutation.data && 'error' in mutation.data ? mutation.data.error : null)}
      />

      {mutation.isError && !mutation.data?.hasOwnProperty('error') && (
         <Alert variant="destructive" className="w-full max-w-2xl">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error Generating Recipe</AlertTitle>
           <AlertDescription>
             {(mutation.error as Error)?.message || "An unexpected error occurred. Please try again."}
           </AlertDescription>
         </Alert>
      )}
      
      {mutation.data && 'error' in mutation.data && (
         <Alert variant="destructive" className="w-full max-w-2xl">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error Generating Recipe</AlertTitle>
           <AlertDescription>
             {mutation.data.error}
           </AlertDescription>
         </Alert>
      )}


      {currentRecipe && (
        <RecipeDisplay 
          recipe={currentRecipe} 
          onAddToShoppingList={handleAddToShoppingList}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}
