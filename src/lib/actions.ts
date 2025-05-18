// src/lib/actions.ts
"use server";

import { generateRecipe, type GenerateRecipeInput, type GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import type { Recipe, Ingredient } from '@/lib/types';

// Simplified ingredient parser
const parseIngredientString = (ingredientStr: string): Pick<Ingredient, 'name' | 'quantity' | 'unit' | 'originalQuantity'> => {
  let quantity: number = 1; // Default quantity
  let unit: string = '';
  let name: string = ingredientStr;

  // Try to match "Number Unit Name" e.g., "2 cups flour" or "1/2 tsp salt"
  const commonPattern = ingredientStr.match(/^(\d*\.?\d+\s*\/?\s*\d*\.?\d+|\d*\.?\d+)\s*([a-zA-Zµg]+(?:\s+[a-zA-Zµg]+)?)?\s*(.*)/i);
  if (commonPattern) {
    const quantityStr = commonPattern[1]?.trim();
    if (quantityStr) {
      if (quantityStr.includes('/')) {
        const parts = quantityStr.split('/');
        if (parts.length === 2) {
          const num = parseFloat(parts[0]);
          const den = parseFloat(parts[1]);
          if (!isNaN(num) && !isNaN(den) && den !== 0) {
            quantity = num / den;
          }
        }
      } else {
        const num = parseFloat(quantityStr);
        if (!isNaN(num)) {
          quantity = num;
        }
      }
    }
    unit = commonPattern[2]?.trim() || '';
    name = commonPattern[3]?.trim() || ingredientStr; // Fallback if name part is empty
     if (!name && unit) { 
        name = unit; 
        unit = '';
    }
  } else {
    // Try to match "Number Name" e.g., "2 eggs"
    const quantityFirstPattern = ingredientStr.match(/^(\d*\.?\d+\s*\/?\s*\d*\.?\d+|\d*\.?\d+)\s+(.*)/i);
    if (quantityFirstPattern) {
      const quantityStr = quantityFirstPattern[1]?.trim();
       if (quantityStr) {
        if (quantityStr.includes('/')) {
          const parts = quantityStr.split('/');
          if (parts.length === 2) {
            const num = parseFloat(parts[0]);
            const den = parseFloat(parts[1]);
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
              quantity = num / den;
            }
          }
        } else {
          const num = parseFloat(quantityStr);
          if (!isNaN(num)) {
            quantity = num;
          }
        }
      }
      name = quantityFirstPattern[2]?.trim() || ingredientStr;
    }
    // If no pattern matches, name is the full string, quantity is 1, unit is empty.
  }
  
  // Ensure name is not empty
  if (!name.trim() && ingredientStr.trim()) {
    name = ingredientStr.trim();
  }


  return {
    name: name || ingredientStr, // Fallback to full string
    quantity,
    originalQuantity: quantity,
    unit,
  };
};

export async function handleGenerateRecipeAction(input: GenerateRecipeInput): Promise<Recipe | { error: string }> {
  try {
    const aiResponse: GenerateRecipeOutput = await generateRecipe(input);
    const baseServings = 2; // Default assumption for servings from AI

    const ingredients: Ingredient[] = aiResponse.ingredients.map((ingStr, index) => {
      const parsed = parseIngredientString(ingStr);
      return {
        id: `${Date.now()}-${index}`, // Simple unique ID
        name: parsed.name,
        quantity: parsed.quantity,
        originalQuantity: parsed.originalQuantity,
        unit: parsed.unit,
      };
    });
    
    const recipeTitle = aiResponse.title || "Untitled Recipe";
    const recipe: Recipe = {
      id: Date.now().toString(),
      title: recipeTitle,
      ingredients,
      instructions: aiResponse.instructions,
      servings: baseServings,
      baseServings: baseServings,
      imageUrl: `https://placehold.co/600x400.png`,
      isFavorite: false,
    };
    return recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    // Check if error is an instance of Error and has a message property
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { error: `Failed to generate recipe: ${errorMessage}` };
  }
}
