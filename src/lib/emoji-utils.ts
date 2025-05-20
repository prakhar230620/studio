
// src/lib/emoji-utils.ts

const ingredientEmojiMap: Record<string, string> = {
  // Fruits
  apple: '🍎', banana: '🍌', orange: '🍊', lemon: '🍋', lime: '🍋',
  grape: '🍇', strawberry: '🍓', blueberry: '🫐', raspberry: '🍓', 
  pineapple: '🍍', mango: '🥭', watermelon: '🍉', peach: '🍑', pear: '🍐',
  cherry: '🍒', plum: '🍑', kiwi: '🥝', coconut: '🥥',
  // Vegetables
  tomato: '🍅', potato: '🥔', onion: '🧅', garlic: '🧄', carrot: '🥕',
  broccoli: '🥦', spinach: '🥬', lettuce: '🥬', cucumber: '🥒',
  bellpepper: '🫑', pepper: '🌶️', chili: '🌶️', corn: '🌽', peas: '🫛',
  mushroom: '🍄', eggplant: '🍆', avocado: '🥑', cabbage: '🥬',
  pumpkin: '🎃', zucchini: '🥒', cauliflower: '🥦', // Using broccoli as proxy
  beetroot: '🍠', // Using sweet potato as proxy
  radish: '🥕', // Using carrot as proxy
  // Grains & Staples
  flour: '🌾', rice: '🍚', pasta: '🍝', bread: '🍞', noodle: '🍜',
  oat: '🥣', quinoa: '🍚', cornmeal: '🌽', semolina: '🌾',
  sugar: '🍬', salt: '🧂', oil: '🛢️', vinegar: '🍾',
  // Dairy & Alternatives
  milk: '🥛', cheese: '🧀', butter: '🧈', yogurt: '🍦', cream: '🍦',
  egg: '🥚', tofu: '⬜', paneer: '🧀', // Using cheese for paneer
  // Meats & Proteins
  chicken: '🐔', beef: '🥩', pork: '🥓', fish: '🐟', salmon: '🐟', tuna: '🐟',
  shrimp: '🦐', prawn: '🦐', lamb: '🐑', turkey: '🦃',
  // Spices & Herbs (generic for many, specific for some)
  parsley: '🌿', basil: '🌿', oregano: '🌿', cilantro: '🌿', coriander: '🌿',
  mint: '🌿', rosemary: '🌿', thyme: '🌿', dill: '🌿',
  cumin: '🌿', turmeric: '🟡', ginger: '🫚', cinnamon: '🌿', nutmeg: '🌰',
  clove: '🌿', cardamom: '🌿', saffron: '🌼', paprika: '🌶️',
  // Nuts & Seeds
  almond: '🌰', peanut: '🥜', walnut: '🌰', cashew: '🌰',
  pistachio: '🌰', hazelnut: '🌰', pecan: '🌰',
  sesameseed: '🌰', sunflowerseed: '🌻', chiaseed: '⚫', flaxseed: '🟤',
  poppyseed: '⚫',
  // Legumes
  lentil: '🫘', chickpea: '🫘', kidneybean: 'P', blackbean: '⚫',
  // Other
  water: '💧', chocolate: '🍫', coffee: '☕', tea: '🫖',
  honey: '🍯', syrup: '🍯', maplesyrup: '🍁',
  wine: '🍷', beer: '🍺', soyasauce: '🍾', mustard: '💛', ketchup: '🍅',
  mayonnaise: '🥚', jam: '🍓', jelly: '🍇',
  // Common recipe keywords that are not single ingredients
  curry: '🍛', soup: '🥣', salad: '🥗', sandwich: '🥪',
  pizza: '🍕', burger: '🍔', taco: '🌮', cake: '🍰', pie: '🥧',
  cookie: '🍪', icecream: '🍨', smoothie: '🥤', juice: '🧃',
  sauce: '🥫',
};

// Order of keywords matters if one is a substring of another.
// This array helps process longer keywords first.
const sortedEmojiKeywords = Object.keys(ingredientEmojiMap).sort((a, b) => b.length - a.length);

export function getEmojiForIngredient(ingredientName: string): string {
  const nameLower = ingredientName.toLowerCase();
  for (const keyword of sortedEmojiKeywords) {
    if (nameLower.includes(keyword)) {
      return ingredientEmojiMap[keyword];
    }
  }
  return ''; // No emoji if no match
}
