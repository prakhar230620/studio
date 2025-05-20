
// src/components/RecipeForm.tsx
"use client";

import type React from 'react';
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
import { Loader2, Users, Sparkles, Clock, Salad, Utensils, HeartPulse, Flame, Minus, Plus, Globe2, CookingPot, Sandwich, Leaf, Fish, Wheat, Bone, Drumstick } from "lucide-react"; // Added new icons

const recipeFormSchema = z.object({
  mainPrompt: z.string().min(1, "Please describe your recipe idea."),
  servings: z.coerce.number().min(1, "Servings must be at least 1.").default(2),
  dietaryPreferences: z.array(z.string()).optional(),
  cuisineType: z.array(z.string()).optional(),
  spiceLevel: z.enum(["mild", "medium", "spicy", "very_spicy", "any"]).default("any"),
  cookingMethod: z.array(z.string()).optional(),
  mealType: z.array(z.string()).optional(),
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
  path: ["customCookTime"],
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  isLoading: boolean;
  onSubmitPrompt: (data: RecipeFormValues) => Promise<void>;
  error: string | null;
}

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian", icon: Leaf },
  { id: "vegan", label: "Vegan", icon: Leaf },
  { id: "gluten-free", label: "Gluten-Free", icon: Wheat },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "fat-free", label: "Fat-Free" },
  { id: "pescatarian", label: "Pescatarian", icon: Fish },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo", icon: Bone },
  { id: "low-carb", label: "Low-Carb" },
  { id: "nut-free", label: "Nut-Free" },
  { id: "soy-free", label: "Soy-Free" },
  { id: "non-vegetarian", label: "Non-Vegetarian", icon: Drumstick },
];

const healthSpecificOptions = [
  { id: "low-sugar", label: "Low Sugar" },
  { id: "low-sodium", label: "Low Sodium" },
  { id: "high-protein", label: "High Protein" },
  { id: "low-calorie", label: "Low Calorie" },
];

const cuisineOptions = [
  { id: "indian", label: "Indian" },
  { id: "italian", label: "Italian" },
  { id: "mexican", label: "Mexican" },
  { id: "chinese", label: "Chinese" },
  { id: "thai", label: "Thai" },
  { id: "japanese", label: "Japanese" },
  { id: "mediterranean", label: "Mediterranean" },
  { id: "french", label: "French" },
  { id: "american", label: "American" },
  { id: "middle-eastern", label: "Middle Eastern" },
  { id: "african", label: "African" },
  { id: "caribbean", label: "Caribbean" },
  { id: "other", label: "Other / Fusion" },
];

const cookingMethodOptions = [
  { id: "baking", label: "Baking" },
  { id: "frying", label: "Frying" },
  { id: "grilling", label: "Grilling" },
  { id: "steaming", label: "Steaming" },
  { id: "roasting", label: "Roasting" },
  { id: "slow-cooking", label: "Slow Cooking" },
  { id: "stir-frying", label: "Stir-Frying" },
  { id: "boiling", label: "Boiling" },
  { id: "no-cook", label: "No-Cook / Raw" },
];

const mealTypeOptions = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
  { id: "dessert", label: "Dessert" },
  { id: "appetizer", label: "Appetizer" },
  { id: "brunch", label: "Brunch" },
  { id: "side-dish", label: "Side Dish" },
];


export function RecipeForm({ isLoading, onSubmitPrompt, error }: RecipeFormProps) {
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      mainPrompt: "",
      servings: 2,
      dietaryPreferences: [],
      cuisineType: [],
      spiceLevel: "any",
      cookingMethod: [],
      mealType: [],
      cookTimeOption: "any",
      healthOptions: [],
    },
  });

  const watchedCookTimeOption = form.watch("cookTimeOption");
  const watchedServings = form.watch("servings");

  const handleSubmit: SubmitHandler<RecipeFormValues> = async (data) => {
    if (data.cookTimeOption !== "customTime") {
      data.customCookTime = undefined;
    }
    await onSubmitPrompt(data);
  };

  const renderCheckboxGroup = (fieldName: keyof RecipeFormValues, options: Array<{id: string, label: string, icon?: React.ElementType}>) => (
     <FormField
      control={form.control}
      name={fieldName as any} // Added 'as any' to bypass strict type checking for dynamic field name
      render={() => (
        <FormItem>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
            {options.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name={fieldName as any} // Added 'as any'
                render={({ field }) => {
                  const Icon = item.icon;
                  return (
                    <FormItem key={item.id} className="flex flex-row items-center space-x-2 space-y-0 p-2 hover:bg-muted/30 rounded-md transition-colors has-[:checked]:bg-primary/10 has-[:checked]:border-primary border border-transparent">
                      <FormControl>
                        <Checkbox
                          checked={Array.isArray(field.value) && field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = Array.isArray(field.value) ? field.value : [];
                            return checked
                              ? field.onChange([...currentValue, item.id])
                              : field.onChange(
                                  currentValue?.filter(
                                    (value) => value !== item.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex items-center gap-1.5 text-sm">
                        {Icon && <Icon className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />}
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );

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
              <AccordionItem value="servings" className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2"><Users className="text-accent h-5 w-5" /> Number of Servings</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-6 bg-background/50">
                  <FormField
                    control={form.control}
                    name="servings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="servings-input" className="font-semibold flex items-center gap-1 sr-only">Number of Servings</FormLabel>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const currentValue = typeof field.value === 'number' ? field.value : parseInt(String(field.value), 10) || 2;
                              if (currentValue > 1) {
                                form.setValue("servings", currentValue - 1, { shouldValidate: true });
                              }
                            }}
                            disabled={watchedServings <= 1}
                            aria-label="Decrease servings"
                            className="hover:bg-accent/10 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <FormControl>
                            <Input
                              id="servings-input"
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    field.onChange(""); 
                                  } else {
                                    const numValue = parseInt(value, 10);
                                    if (!isNaN(numValue) && numValue >=1) {
                                        field.onChange(numValue);
                                    }
                                  }
                              }}
                              onBlur={(e) => { 
                                const value = parseInt(String(field.value),10);
                                if (isNaN(value) || value < 1) {
                                    form.setValue("servings", 1, { shouldValidate: true });
                                }
                              }}
                              className="text-base p-3 w-20 text-center"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const currentValue = typeof field.value === 'number' ? field.value : parseInt(String(field.value), 10) || 1;
                              form.setValue("servings", currentValue + 1, { shouldValidate: true });
                            }}
                            aria-label="Increase servings"
                            className="hover:bg-accent/10 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="dietary" className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2"><Salad className="text-accent h-5 w-5" /> Dietary Preferences</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-3 bg-background/50">
                  {renderCheckboxGroup("dietaryPreferences" as any, dietaryOptions)}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cuisine" className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2"><Globe2 className="text-accent h-5 w-5" /> Cuisine Type</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-3 bg-background/50">
                  {renderCheckboxGroup("cuisineType" as any, cuisineOptions)}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="spice" className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2"><Flame className="text-accent h-5 w-5" /> Spice Level</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-3 bg-background/50">
                  <FormField
                    control={form.control}
                    name="spiceLevel"
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
                              { value: "mild", label: "Mild" },
                              { value: "medium", label: "Medium" },
                              { value: "spicy", label: "Spicy" },
                              { value: "very_spicy", label: "Very Spicy" },
                            ].map(opt => (
                              <FormItem key={opt.value} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/30 has-[:checked]:bg-accent/10 has-[:checked]:border-accent transition-colors">
                                <FormControl>
                                  <RadioGroupItem value={opt.value} id={`spice-${opt.value}`} />
                                </FormControl>
                                <FormLabel htmlFor={`spice-${opt.value}`} className="font-normal cursor-pointer w-full text-sm">{opt.label}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cookMethod" className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2"><CookingPot className="text-accent h-5 w-5" /> Cooking Method</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-3 bg-background/50">
                  {renderCheckboxGroup("cookingMethod" as any, cookingMethodOptions)}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="mealType" className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2"><Sandwich className="text-accent h-5 w-5" /> Meal Type</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-3 bg-background/50">
                  {renderCheckboxGroup("mealType" as any, mealTypeOptions)}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cooktime" className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30 transition-colors">
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
                              <FormItem key={opt.value} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/30 has-[:checked]:bg-accent/10 has-[:checked]:border-accent transition-colors">
                                <FormControl>
                                  <RadioGroupItem value={opt.value} id={`cookTime-${opt.value}`} />
                                </FormControl>
                                <FormLabel htmlFor={`cookTime-${opt.value}`} className="font-normal cursor-pointer w-full text-sm">{opt.label}</FormLabel>
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
                          <FormLabel htmlFor="customCookTime" className="font-semibold text-sm">Custom Cook Time (minutes)</FormLabel>
                          <FormControl>
                            <Input id="customCookTime" type="number" placeholder="e.g., 25" {...field} className="text-sm p-3 w-32" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="health" className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30 transition-colors">
                   <div className="flex items-center gap-2"><HeartPulse className="text-accent h-5 w-5" /> Health & Flavor Options</div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-3 bg-background/50">
                   {renderCheckboxGroup("healthOptions" as any, healthSpecificOptions)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {error && <p className="text-sm font-medium text-destructive text-center py-2">{error}</p>}

            <Button type="submit" className="w-full text-xl py-8 bg-accent hover:bg-accent/90 font-bold tracking-wide transition-colors" disabled={isLoading}>
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

