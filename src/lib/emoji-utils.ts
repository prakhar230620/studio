
// src/lib/emoji-utils.ts

const ingredientEmojiMap: Record<string, string> = {
  // Fruits
  apple: '🍎', banana: '🍌', orange: '🍊', lemon: '🍋', lime: '🍋', // Using same for lime
  grape: '🍇', strawberry: '🍓', blueberry: '🫐', raspberry: '🍓', // Using same for raspberry
  pineapple: '🍍', mango: '🥭', watermelon: '🍉', peach: '🍑', pear: '🍐',
  cherry: '🍒', plum: '🍑', // Using peach for plum
  kiwi: '🥝', coconut: '🥥', fig: '🍑', // Using peach for fig as placeholder
  pomegranate: '🍓', // Using strawberry as placeholder
  // Vegetables
  tomato: '🍅', potato: '🥔', onion: '🧅', garlic: '🧄', carrot: '🥕',
  broccoli: '🥦', spinach: '🥬', lettuce: '🥬', cucumber: '🥒',
  bellpepper: '🫑', 'bell pepper': '🫑', pepper: '🌶️', chili: '🌶️', corn: '🌽', peas: '🫛',
  mushroom: '🍄', eggplant: '🍆', aubergine: '🍆', avocado: '🥑', cabbage: '🥬',
  pumpkin: '🎃', zucchini: '🥒', cauliflower: '🥦', // Using broccoli as proxy
  sweetpotato: '🍠', 'sweet potato': '🍠',
  beetroot: '🍠', // Using sweet potato as proxy
  radish: '🥕', // Using carrot as proxy
  celery: '🥬', // Using lettuce/cabbage as proxy
  asparagus: ' asparagus ', // Placeholder text to avoid conflict, actual emoji might be 🌿 or similar
  kale: '🥬',
  leek: '🥬',
  artichoke: ' artichoke ', // Placeholder
  // Grains & Staples
  flour: '🌾', rice: '🍚', pasta: '🍝', bread: '🍞', noodle: '🍜',
  oat: '🥣', oatmeal: '🥣', quinoa: '🍚', couscous: '🍚',
  cornmeal: '🌽', semolina: '🌾', barley: '🌾',
  sugar: '🍬', salt: '🧂', 
  'olive oil': '🫒', 'vegetable oil': '🛢️', 'coconut oil': '🥥', oil: '🛢️', 
  vinegar: '🍾',
  // Dairy & Alternatives
  milk: '🥛', cheese: '🧀', butter: '🧈', yogurt: '🥣', cream: '🥛',
  egg: '🥚', tofu: '⬜', paneer: '🧀', // Using cheese for paneer
  'almond milk': '🥛', 'soy milk': '🥛', 'oat milk': '🥛',
  // Meats & Proteins
  chicken: '🐔', beef: '🥩', 'ground beef': '🥩', pork: '🥓', bacon: '🥓',
  fish: '🐟', salmon: '🐟', tuna: '🐟', cod: '🐟', shrimp: '🦐', prawn: '🦐',
  lamb: '🐑', turkey: '🦃', sausage: '🌭',
  // Spices & Herbs (generic for many, specific for some)
  parsley: '🌿', basil: '🌿', oregano: '🌿', cilantro: '🌿', coriander: '🌿',
  mint: '🌿', rosemary: '🌿', thyme: '🌿', dill: '🌿', sage: '🌿',
  cumin: '🌿', turmeric: '🟡', ginger: '🫚', cinnamon: '🌿', nutmeg: '🌰',
  clove: '🌿', cardamom: '🌿', saffron: '🌼', paprika: '🌶️',
  'black pepper': '⚫', // Generic black circle for black pepper
  bayleaf: '🌿', 'bay leaf': '🌿',
  // Nuts & Seeds
  almond: '🌰', peanut: '🥜', walnut: '🌰', cashew: '🌰',
  pistachio: '🌰', hazelnut: '🌰', pecan: '🌰',
  sesameseed: '🌰', 'sesame seed': '🌰',
  sunflowerseed: '🌻', 'sunflower seed': '🌻',
  chiaseed: '🫘', 'chia seed': '🫘', // Using bean for seeds
  flaxseed: '🫘', 'flax seed': '🫘',
  poppyseed: '🫘', 'poppy seed': '🫘',
  pumpkinseed: '🎃', 'pumpkin seed': '🎃',
  // Legumes
  lentil: '🫘', chickpea: '🫘', 'kidney bean': '🫘', kidneybean: '🫘',
  'black bean': '🫘', blackbean: '🫘', 'soy bean': '🫘', edamame: '🫛',
  // Other
  water: '💧', chocolate: '🍫', 'cocoa powder': '🍫', coffee: '☕', tea: '🫖',
  honey: '🍯', 'maple syrup': '🍁', syrup: '🍯',
  wine: '🍷', beer: '🍺', 'soy sauce': '🍾', mustard: '💛', ketchup: '🍅',
  mayonnaise: '🥚', jam: '🍓', jelly: '🍇', broth: '🥣', stock: '🥣',
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
    // Use word boundaries for more precise matching if the keyword is a common short word
    // For example, to distinguish "oil" from "boil"
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(nameLower)) {
      return ingredientEmojiMap[keyword];
    }
    // Fallback to includes for multi-word keywords or less common words
    if (keyword.includes(' ') && nameLower.includes(keyword)) {
        return ingredientEmojiMap[keyword];
    }
  }
  // If no specific match with word boundaries, try a general includes for broader matching
  // This is a secondary check, as the primary check (with word boundaries) is more precise.
  for (const keyword of sortedEmojiKeywords) {
      if(nameLower.includes(keyword)) {
          return ingredientEmojiMap[keyword];
      }
  }
  return ''; // No emoji if no match
}
