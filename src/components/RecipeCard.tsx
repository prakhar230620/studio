// src/components/RecipeCard.tsx
"use client";

import type React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // If navigating to a detail page
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Utensils, Trash2 } from "lucide-react";
import type { Recipe } from '@/lib/types';

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite?: (recipe: Recipe) => void;
  onSelectRecipe?: (recipe: Recipe) => void; // For displaying details without navigation
  showFavoriteButton?: boolean;
  className?: string;
}

export function RecipeCard({ recipe, onToggleFavorite, onSelectRecipe, showFavoriteButton = true, className }: RecipeCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click if button is inside
    onToggleFavorite?.(recipe);
  };

  const handleCardClick = () => {
    if (onSelectRecipe) {
      onSelectRecipe(recipe);
    }
    // If using Link for navigation, this click might be redundant or handled by Link itself
  };

  const shortInstructions = recipe.instructions.substring(0, 100) + (recipe.instructions.length > 100 ? "..." : "");

  return (
    <Card 
      className={`w-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col group hover:scale-[1.02] ${className} ${onSelectRecipe ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
      aria-label={`View recipe: ${recipe.title}`}
    >
      {recipe.imageUrl && (
        <div className="relative w-full h-48 rounded-t-lg overflow-hidden">
          <Image 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            layout="fill" 
            objectFit="cover" 
            className="group-hover:brightness-105 transition-all duration-300"
          />
        </div>
      )}
      <CardHeader className="pb-2 flex-grow">
        <CardTitle className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground pb-4 flex-grow">
        <p>{shortInstructions}</p>
        {recipe.servings > 0 && <p className="mt-2 text-xs">Servings: {recipe.servings}</p>}
      </CardContent>
      {showFavoriteButton && onToggleFavorite && (
        <CardFooter className="p-4 border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleFavoriteClick} 
            className="w-full text-foreground/70 hover:text-primary"
            aria-label={recipe.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`mr-2 h-4 w-4 ${recipe.isFavorite ? "text-red-500 fill-red-500" : "text-muted-foreground group-hover:text-primary transition-colors"}`} />
            {recipe.isFavorite ? "Favorited" : "Favorite"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
