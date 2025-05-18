// src/ai/flows/improve-recipe-recommendation.ts
'use server';
/**
 * @fileOverview An AI agent for generating recipes that asks follow-up questions.
 *
 * - improveRecipeRecommendation - A function that generates recipe recommendations based on user preferences, asking follow-up questions for refinement.
 * - ImproveRecipeRecommendationInput - The input type for the improveRecipeRecommendation function.
 * - ImproveRecipeRecommendationOutput - The return type for the improveRecipeRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveRecipeRecommendationInputSchema = z.object({
  initialRequest: z.string().describe('The initial request for a recipe.'),
});
export type ImproveRecipeRecommendationInput = z.infer<typeof ImproveRecipeRecommendationInputSchema>;

const ImproveRecipeRecommendationOutputSchema = z.object({
  recipe: z.string().describe('The generated recipe based on user input and follow-up questions.'),
});
export type ImproveRecipeRecommendationOutput = z.infer<typeof ImproveRecipeRecommendationOutputSchema>;

const followUpQuestionTool = ai.defineTool({
  name: 'askFollowUpQuestion',
  description: 'Ask a follow-up question to refine the recipe recommendation.',
  inputSchema: z.object({
    question: z.string().describe('The follow-up question to ask the user.'),
  }),
  outputSchema: z.string().describe('The user response to the follow-up question.'),
}, async (input) => {
  // This tool's implementation is a placeholder.
  // In a real application, this would involve sending the question to the user
  // and waiting for their response.
  console.log(`Asking follow-up question: ${input.question}`);
  return 'Response to follow-up question.';
});

const generateRecipePrompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: ImproveRecipeRecommendationInputSchema},
  output: {schema: ImproveRecipeRecommendationOutputSchema},
  tools: [followUpQuestionTool],
  prompt: `You are a recipe recommendation AI. Based on the initial request: {{{initialRequest}}}, generate a recipe. 

If you need more information to provide a better recipe, use the askFollowUpQuestion tool to ask the user for more details. 

Once you have enough information, generate the recipe.

Ensure the final output is a complete recipe, including ingredients and instructions.
`,
});

const improveRecipeRecommendationFlow = ai.defineFlow(
  {
    name: 'improveRecipeRecommendationFlow',
    inputSchema: ImproveRecipeRecommendationInputSchema,
    outputSchema: ImproveRecipeRecommendationOutputSchema,
  },
  async input => {
    const {output} = await generateRecipePrompt(input);
    return output!;
  }
);

export async function improveRecipeRecommendation(input: ImproveRecipeRecommendationInput): Promise<ImproveRecipeRecommendationOutput> {
  return improveRecipeRecommendationFlow(input);
}
