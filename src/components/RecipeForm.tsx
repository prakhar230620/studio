
// src/components/RecipeForm.tsx
"use client";

import type React from 'react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Users, Sparkles, Clock, Salad, Utensils, HeartPulse, Flame, Type } from "lucide-react";
import type { Recipe } from '@/lib/types';

const recipeFormSchema = z.object({
  mainPrompt: z.string().min(1, "Please describe your recipe idea."),
  recipeName: z.string().optional(),
  servings: z.coerce.number().min(1, "Servings must be at least 1.").default(2),
  dietaryPreferences: z.array(z.string()).optional(),
  cookTimeOption: z.enum(["any", "15min", "30min", "45min", "1hour", "customTime"]).default("any"),
  customCookTime: z.coerce.number().min(1, "Custom cook time must be at least 1 minute.").optional(),
  healthOptions: z.array(z.string()).optional(),
}).refine(data => {
  if (data.cookTimeOption === "customTime" && (data.customCookTime === undefined || data.customCookTime < 1)) {
    return false;
  }
  return true;
}, {
  message: "Please enter a valid custom cook time (at least 1 minute).",
  path: ["customCookTime"], // Path to the field that the error message will be associated with
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  onRecipeGenerated: (recipe: Recipe) => void;
  isLoading: boolean;
  onSubmitPrompt: (data: RecipeFormValues) => Promise<void>;
  error: string | null;
}

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "fat-free", label: "Fat-Free" },
];

const healthSpecificOptions = [
  { id: "low-sugar", label: "Low Sugar" },
  { id: "spicy", label: "Spicy / High Chili" },
  { id: "low-sodium", label: "Low Sodium" },
  { id: "high-protein", label: "High Protein" },
];

export function RecipeForm({ onRecipeGenerated, isLoading, onSubmitPrompt, error }: RecipeFormProps) {
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      mainPrompt: "",
      servings: 2,
      dietaryPreferences: [],
      cookTimeOption: "any",
      healthOptions: [],
    },
  });

  const watchedCookTimeOption = form.watch("cookTimeOption");

  const handleSubmit: SubmitHandler<RecipeFormValues> = async (data) => {
    // Clear customCookTime if not "customTime" to avoid sending it
    if (data.cookTimeOption !== "customTime") {
      data.customCookTime = undefined;
    }
    await onSubmitPrompt(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8" /> Create Your Perfect Recipe
        </CardTitle>
        <CardDescription className="text-center text-lg">
          Tell us your preferences, and let our AI craft a unique recipe for you!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="mainPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="mainPrompt" className="text-xl font-semibold flex items-center gap-2"><Utensils className="text-accent" /> Your Core Recipe Idea</FormLabel>
                  <FormControl>
                    <Textarea
                      id="mainPrompt"
                      placeholder="e.g., 'a quick pasta dish with chicken and spinach', 'a hearty lentil soup', or 'something sweet with berries'"
                      className="min-h-[120px] resize-none text-base p-3"
                      {...field}
                      aria-invalid={form.formState.errors.mainPrompt ? "true" : "false"}
                    />
                  </FormControl>
                  <FormDescription>Describe the main dish or ingredients you have in mind.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Accordion type="multiple" className="w-full space-y-4">
              <AccordionItem value="details" className="border rounded-lg shadow-sm overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30">
                  <div className="flex items-center gap-2"><Type className="text-accent h-5 w-5" /> Recipe Title & Servings</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-6 bg-background/50">
                  <FormField
                    control={form.control}
                    name="recipeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="recipeName" className="font-semibold">Suggest a Recipe Name (Optional)</FormLabel>
                        <FormControl>
                          <Input id="recipeName" placeholder="e.g., 'Grandma's Apple Pie'" {...field} className="text-base p-3" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="servings" className="font-semibold flex items-center gap-1"><Users className="h-4 w-4" /> Number of Servings</FormLabel>
                        <FormControl>
                          <Input id="servings" type="number" min="1" {...field} className="text-base p-3 w-24" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="dietary" className="border rounded-lg shadow-sm overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30">
                  <div className="flex items-center gap-2"><Salad className="text-accent h-5 w-5" /> Dietary Preferences</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-3 bg-background/50">
                  <FormField
                    control={form.control}
                    name="dietaryPreferences"
                    render={() => (
                      <FormItem>
                        {dietaryOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="dietaryPreferences"
                            render={({ field }) => {
                              return (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 p-2 hover:bg-muted/30 rounded-md">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">{item.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="cooktime" className="border rounded-lg shadow-sm overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30">
                   <div className="flex items-center gap-2"><Clock className="text-accent h-5 w-5" /> Preferred Cook Time</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-4 bg-background/50">
                  <FormField
                    control={form.control}
                    name="cookTimeOption"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                          >
                            {[
                              { value: "any", label: "Any" },
                              { value: "15min", label: "Approx. 15 min" },
                              { value: "30min", label: "Approx. 30 min" },
                              { value: "45min", label: "Approx. 45 min" },
                              { value: "1hour", label: "Approx. 1 hour" },
                              { value: "customTime", label: "Custom" },
                            ].map(opt => (
                              <FormItem key={opt.value} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/30 has-[:checked]:bg-accent/10 has-[:checked]:border-accent">
                                <FormControl>
                                  <RadioGroupItem value={opt.value} id={`cookTime-${opt.value}`} />
                                </FormControl>
                                <FormLabel htmlFor={`cookTime-${opt.value}`} className="font-normal cursor-pointer w-full">{opt.label}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchedCookTimeOption === "customTime" && (
                    <FormField
                      control={form.control}
                      name="customCookTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="customCookTime" className="font-semibold">Custom Cook Time (minutes)</FormLabel>
                          <FormControl>
                            <Input id="customCookTime" type="number" placeholder="e.g., 25" {...field} className="text-base p-3 w-32" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="health" className="border rounded-lg shadow-sm overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30">
                   <div className="flex items-center gap-2"><HeartPulse className="text-accent h-5 w-5" /> Health & Flavor Options</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-3 bg-background/50">
                   <FormField
                    control={form.control}
                    name="healthOptions"
                    render={() => (
                      <FormItem>
                        {healthSpecificOptions.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="healthOptions"
                            render={({ field }) => {
                              const Icon = item.id === "spicy" ? Flame : null;
                              return (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0 p-2 hover:bg-muted/30 rounded-md">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer flex items-center gap-1">
                                    {Icon && <Icon className="h-4 w-4 text-red-500" />}
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {error && <p className="text-sm font-medium text-destructive text-center py-2">{error}</p>}

            <Button type="submit" className="w-full text-xl py-8 bg-accent hover:bg-accent/90 font-bold tracking-wide" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Crafting Your Recipe...
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 h-6 w-6" />
                  Create My Recipe!
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
