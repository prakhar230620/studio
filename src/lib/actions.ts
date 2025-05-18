
// src/lib/actions.ts
"use server";

import { generateRecipe, type GenerateRecipeInput, type GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import type { Recipe, Ingredient } from '@/lib/types';

const parseIngredientString = (originalStr: string): Pick<Ingredient, 'name' | 'quantity' | 'unit' | 'originalQuantity'> => {
  const str = originalStr.toLowerCase().trim();

  let quantity: number = 1;
  let unit: string = '';
  let name: string = originalStr.trim(); // Default to original string, trimmed

  // Handle "to taste", "as needed" or similar, where quantity is not numerical
  if (/(to taste|as needed|for garnish|optional)/i.test(str)) {
    return { name: originalStr.trim(), quantity: 0, unit: "special", originalQuantity: 0 };
  }

  const quantityRegexSrc = '(?:\\d+\\s*-\\s*\\d+|\\d+\\s*\\/\\s*\\d+|\\d*\\.\\d+|\\d+)';
  const unitsList = [
    'tablespoons?', 'tbsp?s?\\.?', 'tbs\\.?', 'T\\.?',
    'teaspoons?', 'tsp?s?\\.?', 't\\.?',
    'cups?', 'c\\.?',
    'ounces?', 'oz\\.?',
    'pounds?', 'lbs?\\.?', 'lb', // lb without s
    'grams?', 'gm?s?\\.?', 'g\\.?',
    'kilograms?', 'kg\\.?',
    'milliliters?', 'ml\\.?',
    'liters?', 'l\\.?',
    'pinch(?:es)?', 'dash(?:es)?',
    'cloves?', 'cans?', 'packages?', 'pkg\\.?', 'sticks?', 'bunch(?:es)?',
    'heads?', 'slices?', 'pieces?', 'pc?s?\\.?'
  ];
  const unitRegexSrc = `\\b(?:${unitsList.join('|')})\\b`;

  const parseQuantity = (qtyStr: string | undefined): number => {
    let q = 1; // Default quantity if parsing fails or qtyStr is undefined
    if (qtyStr) {
      const trimmedQtyStr = qtyStr.trim();
      if (trimmedQtyStr.includes('-')) { // Range like "2-3"
        const parts = trimmedQtyStr.split('-').map(p => parseFloat(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          q = (parts[0] + parts[1]) / 2; // Average, or could take first
        }
      } else if (trimmedQtyStr.includes('/')) { // Fraction like "1/2"
        const parts = trimmedQtyStr.split('/').map(p => parseFloat(p.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[1] !== 0) {
          q = parts[0] / parts[1];
        }
      } else { // Decimal or integer
        const parsed = parseFloat(trimmedQtyStr);
        if (!isNaN(parsed)) q = parsed;
      }
    }
    return q;
  };
  
  let processed = false;

  // Pattern 1: QTY UNIT NAME (e.g., "2 cups flour", "1/2 tsp salt")
  // Must have a space after unit before name
  let pattern = new RegExp(`^(${quantityRegexSrc})\\s*(${unitRegexSrc})\\s+(.+)`, 'i');
  let match = str.match(pattern);
  if (match) {
    quantity = parseQuantity(match[1]);
    unit = match[2].trim();
    const preamble = new RegExp(`^${match[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*${match[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i');
    name = originalStr.trim().replace(preamble, '').trim();
    processed = true;
  }

  // Pattern 2: QTY NAME (no unit explicitly, e.g., "2 eggs", "1 large onion")
  if (!processed) {
    pattern = new RegExp(`^(${quantityRegexSrc})\\s+(.+)`, 'i');
    match = str.match(pattern);
    if (match) {
      // Check if the "name" part actually starts with a known unit. This means it was Pattern 1 where name was just one word.
      const namePart = match[2];
      const potentialUnitInNameMatch = namePart.match(new RegExp(`^(${unitRegexSrc})\\s+(.+)`, 'i'));
      const singleWordNameIsUnitMatch = namePart.match(new RegExp(`^(${unitRegexSrc})$`, 'i'));

      if (potentialUnitInNameMatch) { // e.g. "2 cups flour" matched as QTY="2", NAME="cups flour"
        quantity = parseQuantity(match[1]);
        unit = potentialUnitInNameMatch[1].trim();
        const preamble = new RegExp(`^${match[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*${potentialUnitInNameMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i');
        name = originalStr.trim().replace(preamble, '').trim();
      } else if (singleWordNameIsUnitMatch) { // e.g. "2 cups" matched as QTY="2", NAME="cups"
        quantity = parseQuantity(match[1]);
        unit = singleWordNameIsUnitMatch[1].trim();
        name = ''; // No actual name component left
      } else { // e.g. "2 large onions"
        quantity = parseQuantity(match[1]);
        unit = '';
        const preamble = new RegExp(`^${match[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i');
        name = originalStr.trim().replace(preamble, '').trim();
      }
      processed = true;
    }
  }

  // Pattern 3: NAME (QTY UNIT OptionalDetails) OptionalTrailingName (e.g., "flour (2 cups sifted) more for dusting")
  if (!processed) {
    pattern = new RegExp(`^(.*?)\\s*\\(\\s*(${quantityRegexSrc})\\s*(${unitRegexSrc})?(.*?)\\s*\\)(.*)`, 'i');
    match = str.match(pattern);
    if (match) {
      const namePartBeforeParen = match[1].trim();
      quantity = parseQuantity(match[2]);
      unit = match[3] ? match[3].trim() : '';
      // detailsInParen = match[4].trim(); // can be used if needed
      const namePartAfterParen = match[5].trim();
      
      // Reconstruct name from original string parts to preserve case
      const openParenIndex = originalStr.toLowerCase().indexOf('(');
      const closeParenIndex = originalStr.toLowerCase().indexOf(')', openParenIndex);

      if (openParenIndex !== -1 && closeParenIndex !== -1) {
          const origNamePart1 = originalStr.substring(0, openParenIndex).trim();
          const origNamePart2 = originalStr.substring(closeParenIndex + 1).trim();
          name = (origNamePart1 + (origNamePart2 ? ' ' + origNamePart2 : '')).trim();
      } else { 
          name = (namePartBeforeParen + (namePartAfterParen ? ' ' + namePartAfterParen : '')).trim();
      }
      if (!name.trim() && (namePartBeforeParen || namePartAfterParen)) { // Fallback if original string based name is empty
        name = (namePartBeforeParen + (namePartAfterParen ? ' ' + namePartAfterParen : '')).trim();
      }
      processed = true;
    }
  }
  
  // Pattern 4: NAME (QTY) OptionalTrailingName (e.g. "large onions (2) finely chopped")
  if (!processed) {
      pattern = new RegExp(`^(.*?)\\s*\\(\\s*(${quantityRegexSrc})\\s*\\)(.*)`, 'i');
      match = str.match(pattern);
      if (match) {
        const namePartBeforeParen = match[1].trim();
        quantity = parseQuantity(match[2]);
        unit = ''; // No unit in this pattern's parenthesis
        const namePartAfterParen = match[3].trim();

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
  // Example: "All-purpose flour 2 cups" -> name="All-purpose flour", qty=2, unit="cups"
  // This is a bit risky and less precise
  if (!processed && name === originalStr.trim()) {
    const fallbackPattern = new RegExp(`^(.*?)\\s+(${quantityRegexSrc})\\s*(${unitRegexSrc})?$`, 'i');
    const fallbackMatch = str.match(fallbackPattern);
    if (fallbackMatch) {
        const potentialName = fallbackMatch[1].trim();
        const potentialQtyStr = fallbackMatch[2];
        const potentialUnitStr = fallbackMatch[3];

        // Ensure potentialName is not empty and not just a number itself.
        if (potentialName && isNaN(parseFloat(potentialName))) {
            name = originalStr.trim().substring(0, originalStr.toLowerCase().indexOf(potentialQtyStr.toLowerCase())).trim();
            quantity = parseQuantity(potentialQtyStr);
            unit = potentialUnitStr ? potentialUnitStr.trim() : '';
            processed = true;
        }
    }
  }
  
  // Fallback for trailing number if not processed: "Ingredient Name 2"
  if (!processed && name === originalStr.trim()) {
    let trailingNumMatch = name.match(/^(.*?)\s*(\d+\.?\d*)$/);
    // Check that the potential name part isn't empty and isn't itself parseable as just a number
    if (trailingNumMatch && trailingNumMatch[1].trim() && isNaN(parseFloat(trailingNumMatch[1].trim()))) {
        const potentialName = trailingNumMatch[1].trim();
        const potentialQty = parseFloat(trailingNumMatch[2]);
        name = potentialName;
        quantity = potentialQty;
        unit = ''; 
        // processed = true; // Mark as processed by this fallback
    }
  }


  // Final check: if name is empty but original string wasn't, restore original string as name.
  if (!name.trim() && originalStr.trim()) {
    name = originalStr.trim();
    if (quantity === 1 && unit === '') { // only reset quantity if it was default
        // keep potentially parsed quantity if name just got lost
    }
  }
  
  // If quantity is 0 (parsed or default) and it's not a "special" unit type (like "to taste"), default to 1.
  if (quantity === 0 && unit !== "special") {
      quantity = 1;
  }

  return {
    name: name.trim(),
    quantity,
    originalQuantity: quantity, // Store the parsed quantity as original
    unit: unit.trim(),
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
