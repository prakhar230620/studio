
// src/lib/actions.ts
"use server";

import { generateRecipe, type GenerateRecipeInput, type GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import type { Recipe, Ingredient } from '@/lib/types'; // Removed ShoppingListItem as it's not used here

const parseIngredientString = (originalStr: string): Pick<Ingredient, 'name' | 'quantity' | 'unit' | 'originalQuantity'> => {
  const str = originalStr.toLowerCase().trim();

  let quantity: number = 1;
  let unit: string = '';
  let name: string = originalStr.trim(); // Default to original string, trimmed

  if (/(to taste|as needed|for garnish|optional)/i.test(str)) {
    return { name: originalStr.trim(), quantity: 0, unit: "special", originalQuantity: 0 };
  }

  const quantityRegexSrc = '(?:\\d+\\s*-\\s*\\d+|\\d+\\s*\\/\\s*\\d+|\\d*\\.\\d+|\\d+)';
  const unitsList = [
    'tablespoons?', 'tbsp?s?\\.?', 'tbs\\.?', 'T\\.?',
    'teaspoons?', 'tsp?s?\\.?', 't\\.?',
    'cups?', 'c\\.?',
    'ounces?', 'oz\\.?',
    'pounds?', 'lbs?\\.?', 'lb',
    'grams?', 'gm?s?\\.?', 'g\\.?',
    'kilograms?', 'kg\\.?',
    'milliliters?', 'ml\\.?',
    'liters?', 'l\\.?', 'L',
    'pinch(?:es)?', 'dash(?:es)?',
    'cloves?', 'cans?', 'packages?', 'pkg\\.?', 'sticks?', 'bunch(?:es)?',
    'heads?', 'slices?', 'pieces?', 'pc?s?\\.?'
  ];
  const unitRegexSrc = `\\b(?:${unitsList.join('|')})\\b`;

  const parseQuantity = (qtyStr: string | undefined): number => {
    let q = 1; 
    if (qtyStr) {
      const trimmedQtyStr = qtyStr.trim();
      if (trimmedQtyStr.includes('-')) { 
        const parts = trimmedQtyStr.split('-').map(p => parseFloat(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          q = (parts[0] + parts[1]) / 2; 
        }
      } else if (trimmedQtyStr.includes('/')) { 
        const parts = trimmedQtyStr.split('/').map(p => parseFloat(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[1] !== 0) {
          q = parts[0] / parts[1];
        }
      } else { 
        const parsed = parseFloat(trimmedQtyStr);
        if (!isNaN(parsed)) q = parsed;
      }
    }
    return q;
  };
  
  let processed = false;

  // Pattern 1: QTY UNIT NAME (e.g., "2 cups flour", "1/2 tsp salt")
  let pattern1 = new RegExp(`^(${quantityRegexSrc})\\s*(${unitRegexSrc})\\s+(.+)`, 'i');
  let match1 = str.match(pattern1);
  if (match1) {
    quantity = parseQuantity(match1[1]);
    unit = match1[2].trim().replace(/\.$/, ''); // Remove trailing dot from unit
    const preamble = new RegExp(`^${match1[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*${match1[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i');
    name = originalStr.trim().replace(preamble, '').trim();
    processed = true;
  }

  // Pattern 2: QTY NAME (no unit explicitly, e.g., "2 eggs", "1 large onion")
  if (!processed) {
    let pattern2 = new RegExp(`^(${quantityRegexSrc})\\s+(.+)`, 'i');
    let match2 = str.match(pattern2);
    if (match2) {
      const namePart = match2[2];
      const potentialUnitInNameMatch = namePart.match(new RegExp(`^(${unitRegexSrc})\\s+(.+)`, 'i'));
      const singleWordNameIsUnitMatch = namePart.match(new RegExp(`^(${unitRegexSrc})$`, 'i'));

      if (potentialUnitInNameMatch) { 
        quantity = parseQuantity(match2[1]);
        unit = potentialUnitInNameMatch[1].trim().replace(/\.$/, '');
        const preamble = new RegExp(`^${match2[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*${potentialUnitInNameMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i');
        name = originalStr.trim().replace(preamble, '').trim();
      } else if (singleWordNameIsUnitMatch) { 
        quantity = parseQuantity(match2[1]);
        unit = singleWordNameIsUnitMatch[1].trim().replace(/\.$/, '');
        name = ''; 
      } else { 
        quantity = parseQuantity(match2[1]);
        unit = '';
        const preamble = new RegExp(`^${match2[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i');
        name = originalStr.trim().replace(preamble, '').trim();
      }
      processed = true;
    }
  }

  // Pattern 3: NAME (QTY UNIT OptionalDetails) OptionalTrailingName (e.g., "flour (2 cups sifted) more for dusting")
  if (!processed) {
    let pattern3 = new RegExp(`^(.*?)\\s*\\(\\s*(${quantityRegexSrc})\\s*(${unitRegexSrc})?(.*?)\\s*\\)(.*)`, 'i');
    let match3 = str.match(pattern3);
    if (match3) {
      const namePartBeforeParen = match3[1].trim();
      quantity = parseQuantity(match3[2]);
      unit = match3[3] ? match3[3].trim().replace(/\.$/, '') : '';
      const namePartAfterParen = match3[5].trim();
      
      const openParenIndex = originalStr.toLowerCase().indexOf('(');
      const closeParenIndex = originalStr.toLowerCase().indexOf(')', openParenIndex);

      if (openParenIndex !== -1 && closeParenIndex !== -1) {
          const origNamePart1 = originalStr.substring(0, openParenIndex).trim();
          const origNamePart2 = originalStr.substring(closeParenIndex + 1).trim();
          name = (origNamePart1 + (origNamePart2 ? ' ' + origNamePart2 : '')).trim();
      } else { 
          name = (namePartBeforeParen + (namePartAfterParen ? ' ' + namePartAfterParen : '')).trim();
      }
      if (!name.trim() && (namePartBeforeParen || namePartAfterParen)) {
        name = (namePartBeforeParen + (namePartAfterParen ? ' ' + namePartAfterParen : '')).trim();
      }
      processed = true;
    }
  }
  
  // Pattern 4: NAME (QTY) OptionalTrailingName (e.g. "large onions (2) finely chopped")
  if (!processed) {
      let pattern4 = new RegExp(`^(.*?)\\s*\\(\\s*(${quantityRegexSrc})\\s*\\)(.*)`, 'i');
      let match4 = str.match(pattern4);
      if (match4) {
        const namePartBeforeParen = match4[1].trim();
        quantity = parseQuantity(match4[2]);
        unit = '';
        const namePartAfterParen = match4[3].trim();

        const openParenIndex = originalStr.toLowerCase().indexOf('(');
        const closeParenIndex = originalStr.toLowerCase().indexOf(')', openParenIndex);

        if (openParenIndex !== -1 && closeParenIndex !== -1) {
            const origNamePart1 = originalStr.substring(0, openParenIndex).trim();
            const origNamePart2 = originalStr.substring(closeParenIndex + 1).trim();
            name = (origNamePart1 + (origNamePart2 ? ' ' + origNamePart2 : '')).trim();
        } else {
            name = (namePartBeforeParen + (namePartAfterParen ? ' ' + namePartAfterParen : '')).trim();
        }
        if (!name.trim() && (namePartBeforeParen || namePartAfterParen)) {
            name = (namePartBeforeParen + (namePartAfterParen ? ' ' + namePartAfterParen : '')).trim();
        }
        processed = true;
      }
  }

  // Fallback: If not processed, and the original string (now in 'name') potentially contains a quantity at the end
  if (!processed && name === originalStr.trim()) {
    const fallbackPattern = new RegExp(`^(.*?)\\s+(${quantityRegexSrc})\\s*(${unitRegexSrc})?$`, 'i');
    const fallbackMatch = str.match(fallbackPattern);
    if (fallbackMatch) {
        const potentialName = fallbackMatch[1].trim();
        const potentialQtyStr = fallbackMatch[2];
        const potentialUnitStr = fallbackMatch[3];

        if (potentialName && isNaN(parseFloat(potentialName))) {
            name = originalStr.trim().substring(0, originalStr.toLowerCase().indexOf(potentialQtyStr.toLowerCase())).trim();
            quantity = parseQuantity(potentialQtyStr);
            unit = potentialUnitStr ? potentialUnitStr.trim().replace(/\.$/, '') : '';
            processed = true;
        }
    }
  }
  
  if (!processed && name === originalStr.trim()) {
    let trailingNumMatch = name.match(/^(.*?)\\s*(\d+\\.?\\d*)$/);
    if (trailingNumMatch && trailingNumMatch[1].trim() && isNaN(parseFloat(trailingNumMatch[1].trim()))) {
        const potentialName = trailingNumMatch[1].trim();
        const potentialQty = parseFloat(trailingNumMatch[2]);
        name = potentialName;
        quantity = potentialQty;
        unit = ''; 
    }
  }

  if (!name.trim() && originalStr.trim()) {
    name = originalStr.trim();
  }
  
  if (quantity === 0 && unit !== "special") {
      quantity = 1;
  }
   // Normalize common units
  const unitLower = unit.toLowerCase();
  if (['tbsp', 'tbs', 't', 'tablespoon'].includes(unitLower)) unit = 'tbsp';
  if (['tsp', 't', 'teaspoon'].includes(unitLower)) unit = 'tsp';
  if (['g', 'gm', 'gms', 'gram'].includes(unitLower)) unit = 'g';
  if (['kg', 'kilogram'].includes(unitLower)) unit = 'kg';
  if (['ml', 'milliliter', 'millilitre'].includes(unitLower)) unit = 'ml';
  if (['l', 'liter', 'litre'].includes(unitLower)) unit = 'L'; // Capital L for Liter
  if (['pc', 'pcs', 'piece'].includes(unitLower)) unit = 'piece';
  if (['pkg', 'package'].includes(unitLower)) unit = 'package';


  return {
    name: name.trim(),
    quantity,
    originalQuantity: quantity,
    unit: unit.trim(),
  };
};

export async function handleGenerateRecipeAction(input: GenerateRecipeInput): Promise<Recipe | { error: string }> {
  try {
    const aiResponse: GenerateRecipeOutput = await generateRecipe(input);
    
    const ingredients: Ingredient[] = aiResponse.ingredients.map((ingStr, index) => {
      const parsed = parseIngredientString(ingStr);
      return {
        id: `${Date.now()}-${index}`,
        name: parsed.name,
        quantity: parsed.quantity,
        originalQuantity: parsed.originalQuantity, // This is the quantity for the AI's baseServings
        unit: parsed.unit,
      };
    });
    
    const recipeTitle = aiResponse.title || "Untitled Recipe";
    const recipeServings = aiResponse.servings > 0 ? aiResponse.servings : (input.baseServings || 2);

    const recipe: Recipe = {
      id: Date.now().toString(),
      title: recipeTitle,
      ingredients,
      instructions: aiResponse.instructions,
      servings: recipeServings, // User requested or AI decided servings
      baseServings: recipeServings, // AI generated ingredients for this many servings
      imageUrl: aiResponse.imageUrl,
      isFavorite: false,
    };
    return recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { error: `Failed to generate recipe: ${errorMessage}` };
  }
}
