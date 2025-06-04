"use client";

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { RecipeForm, type RecipeFormValues } from '@/components/RecipeForm';
import { RecipeDisplay } from '@/components/RecipeDisplay';
import { handleGenerateRecipeAction } from '@/lib/actions';
import type { Recipe } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favoriteRecipes', []);
  const t = useTranslations();

  const mutation = useMutation({
    mutationFn: (data: { prompt: string; baseServings?: number }) => handleGenerateRecipeAction(data),
    onSuccess: (data) => {
      if ('error' in data) {
        console.error("Error from action:", data.error);
        setCurrentRecipe(null); 
      } else {
        const updatedRecipe = { ...data, isFavorite: favorites.some(fav => fav.id === data.id) };
        setCurrentRecipe(updatedRecipe);
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      setCurrentRecipe(null); 
    }
  });

  const handleFormSubmit = async (data: RecipeFormValues) => {
    let detailedPrompt = data.mainPrompt;

    if (data.servings) {
      detailedPrompt += `\nIt absolutely must serve ${data.servings} people. The ingredients listed should be for this many servings. Ensure the 'servings' field in your output correctly reflects this number.`;
    }
    if (data.dietaryPreferences && data.dietaryPreferences.length > 0) {
      detailedPrompt += `\nKey dietary considerations: ${data.dietaryPreferences.join(', ')}. Adhere to these strictly.`;
    }
    if (data.cuisineType && data.cuisineType.length > 0) {
      detailedPrompt += `\nPreferred cuisine style(s): ${data.cuisineType.join(', ')}.`;
    }
    if (data.spiceLevel && data.spiceLevel !== "any") {
      detailedPrompt += `\nSpice level preference: ${data.spiceLevel.replace('_', ' ')}.`;
    }
    if (data.cookingMethod && data.cookingMethod.length > 0) {
      detailedPrompt += `\nPreferred cooking method(s): ${data.cookingMethod.join(', ')}.`;
    }
    if (data.mealType && data.mealType.length > 0) {
      detailedPrompt += `\nThis recipe is for meal type(s): ${data.mealType.join(', ')}.`;
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
      const healthPromptParts = data.healthOptions.filter(opt => !(data.spiceLevel !== "any" && opt.toLowerCase().includes("spicy")));
      if (healthPromptParts.length > 0) {
        detailedPrompt += `\nHealth and flavor profile: ${healthPromptParts.join(', ')}. For example, if 'low-sugar' is chosen, minimize added sugars.`;
      }
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

  const handleBackToForm = () => {
    setCurrentRecipe(null);
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-8">
      {currentRecipe && !mutation.isPending && !(mutation.data && 'error' in mutation.data) ? (
        <div className="w-full max-w-3xl">
          <RecipeDisplay 
            recipe={currentRecipe} 
            onToggleFavorite={handleToggleFavorite}
          />
          <Button 
            onClick={handleBackToForm} 
            variant="outline" 
            className="mt-8 w-full sm:w-auto flex items-center justify-center hover:bg-accent/10 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('recipe.createAnother')}
          </Button>
        </div>
      ) : (
        <RecipeForm 
          isLoading={mutation.isPending}
          onSubmitPrompt={handleFormSubmit}
          error={mutation.isError ? (mutation.error as Error).message : (mutation.data && 'error' in mutation.data ? mutation.data.error : null)}
        />
      )}
    </div>
  );
}