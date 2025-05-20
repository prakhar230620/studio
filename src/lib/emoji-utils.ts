
// src/lib/emoji-utils.ts

const ingredientEmojiMap: Record<string, string> = {
  // Fruits
  apple: '🍎', apples: '🍎',
  banana: '🍌', bananas: '🍌',
  orange: '🍊', oranges: '🍊',
  lemon: '🍋', lemons: '🍋',
  lime: '🍋', limes: '🍋', // Using same for lime
  grape: '🍇', grapes: '🍇',
  strawberry: '🍓', strawberries: '🍓',
  blueberry: '🫐', blueberries: '🫐',
  raspberry: '🍓', raspberries: '🍓', // Using strawberry as proxy
  blackberry: '🫐', blackberries: '🫐', // Using blueberry as proxy
  pineapple: '🍍', pineapples: '🍍',
  mango: '🥭', mangoes: '🥭',
  watermelon: '🍉', watermelons: '🍉',
  peach: '🍑', peaches: '🍑',
  pear: '🍐', pears: '🍐',
  cherry: '🍒', cherries: '🍒',
  plum: '🍑', plums: '🍑', // Using peach for plum
  kiwi: '🥝', kiwis: '🥝',
  coconut: '🥥', coconuts: '🥥',
  fig: '🍑', figs: '🍑', // Using peach for fig as placeholder
  pomegranate: '🍓', pomegranates: '🍓', // Using strawberry as placeholder
  avocado: '🥑', avocados: '🥑',
  papaya: '🥭', // Using mango as proxy
  guava: '🍈', // Using melon as proxy
  melon: '🍈',
  cantaloupe: '🍈',
  honeydew: '🍈',
  apricot: '🍑',
  nectarine: '🍑',
  passionfruit: '🍓', // Placeholder
  dragonfruit: '🐉', // Placeholder text, actual emoji might be different

  // Vegetables
  tomato: '🍅', tomatoes: '🍅',
  potato: '🥔', potatoes: '🥔',
  onion: '🧅', onions: '🧅',
  garlic: '🧄',
  carrot: '🥕', carrots: '🥕',
  broccoli: '🥦',
  spinach: '🥬',
  lettuce: '🥬',
  cucumber: '🥒', cucumbers: '🥒',
  bellpepper: '🫑', 'bell pepper': '🫑', 'capsicum': '🫑',
  pepper: '🌶️', // General pepper
  chili: '🌶️', 'chilli': '🌶️', 'green chili': '🌶️', 'red chili': '🌶️', 'jalapeno': '🌶️',
  corn: '🌽',
  pea: '🫛', peas: '🫛', 'green peas': '🫛',
  mushroom: '🍄', mushrooms: '🍄',
  eggplant: '🍆', 'aubergine': '🍆',
  cabbage: '🥬',
  pumpkin: '🎃',
  zucchini: '🥒',
  cauliflower: '🥦', // Using broccoli as proxy
  sweetpotato: '🍠', 'sweet potato': '🍠',
  beetroot: '🍠', // Using sweet potato as proxy
  radish: '🥕', // Using carrot as proxy
  celery: '🥬', // Using lettuce/cabbage as proxy
  asparagus: '🌿', // Generic herb/plant for asparagus
  kale: '🥬',
  leek: '🥬',
  artichoke: ' artichoke ', // Placeholder
  brusselsprout: '🥬', 'brussels sprout': '🥬',
  okra: '🟢', // Green circle
  turnip: ' turnips ', // Placeholder
  parsnip: '🥕', // Using carrot
  yam: '🍠',
  squash: '🎃', // Using pumpkin for general squash

  // Grains, Pasta, Bread & Staples
  flour: '🌾', 'all-purpose flour': '🌾', 'wheat flour': '🌾', 'maida': '🌾',
  rice: '🍚', 'basmati rice': '🍚', 'jasmine rice': '🍚', 'brown rice': '🍚',
  pasta: '🍝', 'spaghetti': '🍝', 'penne': '🍝', 'macaroni': '🍝', 'fettuccine': '🍝',
  bread: '🍞', 'white bread': '🍞', 'brown bread': '🍞', 'baguette': '🥖', 'bun': '🍔',
  noodle: '🍜', noodles: '🍜', 'ramen noodles': '🍜', 'egg noodles': '🍜',
  oat: '🥣', oats: '🥣', oatmeal: '🥣',
  quinoa: '🍚', // Using rice as proxy
  couscous: '🍚', // Using rice as proxy
  cornmeal: '🌽',
  semolina: '🌾', 'sooji': '🌾', 'suji': '🌾',
  barley: '🌾',
  sugar: '🍬', 'white sugar': '🍬', 'brown sugar': '🟤', 'caster sugar': '🍬', 'icing sugar': '🍬', 'powdered sugar': '🍬',
  salt: '🧂', 'black salt': '🧂',
  'olive oil': '🫒', 'extra virgin olive oil': '🫒',
  'vegetable oil': '🛢️', 'sunflower oil': '🌻', 'canola oil': '🛢️', 'corn oil': '🌽', 'sesame oil': '🌰',
  'coconut oil': '🥥',
  oil: '🛢️', // Generic oil
  vinegar: '🍾', 'apple cider vinegar': '🍎', 'white vinegar': '🍾', 'balsamic vinegar': '🍾',
  yeast: '🧱', // Brown square as placeholder

  // Dairy & Alternatives
  milk: '🥛', 'cow milk': '🥛',
  cheese: '🧀', 'cheddar cheese': '🧀', 'mozzarella cheese': '🧀', 'parmesan cheese': '🧀', 'feta cheese': '🧀', 'cottage cheese': '🧀', 'cream cheese': '🧀',
  butter: '🧈',
  yogurt: '🥣', 'yoghurt': '🥣', 'greek yogurt': '🥣',
  cream: '🥛', 'heavy cream': '🥛', 'sour cream': '🥣', 'whipping cream': '🥛',
  egg: '🥚', eggs: '🥚',
  tofu: '⬜', // White square
  paneer: '🧀', // Using cheese for paneer
  'almond milk': '🥛', 'soy milk': '🥛', 'oat milk': '🥛', 'coconut milk': '🥥',
  ghee: '🧈', // Using butter

  // Meats, Poultry & Proteins
  chicken: '🐔', 'chicken breast': '🐔', 'chicken thigh': '🐔', 'ground chicken': '🐔',
  beef: '🥩', 'ground beef': '🥩', 'steak': '🥩',
  pork: '🥓', 'pork chop': '🥩', 'ground pork': '🥓',
  bacon: '🥓',
  fish: '🐟', 'salmon': '🐟', 'tuna': '🐟', 'cod': '🐟', 'tilapia': '🐟',
  shrimp: '🦐', prawn: '🦐',
  lamb: '🐑', 'ground lamb': '🐑',
  turkey: '🦃', 'ground turkey': '🦃',
  sausage: '🌭',
  ham: '🍖',
  crab: '🦀',
  lobster: '🦞',
  duck: '🦆',

  // Spices & Herbs (generic for many, specific for some)
  parsley: '🌿',
  basil: '🌿', 'holy basil': '🌿', 'tulsi': '🌿',
  oregano: '🌿',
  cilantro: '🌿', coriander: '🌿', 'coriander leaves': '🌿', 'coriander powder': '🌿',
  mint: '🌿',
  rosemary: '🌿',
  thyme: '🌿',
  dill: '🌿',
  sage: '🌿',
  cumin: '🌿', 'cumin powder': '🌿', 'cumin seeds': '🌿', 'jeera': '🌿',
  turmeric: '🟡', 'turmeric powder': '🟡', 'haldi': '🟡',
  ginger: '🫚',
  cinnamon: '🌿', 'cinnamon stick': '🌿', 'cinnamon powder': '🌿',
  nutmeg: '🌰', // Using nut for nutmeg
  clove: '🌿', 'cloves': '🌿',
  cardamom: '🌿', 'green cardamom': '🌿', 'black cardamom': '🌿', 'elaichi': '🌿',
  saffron: '🌼', 'kesar': '🌼',
  paprika: '🌶️',
  'black pepper': '⚫', 'peppercorns': '⚫', 'kali mirch': '⚫',
  'white pepper': '⚪',
  bayleaf: '🌿', 'bay leaf': '🌿', 'tej patta': '🌿',
  'star anise': '⭐',
  'curry leaves': '🌿', 'curry leaf': '🌿',
  'garam masala': '🔥', // Fire for garam masala mix
  'chili powder': '🌶️', 'red chili powder': '🌶️',
  'mustard seeds': '🟡', 'rai': '🟡',
  'fenugreek seeds': '🌿', 'methi seeds': '🌿',
  'fennel seeds': '🌿', 'saunf': '🌿',
  'asafoetida': '💨', 'hing': '💨', // Puff of smoke

  // Nuts & Seeds
  almond: '🌰', almonds: '🌰',
  peanut: '🥜', peanuts: '🥜',
  walnut: '🌰', walnuts: '🌰',
  cashew: '🌰', cashews: '🌰',
  pistachio: '🌰', pistachios: '🌰',
  hazelnut: '🌰', hazelnuts: '🌰',
  pecan: '🌰', pecans: '🌰',
  sesameseed: '🌰', 'sesame seed': '🌰', 'sesame seeds': '🌰', 'til': '🌰',
  sunflowerseed: '🌻', 'sunflower seed': '🌻', 'sunflower seeds': '🌻',
  chiaseed: '🫘', 'chia seed': '🫘', 'chia seeds': '🫘', // Using bean for seeds
  flaxseed: '🫘', 'flax seed': '🫘', 'flax seeds': '🫘',
  poppyseed: '🫘', 'poppy seed': '🫘', 'poppy seeds': '🫘',
  pumpkinseed: '🎃', 'pumpkin seed': '🎃', 'pumpkin seeds': '🎃',

  // Legumes
  lentil: '🫘', lentils: '🫘', 'red lentil': '🫘', 'green lentil': '🫘', 'brown lentil': '🫘', 'masoor dal': '🫘', 'moong dal': '🫘', 'toor dal': '🫘', 'chana dal': '🫘',
  chickpea: '🫘', chickpeas: '🫘', 'garbanzo beans': '🫘', 'chana': '🫘', 'kabuli chana': '🫘',
  'kidney bean': '🫘', kidneybean: '🫘', 'kidney beans': '🫘', 'rajma': '🫘',
  'black bean': '🫘', blackbean: '🫘', 'black beans': '🫘',
  'soy bean': '🫘', 'soybean': '🫘', 'soybeans': '🫘',
  edamame: '🫛',
  'lima beans': '🫘',
  'pinto beans': '🫘',

  // Other Food Items & Condiments
  water: '💧',
  chocolate: '🍫', 'dark chocolate': '🍫', 'milk chocolate': '🍫', 'white chocolate': '⬜', // White square for white chocolate
  'cocoa powder': '🍫',
  coffee: '☕', 'coffee beans': '☕',
  tea: '🫖', 'tea leaves': '🫖', 'green tea': '🍵', 'black tea': '☕',
  honey: '🍯',
  'maple syrup': '🍁',
  syrup: '🍯', // Generic syrup
  wine: '🍷', 'red wine': '🍷', 'white wine': '🥂',
  beer: '🍺',
  'soy sauce': '🍾',
  mustard: '💛', 'mustard paste': '💛',
  ketchup: '🍅',
  mayonnaise: '🥚', 'mayo': '🥚',
  jam: '🍓', // Strawberry for generic jam
  jelly: '🍇', // Grape for generic jelly
  broth: '🥣', 'chicken broth': '🐔', 'vegetable broth': '🥕', 'beef broth': '🥩',
  stock: '🥣',
  vanilla: '🍦', 'vanilla extract': '🍦', // Ice cream for vanilla
  gelatin: '🍮', // Custard/pudding for gelatin
  jaggery: '🟤', 'gur': '🟤', // Brown circle for jaggery
  breadcrumbs: '🍞',
  pickle: '🥒', pickles: '🥒',
  olives: '🫒', 'black olives': '⚫', 'green olives': '🟢',

  // Common recipe keywords that are not single ingredients (less priority, matched if specific ingredient isn't)
  curry: '🍛',
  soup: '🥣',
  salad: '🥗',
  sandwich: '🥪',
  pizza: '🍕',
  burger: '🍔',
  taco: '🌮',
  cake: '🍰',
  pie: '🥧',
  cookie: '🍪', cookies: '🍪',
  icecream: '🍨', 'ice cream': '🍨',
  smoothie: '🥤',
  juice: '🧃',
  sauce: '🥫', // Generic sauce
  'pasta sauce': '🍝',
  'pizza sauce': '🍕',
  dressing: '🥗', // Salad for dressing
  gravy: '🥣',
  stew: '🥘',
  casserole: '🥘',
  wrap: '🌯',
  roll: '🌯', // Spring roll, kathi roll etc.
  biryani: '🍚', // Rice for biryani
  korma: '🍛',
  tikka: '🍢', // Skewer for tikka
  kebab: '🍢',
  'french fries': '🍟',
  chips: '🥔', // Potato for chips
};

// Order of keywords matters if one is a substring of another.
// This array helps process longer keywords first.
const sortedEmojiKeywords = Object.keys(ingredientEmojiMap).sort((a, b) => b.length - a.length);

export function getEmojiForIngredient(ingredientName: string): string {
  const nameLower = ingredientName.toLowerCase().replace(/,/g, ''); // Remove commas for better matching
  
  // Prioritize exact or near-exact matches for longer phrases first
  for (const keyword of sortedEmojiKeywords) {
    // Regex for whole word matching (or phrase matching)
    // For single word keywords, use word boundaries. For multi-word, match as phrase.
    const pattern = keyword.includes(' ') ? `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b` : `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`;
    const regex = new RegExp(pattern, 'i');
    if (regex.test(nameLower)) {
      return ingredientEmojiMap[keyword];
    }
  }

  // Fallback: If no specific match, try a general includes for broader matching, still prioritizing longer keywords
  for (const keyword of sortedEmojiKeywords) {
      if (nameLower.includes(keyword)) {
          return ingredientEmojiMap[keyword];
      }
  }
  return ''; // No emoji if no match
}

    