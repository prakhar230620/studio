
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  originalQuantity: number; // Quantity for baseServings
  unit: string;
  // fullText: string; // Original text from AI if needed
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  servings: number;
  baseServings: number; // The number of servings the original quantities are for
  imageUrl?: string;
  isFavorite?: boolean;
}

// ShoppingListItem interface removed
