// src/app/favorites/page.tsx
"use client";

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { Recipe, ShoppingListItem } from '@/lib/types';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeDisplay } from '@/components/RecipeDisplay';
import { Button } from '@/components/ui/button';
import { HeartCrack, ShoppingBasket } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favoriteRecipes', []);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingListItem[]>('shoppingList', []);
  const { toast } = useToast();

  // Client-side check for hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleToggleFavorite = (recipeToToggle: Recipe) => {
    setFavorites(prevFavorites => {
      const isCurrentlyFavorite = prevFavorites.some(fav => fav.id === recipeToToggle.id);
      if (isCurrentlyFavorite) {
        return prevFavorites.filter(fav => fav.id !== recipeToToggle.id);
      } else {
        // This case should not happen if toggling from favorites page, but good for consistency
        return [...prevFavorites, { ...recipeToToggle, isFavorite: true }];
      }
    });
    // If the currently selected recipe is the one being unfavorited, unselect it
    if (selectedRecipe && selectedRecipe.id === recipeToToggle.id) {
      setSelectedRecipe(null);
    }
    toast({
        title: "Removed from Favorites",
        description: `${recipeToToggle.title} is no longer a favorite.`,
    });
  };
  
  const handleSelectRecipe = (recipe: Recipe) => {
    // Ensure the selected recipe reflects its current favorite status from the source of truth (localStorage)
    const currentFavoriteStatus = favorites.find(fav => fav.id === recipe.id)?.isFavorite || false;
    setSelectedRecipe({...recipe, isFavorite: currentFavoriteStatus});
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
     toast({
      title: "Added to Shopping List!",
      description: `Ingredients are now in your list.`,
    });
  };

  if (!isClient) {
    return ( // Skeleton or loading state for SSR/hydration
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primary">My Favorite Recipes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="bg-muted h-64 rounded-lg animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-10">
        <HeartCrack className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">No Favorites Yet</h1>
        <p className="text-muted-foreground text-lg">
          Start exploring and add some recipes you love!
        </p>
        <Button asChild className="mt-6">
          <a href="/">Find Recipes</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary tracking-tight">My Favorite Recipes</h1>
      
      {selectedRecipe ? (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto my-8">
            <RecipeDisplay 
              recipe={selectedRecipe} 
              onToggleFavorite={handleToggleFavorite}
              onAddToShoppingList={handleAddToShoppingList}
            />
            <Button onClick={() => setSelectedRecipe(null)} variant="outline" className="mt-4 w-full">
              Close Recipe
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={{...recipe, isFavorite: true}} // Ensure isFavorite is true when rendering from favorites
              onToggleFavorite={handleToggleFavorite}
              onSelectRecipe={handleSelectRecipe}
              className="animate-fadeIn"
            />
          ))}
        </div>
      )}

      {favorites.length > 0 && !selectedRecipe && (
         <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="mt-8 mx-auto flex items-center gap-2">
                <Trash2 className="h-4 w-4"/> Clear All Favorites
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will remove all your favorite recipes. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  setFavorites([]);
                  toast({ title: "Favorites Cleared", description: "All your favorite recipes have been removed."});
                }}>
                  Yes, Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      )}
    </div>
  );
}
