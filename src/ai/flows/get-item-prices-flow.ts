
'use server';
/**
 * @fileOverview A Genkit flow to fetch simulated prices for shopping list items.
 *
 * - getItemPrices - A function that takes a list of shopping items and returns them with simulated prices and a total cost.
 * - GetItemPricesInput - The input type for the getItemPrices function.
 * - GetItemPricesOutput - The return type for the getItemPrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ShoppingListItem } from '@/lib/types';

// Define the schema for a single shopping list item, matching lib/types.ts
// We need to redefine or import if Zod schema is available there.
// For now, defining a simplified version for the flow.
const ShoppingListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
  checked: z.boolean(),
  recipeTitle: z.string().optional(),
  price: z.number().optional(),
});

const GetItemPricesInputSchema = z.object({
  items: z.array(ShoppingListItemSchema).describe("An array of shopping list items for which to fetch prices."),
});
export type GetItemPricesInput = z.infer<typeof GetItemPricesInputSchema>;

const GetItemPricesOutputSchema = z.object({
  pricedItems: z.array(ShoppingListItemSchema.extend({ price: z.number() })).describe("The array of shopping list items, now including their simulated prices."),
  totalCost: z.number().describe("The total simulated cost of all items."),
});
export type GetItemPricesOutput = z.infer<typeof GetItemPricesOutputSchema>;

// This tool simulates fetching a price for an item.
// In a real application, this could call an external API.
const fetchSimulatedPriceTool = ai.defineTool(
  {
    name: 'fetchSimulatedPriceTool',
    description: 'Simulates fetching the market price for a given shopping list item name.',
    inputSchema: z.object({
      itemName: z.string().describe('The name of the item to price.'),
    }),
    outputSchema: z.number().describe('The simulated price of the item.'),
  },
  async (input) => {
    // Simulate a price between $0.50 and $10.00 for demonstration
    // The price is for the quantity of the item as listed, not per standard unit (e.g. per kg)
    // For more realism, one might have a lookup table or more complex logic.
    const randomPrice = Math.random() * (10.00 - 0.50) + 0.50;
    return parseFloat(randomPrice.toFixed(2));
  }
);

const getItemPricesFlow = ai.defineFlow(
  {
    name: 'getItemPricesFlow',
    inputSchema: GetItemPricesInputSchema,
    outputSchema: GetItemPricesOutputSchema,
  },
  async (input) => {
    const pricedItems: ShoppingListItem[] = [];
    let totalCost = 0;

    for (const item of input.items) {
      // Even if an item already has a price (e.g. from a previous run),
      // we could re-fetch or use it. For simulation, let's always "fetch".
      const simulatedPrice = await fetchSimulatedPriceTool({ itemName: item.name });
      const pricedItem = { ...item, price: simulatedPrice };
      pricedItems.push(pricedItem);
      totalCost += simulatedPrice;
    }

    return {
      pricedItems,
      totalCost: parseFloat(totalCost.toFixed(2)),
    };
  }
);

export async function getItemPrices(input: GetItemPricesInput): Promise<GetItemPricesOutput> {
  return getItemPricesFlow(input);
}
