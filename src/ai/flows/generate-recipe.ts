
'use server';

/**
 * @fileOverview Generates a recipe based on a user-provided prompt, including an image and servings.
 *
 * - generateRecipe - A function that generates a recipe with an image and servings.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the desired recipe, potentially including servings, dietary needs, cook time, etc.'),
  baseServings: z.number().optional().describe('The user-requested number of servings, if provided.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const RecipeDetailsSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  ingredients: z.array(z.string()).describe('A list of ingredients for the recipe. Ensure quantities are appropriate for the specified number of servings.'),
  instructions: z.string().describe("The instructions for preparing the recipe. For each step, try to include an emoji that is highly relevant to the specific action being performed (e.g., 🔪 for chopping, 🔥 for heating/cooking, 🥣 for mixing, 💧 for adding water/liquids, 🍳 for frying) or the main ingredient being handled in that step (e.g., 🥔 for potatoes, 🧅 for onions). The goal is to make each step visually intuitive. Use a friendly and expressive tone. An occasional, contextually appropriate face emoji (like 😊 or 🤔) is acceptable if it fits very naturally and enhances readability, but prioritize action/ingredient emojis."),
  servings: z.number().describe('The number of servings this recipe is for. This should match the user-specified servings if provided in the prompt; otherwise, choose a reasonable default (e.g., 2-4).'),
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
  prompt: `You are an expert recipe generating AI. Generate a detailed recipe based on the following user preferences and prompt:\n\nUser Preferences & Prompt:\n{{{prompt}}}\n\nCrucially, if the prompt specifies a number of servings, ensure the generated recipe (ingredients and output 'servings' field) adheres to that number. If no servings are specified, default to a reasonable number (e.g., 2 or 4 servings) and reflect this in the 'servings' field of your output.
The ingredients list should be an array of strings, where each string describes one ingredient (e.g., "1 cup flour", "2 large eggs, beaten").
For the instructions, provide a clear, step-by-step guide. **For each step, try to include an emoji that is highly relevant to the specific action being performed (e.g., 🔪 for chopping, 🔥 for heating/cooking, 🥣 for mixing, 💧 for adding water/liquids, 🍳 for frying) or the main ingredient being handled in that step (e.g., 🥔 for potatoes, 🧅 for onions).** The goal is to make each step visually intuitive. Use a friendly and expressive tone. An occasional, contextually appropriate face emoji (like 😊 or 🤔) is acceptable if it fits very naturally and enhances readability, but prioritize action/ingredient emojis.
The title should be appealing and relevant to the recipe.

Format the output strictly as a JSON object with 'title' (string), 'ingredients' (array of strings), 'instructions' (string), and 'servings' (number) fields.
Example for servings: If the user asks for a recipe for 6 people, the 'servings' field in your JSON output must be 6, and the ingredient quantities should be scaled for 6 people.
`,
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
      const imagePrompt = `Generate a photorealistic, appetizing image of a dish titled: "${recipeDetails.title}". Ensure it looks delicious and well-presented.`;
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

