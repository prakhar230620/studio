
// src/components/RecipeDisplay.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Heart, Plus, Minus, ChefHat, Share2, Loader2 } from "lucide-react";
import type { Recipe } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { getEmojiForIngredient } from '@/lib/emoji-utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface RecipeDisplayProps {
  recipe: Recipe;
  onToggleFavorite: (recipe: Recipe) => void;
}

export function RecipeDisplay({ recipe, onToggleFavorite }: RecipeDisplayProps) {
  const [currentServings, setCurrentServings] = useState<number>(recipe.servings);
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(recipe.isFavorite || false);
  const recipeCardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    setCurrentServings(recipe.servings);
    setIsFavorited(recipe.isFavorite || false);
  }, [recipe]);

  const adjustedIngredients = useMemo(() => {
    if (!recipe.ingredients || !recipe.baseServings || recipe.baseServings <= 0) {
        return (recipe.ingredients || []).map(ing => ({
            ...ing, 
            quantity: ing.quantity || 0, 
            name: ing.name || "Unnamed Ingredient",
            unit: ing.unit || "",
            originalQuantity: ing.originalQuantity || 0,
        }));
    }
    const scaleFactor = currentServings / recipe.baseServings;
    return recipe.ingredients.map(ing => ({
      name: ing.name || "Unnamed Ingredient",
      quantity: parseFloat(((ing.quantity || 0) * scaleFactor).toFixed(2)),
      originalQuantity: ing.originalQuantity || 0,
      unit: ing.unit || "",
      id: ing.id
    }));
  }, [recipe.ingredients, currentServings, recipe.baseServings]);

  const handleServingsChange = (newServings: number) => {
    if (newServings > 0 && newServings <= 100) {
      setCurrentServings(newServings);
    }
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

  const handleShareRecipe = async () => {
    if (!recipeCardRef.current || typeof navigator === 'undefined') {
      toast({
        variant: "destructive",
        title: "Action Not Available",
        description: "This feature is only available in a browser environment.",
      });
      return;
    }

    setIsSharing(true);
    toast({
      title: "Preparing PDF...",
      description: "Please wait while the recipe PDF is being generated.",
    });

    try {
      const elementToCapture = recipeCardRef.current;
      
      const originalColors = new Map<HTMLElement, string>();
      const elementsToStyle = elementToCapture.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, p, span, li, div, label, input, button'); // Added button
      elementsToStyle.forEach(el => {
        originalColors.set(el, el.style.color);
        el.style.color = 'black'; 
      });
      const originalCardBg = elementToCapture.style.backgroundColor;
      elementToCapture.style.backgroundColor = 'white'; 

      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff', 
        onclone: (document) => {
            const imageElement = document.querySelector('.recipe-image-for-pdf') as HTMLImageElement;
            if (imageElement) {
                //
            }
            // Hide share/favorite buttons during PDF generation in cloned document
            const footerActions = document.querySelector('.recipe-display-card-footer');
            if (footerActions) {
                (footerActions as HTMLElement).style.display = 'none';
            }
        }
      });

      elementsToStyle.forEach(el => {
        if (originalColors.has(el)) {
          el.style.color = originalColors.get(el) || '';
        }
      });
      elementToCapture.style.backgroundColor = originalCardBg;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      const pdfBlob = pdf.getBlob();
      const pdfFileName = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'recipe'}.pdf`;
      const pdfFile = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          files: [pdfFile],
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
        });
        toast({
          title: "Recipe Shared!",
          description: "The recipe PDF has been shared.",
        });
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfFile);
        link.download = pdfFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href); 
        toast({
            title: "PDF Downloaded",
            description: "Recipe PDF has been downloaded as direct sharing of files is not fully supported."
        });
      }
    } catch (error) {
      console.error("Error sharing recipe:", error);
      toast({
        variant: "destructive",
        title: "Sharing Error",
        description: `An error occurred: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setIsSharing(false);
    }
  };

  if (!recipe) return null;

  return (
    <Card ref={recipeCardRef} className="w-full max-w-3xl mx-auto shadow-xl mt-8 animate-fadeIn">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center">
          <span role="img" aria-label="recipe plate emoji" className="mr-3 text-4xl">🍽️</span>
          {recipe.title}
        </CardTitle>
        {recipe.imageUrl && (
          <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden shadow-md">
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              layout="fill"
              objectFit="cover"
              className="transform hover:scale-105 transition-transform duration-300 ease-in-out recipe-image-for-pdf"
              priority 
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
            {adjustedIngredients.map((ing, index) => {
              const emoji = getEmojiForIngredient(ing.name);
              return (
                <li key={ing.id || index} className="text-base flex items-center">
                  {emoji && <span role="img" aria-label={`${ing.name} emoji`} className="mr-2 w-5 text-center text-lg">{emoji}</span>}
                  {!emoji && <span className="mr-2 w-5 text-center"></span>} {/* Alignment placeholder */}
                  <span>
                    {ing.quantity > 0 ? `${ing.quantity} ` : ""}
                    {ing.unit && ing.unit !== "special" ? `${ing.unit} ` : ""} {/* Hide unit if special and quantity is 0 */}
                    {ing.name}
                    {ing.unit === "special" && ing.quantity === 0 && ` (to taste/as needed)`} {/* Clarify special units */}
                  </span>
                </li>
              );
            })}
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
      <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 p-6 border-t recipe-display-card-footer">
        <Button variant={isFavorited ? "secondary" : "outline"} onClick={handleToggleFavorite} className="w-full sm:w-auto text-base py-3">
          <Heart className={`mr-2 h-5 w-5 ${isFavorited ? 'text-red-500 fill-red-500' : ''}`} />
          {isFavorited ? 'Favorited' : 'Add to Favorites'}
        </Button>
        {typeof navigator !== 'undefined' && ( // Show button if on client-side
            <Button
                variant="outline"
                onClick={handleShareRecipe}
                disabled={isSharing}
                className="w-full sm:w-auto text-base py-3"
            >
            {isSharing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <Share2 className="mr-2 h-5 w-5" />
            )}
            Share Recipe as PDF
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
