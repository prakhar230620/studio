
// src/app/page.tsx
"use client";

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { RecipeForm, type RecipeFormValues } from '@/components/RecipeForm';
import { RecipeDisplay } from '@/components/RecipeDisplay';
import { handleGenerateRecipeAction } from '@/lib/actions';
import type { Recipe } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
// Alert components are not used here anymore if error handling is solely in RecipeForm
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Terminal } from "lucide-react";

export default function HomePage() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favoriteRecipes', []);

  const mutation = useMutation({
    mutationFn: (data: { prompt: string; baseServings?: number }) => handleGenerateRecipeAction(data),
    onSuccess: (data) => {
      if ('error' in data) {
        console.error("Error from action:", data.error);
        // Error is displayed via RecipeForm's error prop
      } else {
        const updatedRecipe = { ...data, isFavorite: favorites.some(fav => fav.id === data.id) };
        setCurrentRecipe(updatedRecipe);
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
       // Error is displayed via RecipeForm's error prop
    }
  });

  const handleFormSubmit = async (data: RecipeFormValues) => {
    setCurrentRecipe(null); // Clear previous recipe
    
    let detailedPrompt = data.mainPrompt;

    // RecipeName is removed from form, so this block is no longer needed.
    // if (data.recipeName) {
    //   detailedPrompt += `\nThe recipe should ideally be titled something like or related to: "${data.recipeName}".`;
    // }
    if (data.servings) {
      detailedPrompt += `\nIt absolutely must serve ${data.servings} people. The ingredients listed should be for this many servings. Ensure the 'servings' field in your output correctly reflects this number.`;
    }
    if (data.dietaryPreferences && data.dietaryPreferences.length > 0) {
      detailedPrompt += `\nKey dietary considerations: ${data.dietaryPreferences.join(', ')}. Adhere to these strictly.`;
    }
    if (data.cookTimeOption && data.cookTimeOption !== "any") {
      if (data.cookTimeOption === "customTime" && data.customCookTime) {
        detailedPrompt += `\nThe preferred total cooking time (prep + cook) should be around ${data.customCookTime} minutes.`;
      } else if (data.cookTimeOption !== "customTime") {
        const timeLabel = data.cookTimeOption.replace('min', ' minutes').replace('hour', ' hour');
        detailedPrompt += `\nThe preferred total cooking time (prep + cook) should be approximately ${timeLabel}.`;
      }
    }
    if (data.healthOptions && data.healthOptions.length > 0) {
      detailedPrompt += `\nHealth and flavor profile: ${data.healthOptions.join(', ')}. For example, if 'spicy' is chosen, make it noticeably spicy. If 'low-sugar', minimize added sugars.`;
    }

    detailedPrompt += "\nEnsure the output is a JSON object with 'title', 'ingredients' (array of strings), 'instructions' (string), and 'servings' (number) fields.";

    await mutation.mutateAsync({ prompt: detailedPrompt, baseServings: data.servings });
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

  return (
    <div className="flex flex-col items-center space-y-8 py-8">
      <RecipeForm 
        onRecipeGenerated={(recipe) => setCurrentRecipe(recipe)} // This prop might not be needed if RecipeForm directly calls onSubmitPrompt
        isLoading={mutation.isPending}
        onSubmitPrompt={handleFormSubmit}
        error={mutation.isError ? (mutation.error as Error).message : (mutation.data && 'error' in mutation.data ? mutation.data.error : null)}
      />
      
      {currentRecipe && (
        <RecipeDisplay 
          recipe={currentRecipe} 
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}
