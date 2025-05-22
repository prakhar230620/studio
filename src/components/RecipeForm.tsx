
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
import { 
  Loader2, Users, Sparkles, Clock, Salad, Utensils, HeartPulse, Flame, Minus, Plus, Globe2, CookingPot, Sandwich, 
  Leaf, Fish, Wheat, Bone, Drumstick, Wind, Gauge, Coffee, Soup, Cookie, CakeSlice, Grape, Croissant, Shrub, Vegan, Ban, Percent, Thermometer, Sparkle, Shell, Feather, Beef, Apple, Pizza, IceCream, Sprout
} from "lucide-react";

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
  { id: "vegan", label: "Vegan", icon: Vegan },
  { id: "gluten-free", label: "Gluten-Free", icon: Wheat },
  { id: "dairy-free", label: "Dairy-Free", icon: Ban }, 
  { id: "fat-free", label: "Fat-Free", icon: Percent }, 
  { id: "pescatarian", label: "Pescatarian", icon: Fish },
  { id: "keto", label: "Keto", icon: Beef }, 
  { id: "paleo", label: "Paleo", icon: Bone },
  { id: "low-carb", label: "Low-Carb", icon: Sprout }, 
  { id: "nut-free", label: "Nut-Free", icon: Shrub }, 
  { id: "soy-free", label: "Soy-Free", icon: Sprout },
  { id: "non-vegetarian", label: "Non-Vegetarian", icon: Drumstick },
  { id: "egg-free", label: "Egg-Free", icon: Feather }, 
  { id: "shellfish-free", label: "Shellfish-Free", icon: Shell },
];

const healthSpecificOptions = [
  { id: "low-sugar", label: "Low Sugar", icon: Apple }, 
  { id: "low-sodium", label: "Low Sodium", icon: Thermometer }, 
  { id: "high-protein", label: "High Protein", icon: Beef }, 
  { id: "low-calorie", label: "Low Calorie", icon: Feather }, 
  { id: "high-fiber", label: "High Fiber", icon: Wheat },
];

const cuisineOptions: Array<{ id: string; label: string; icon?: React.ElementType; flagEmoji?: string }> = [
  { id: "indian", label: "Indian", flagEmoji: "🇮🇳", icon: Sprout },
  { id: "italian", label: "Italian", flagEmoji: "🇮🇹", icon: Pizza },
  { id: "mexican", label: "Mexican", flagEmoji: "🇲🇽", icon: Flame },
  { id: "chinese", label: "Chinese", flagEmoji: "🇨🇳", icon: Sprout },
  { id: "thai", label: "Thai", flagEmoji: "🇹🇭", icon: Sprout },
  { id: "japanese", label: "Japanese", flagEmoji: "🇯🇵", icon: Fish },
  { id: "mediterranean", label: "Mediterranean", icon: Leaf, flagEmoji: "🇬🇷" },
  { id: "french", label: "French", flagEmoji: "🇫🇷", icon: Croissant },
  { id: "american", label: "American", flagEmoji: "🇺🇸", icon: Beef },
  { id: "middle-eastern", label: "Middle Eastern", icon: Sprout, flagEmoji: "🇸🇦" },
  { id: "african", label: "African", icon: Sprout, flagEmoji: "🌍" }, 
  { id: "caribbean", label: "Caribbean", icon: Fish, flagEmoji: "🇯🇲" },
  { id: "greek", label: "Greek", flagEmoji: "🇬🇷", icon: Leaf },
  { id: "spanish", label: "Spanish", flagEmoji: "🇪🇸", icon: Fish },
  { id: "vietnamese", label: "Vietnamese", flagEmoji: "🇻🇳", icon: Sprout },
  { id: "korean", label: "Korean", flagEmoji: "🇰🇷", icon: Sprout },
  { id: "german", label: "German", flagEmoji: "🇩🇪", icon: Drumstick },
  { id: "other", label: "Other / Fusion", icon: Sparkle },
];

const cookingMethodOptions = [
  { id: "baking", label: "Baking", icon: CakeSlice },
  { id: "frying", label: "Frying", icon: Utensils }, 
  { id: "grilling", label: "Grilling", icon: Flame },
  { id: "steaming", label: "Steaming", icon: Soup }, 
  { id: "roasting", label: "Roasting", icon: Drumstick }, 
  { id: "slow-cooking", label: "Slow Cooking", icon: Clock },
  { id: "stir-frying", label: "Stir-Frying", icon: Utensils },
  { id: "boiling", label: "Boiling", icon: Soup },
  { id: "no-cook", label: "No-Cook / Raw", icon: Salad },
  { id: "pressure-cooking", label: "Pressure Cooking", icon: Gauge },
  { id: "air-frying", label: "Air Frying", icon: Wind },
  { id: "microwaving", label: "Microwaving", icon: Sparkles }, 
];

const mealTypeOptions = [
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "lunch", label: "Lunch", icon: Sandwich },
  { id: "dinner", label: "Dinner", icon: Soup },
  { id: "snack", label: "Snack", icon: Cookie },
  { id: "dessert", label: "Dessert", icon: IceCream },
  { id: "appetizer", label: "Appetizer", icon: Grape },
  { id: "brunch", label: "Brunch", icon: Croissant },
  { id: "side-dish", label: "Side Dish", icon: Salad },
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

  const renderCheckboxGroup = (
    fieldName: keyof RecipeFormValues, 
    options: Array<{id: string, label: string, icon?: React.ElementType, flagEmoji?: string}>
  ) => (
     <FormField
      control={form.control}
      name={fieldName as any} 
      render={() => (
        <FormItem>
          <div className="flex flex-wrap gap-2 py-2">
            {options.map((item) => {
              const IconComponent = item.icon;
              return (
              <FormField
                key={item.id}
                control={form.control}
                name={fieldName as any} 
                render={({ field }) => {
                  return (
                    <FormItem 
                      key={item.id} 
                      className="flex flex-row items-center space-x-2 p-2 border rounded-md hover:bg-muted/50 has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors duration-200 ease-in-out cursor-pointer"
                    >
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
                      <FormLabel className="font-normal cursor-pointer flex items-center gap-2 text-sm flex-1 whitespace-nowrap">
                        {item.flagEmoji ? (
                          <span className="text-lg mr-1">{item.flagEmoji}</span>
                        ) : (
                          IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                        )}
                        <span>{item.label}</span>
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            )})}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const preferenceCategories = [
    { id: "servings", label: "Servings", icon: Users, content: (
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
    )},
    { id: "dietary", label: "Dietary", icon: Salad, content: renderCheckboxGroup("dietaryPreferences" as any, dietaryOptions) },
    { id: "cuisine", label: "Cuisine", icon: Globe2, content: renderCheckboxGroup("cuisineType" as any, cuisineOptions) },
    { id: "spice", label: "Spice Level", icon: Flame, content: (
      <FormField
        control={form.control}
        name="spiceLevel"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-wrap gap-2 py-2"
              >
                {[
                  { value: "any", label: "Any" }, { value: "mild", label: "Mild" },
                  { value: "medium", label: "Medium" }, { value: "spicy", label: "Spicy" },
                  { value: "very_spicy", label: "Very Spicy" },
                ].map(opt => (
                  <FormItem 
                    key={opt.value} 
                    className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/50 has-[:checked]:bg-accent/10 has-[:checked]:border-accent transition-colors duration-200 ease-in-out cursor-pointer"
                  >
                    <FormControl>
                      <RadioGroupItem value={opt.value} id={`spice-${opt.value}`} />
                    </FormControl>
                    <FormLabel htmlFor={`spice-${opt.value}`} className="font-normal cursor-pointer w-full text-sm whitespace-nowrap">{opt.label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )},
    { id: "cookMethod", label: "Cooking Method", icon: CookingPot, content: renderCheckboxGroup("cookingMethod" as any, cookingMethodOptions) },
    { id: "mealType", label: "Meal Type", icon: Sandwich, content: renderCheckboxGroup("mealType" as any, mealTypeOptions) },
    { id: "cookTime", label: "Cook Time", icon: Clock, content: (
      <>
        <FormField
          control={form.control}
          name="cookTimeOption"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-2 py-2"
                >
                  {[
                    { value: "any", label: "Any" }, { value: "15min", label: "Approx. 15 min" },
                    { value: "30min", label: "Approx. 30 min" }, { value: "45min", label: "Approx. 45 min" },
                    { value: "1hour", label: "Approx. 1 hour" }, { value: "customTime", label: "Custom" },
                  ].map(opt => (
                    <FormItem 
                      key={opt.value} 
                      className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted/50 has-[:checked]:bg-accent/10 has-[:checked]:border-accent transition-colors duration-200 ease-in-out cursor-pointer"
                    >
                      <FormControl>
                        <RadioGroupItem value={opt.value} id={`cookTime-${opt.value}`} />
                      </FormControl>
                      <FormLabel htmlFor={`cookTime-${opt.value}`} className="font-normal cursor-pointer w-full text-sm whitespace-nowrap">{opt.label}</FormLabel>
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
      </>
    )},
    { id: "health", label: "Health/Flavor", icon: HeartPulse, content: renderCheckboxGroup("healthOptions" as any, healthSpecificOptions) },
  ];

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

            <div className="text-center my-1">
              <p className="text-md font-medium text-foreground/70">Optionally, refine with details below:</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {preferenceCategories.map(category => {
                const IconComponent = category.icon;
                return (
                  <Accordion 
                    key={category.id} 
                    type="single" 
                    collapsible 
                    className="min-w-36 w-36 sm:w-40 md:w-44 border rounded-lg shadow-sm data-[state=open]:ring-1 data-[state=open]:ring-primary hover:shadow-md transition-shadow bg-card"
                  >
                    <AccordionItem value={category.id} className="border-0">
                      <AccordionTrigger className="p-3 text-sm font-medium hover:bg-muted/50 [&[data-state=open]]:bg-muted/30 w-full data-[state=open]:border-b">
                        <div className="flex flex-col items-center gap-1 w-full">
                          <IconComponent className="text-accent h-7 w-7" />
                          <span>{category.label}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-3 bg-background/50 max-h-60 overflow-y-auto">
                        {category.content}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
            
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


    