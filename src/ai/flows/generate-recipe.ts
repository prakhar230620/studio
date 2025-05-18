
'use server';

/**
 * @fileOverview Generates a recipe based on a user-provided prompt, including an image.
 *
 * - generateRecipe - A function that generates a recipe with an image.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the desired recipe.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const RecipeDetailsSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  ingredients: z.array(z.string()).describe('A list of ingredients for the recipe.'),
  instructions: z.string().describe('The instructions for preparing the recipe.'),
});

const GenerateRecipeOutputSchema = RecipeDetailsSchema.extend({
  imageUrl: z.string().url().describe('A data URI of an image representing the recipe. Expected format: "data:image/png;base64,..."'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const generateRecipeDetailsPrompt = ai.definePrompt({
  name: 'generateRecipeDetailsPrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: RecipeDetailsSchema},
  prompt: `You are a recipe generating expert. Generate a recipe based on the following prompt:\n\nPrompt: {{{prompt}}}\n\nFormat the output as a JSON object with 'title', 'ingredients' (as a list of strings), and 'instructions' fields.\n`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    // 1. Generate recipe details (text)
    const {output: recipeDetails} = await generateRecipeDetailsPrompt(input);
    if (!recipeDetails) {
      throw new Error('Failed to generate recipe details.');
    }

    // 2. Generate an image for the recipe
    let imageUrl = `https://placehold.co/600x400.png`; // Default placeholder
    try {
      const imagePrompt = `Generate a photorealistic image of a dish titled: "${recipeDetails.title}". Focus on making it look appetizing.`;
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: imagePrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      if (media && media.url) {
        imageUrl = media.url;
      } else {
        console.warn("Image generation did not return a valid media URL, using placeholder.");
      }
    } catch (err) {
        console.error("Error generating image for recipe:", err);
        // Use placeholder if image generation fails
    }
    
    return {
      ...recipeDetails,
      imageUrl,
    };
  }
);
