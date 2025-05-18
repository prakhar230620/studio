// src/components/RecipeForm.tsx
"use client";

import type React from 'react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import type { Recipe } from '@/lib/types';

const recipeFormSchema = z.object({
  prompt: z.string(), // Removed .min(10, ...)
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  onRecipeGenerated: (recipe: Recipe) => void;
  isLoading: boolean;
  onSubmitPrompt: (data: RecipeFormValues) => Promise<void>;
  error: string | null;
}

export function RecipeForm({ onRecipeGenerated, isLoading, onSubmitPrompt, error }: RecipeFormProps) {
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleSubmit: SubmitHandler<RecipeFormValues> = async (data) => {
    await onSubmitPrompt(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">Generate Your Recipe</CardTitle>
        <CardDescription className="text-center">
          Tell us what you're in the mood for, any ingredients you have, or a cuisine you'd like to try!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="prompt" className="text-lg">Your Recipe Idea</FormLabel>
                  <FormControl>
                    <Textarea
                      id="prompt"
                      placeholder="e.g., 'a quick pasta dish with chicken and spinach' or 'vegetarian curry with coconut milk'"
                      className="min-h-[100px] resize-none text-base"
                      {...field}
                      aria-invalid={form.formState.errors.prompt ? "true" : "false"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full text-lg py-6 bg-accent hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Create My Recipe!"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
