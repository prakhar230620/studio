
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
  tomato: '🍅', tomatoes: '🍅', 'cherry tomato': '🍅', 'roma tomato': '🍅',
  potato: '🥔', potatoes: '🥔', 'russet potato': '🥔', 'red potato': '🥔', 'yukon gold potato': '🥔',
  onion: '🧅', onions: '🧅',
  'red onion': '🧅', 'yellow onion': '🧅', 'white onion': '🧅',
  'spring onion': '🧅', 'green onion': '🧅', 'scallion': '🧅',
  shallot: '🧄', shallots: '🧄', // Closer to garlic in appearance/use sometimes
  garlic: '🧄', 'garlic clove': '🧄', 'minced garlic': '🧄',
  carrot: '🥕', carrots: '🥕',
  broccoli: '🥦', 'broccoli florets': '🥦',
  spinach: '🥬', 'baby spinach': '🥬',
  lettuce: '🥬', 'romaine lettuce': '🥬', 'iceberg lettuce': '🥬',
  cucumber: '🥒', cucumbers: '🥒',
  'bell pepper': '🫑', 'bell peppers': '🫑',
  'red bell pepper': '🫑',
  'green bell pepper': '🫑',
  'yellow bell pepper': '🫑',
  'orange bell pepper': '🫑',
  capsicum: '🫑',
  pepper: '🌶️', // General pepper for spicy types
  chili: '🌶️', 'chilli': '🌶️', 'green chili': '🌶️', 'red chili': '🌶️',
  'jalapeno pepper': '🌶️', jalapeno: '🌶️',
  'serrano pepper': '🌶️',
  'cayenne pepper': '🌶️',
  'chili powder': '🌶️', 'red chili powder': '🌶️', 'cayenne powder': '🌶️',
  corn: '🌽', 'sweet corn': '🌽',
  pea: '🫛', peas: '🫛', 'green peas': '🫛', 'snow peas': '🫛', 'snap peas': '🫛',
  mushroom: '🍄', mushrooms: '🍄', 'button mushroom': '🍄', 'cremini mushroom': '🍄', 'portobello mushroom': '🍄', 'shiitake mushroom': '🍄',
  eggplant: '🍆', 'aubergine': '🍆',
  cabbage: '🥬', 'red cabbage': '🥬', 'green cabbage': '🥬',
  pumpkin: '🎃',
  zucchini: '🥒',
  cauliflower: '🥦', // Using broccoli as proxy
  sweetpotato: '🍠', 'sweet potato': '🍠',
  beetroot: '🍠', beets: '🍠', // Using sweet potato as proxy
  radish: '🥕', radishes: '🥕', // Using carrot as proxy
  celery: '🥬', // Using lettuce/cabbage as proxy
  asparagus: '🌿', // Generic herb/plant for asparagus
  kale: '🥬',
  leek: '🥬', leeks: '🥬',
  artichoke: ' artichoke ', // Placeholder
  brusselsprout: '🥬', 'brussels sprout': '🥬', 'brussels sprouts': '🥬',
  okra: '🟢', // Green circle
  turnip: ' turnips ', // Placeholder
  parsnip: '🥕', // Using carrot
  yam: '🍠',
  squash: '🎃', 'butternut squash': '🎃', 'spaghetti squash': '🎃', 'acorn squash': '🎃',

  // Grains, Pasta, Bread & Staples
  flour: '🌾', 'all-purpose flour': '🌾', 'wheat flour': '🌾', 'whole wheat flour': '🌾', 'bread flour': '🌾', 'cake flour': '🌾', 'maida': '🌾', 'gram flour': '🌾', 'besan': '🌾',
  rice: '🍚', 'basmati rice': '🍚', 'jasmine rice': '🍚', 'brown rice': '🍚', 'white rice': '🍚', 'sushi rice': '🍚', 'arborio rice': '🍚', 'dosa rice': '🍚',
  pasta: '🍝', 'spaghetti': '🍝', 'penne': '🍝', 'macaroni': '🍝', 'fettuccine': '🍝', 'lasagna noodles': '🍝',
  bread: '🍞', 'white bread': '🍞', 'brown bread': '🍞', 'whole wheat bread': '🍞', 'sourdough bread': '🍞',
  baguette: '🥖',
  bun: '🍔', 'burger bun': '🍔', 'hot dog bun': '🌭',
  noodle: '🍜', noodles: '🍜', 'ramen noodles': '🍜', 'egg noodles': '🍜', 'rice noodles': '🍜', 'soba noodles': '🍜', 'udon noodles': '🍜',
  oat: '🥣', oats: '🥣', oatmeal: '🥣', 'rolled oats': '🥣', 'steel-cut oats': '🥣',
  quinoa: '🍚', // Using rice as proxy
  couscous: '🍚', // Using rice as proxy
  cornmeal: '🌽', polenta: '🌽',
  cornstarch: '🥣', 'corn starch': '🥣', 'corn flour': '🥣', // (UK cornflour is cornstarch)
  'potato starch': '🥣',
  semolina: '🌾', 'sooji': '🌾', 'suji': '🌾',
  barley: '🌾',
  sugar: '🍬', 'white sugar': '🍬', 'granulated sugar': '🍬', 'caster sugar': '🍬',
  'brown sugar': '🟤', 'light brown sugar': '🟤', 'dark brown sugar': '🟤',
  'icing sugar': '🍬', 'powdered sugar': '🍬', 'confectioners sugar': '🍬',
  salt: '🧂', 'table salt': '🧂', 'sea salt': '🧂', 'kosher salt': '🧂', 'himalayan pink salt': '🧂', 'black salt': '🧂',
  'olive oil': '🫒', 'extra virgin olive oil': '🫒',
  'vegetable oil': '🛢️', 'cooking oil': '🛢️',
  'sunflower oil': '🌻',
  'canola oil': '🛢️',
  'corn oil': '🌽',
  'sesame oil': '🌰', 'toasted sesame oil': '🌰',
  'mustard oil': '🌻',
  'coconut oil': '🥥', 'virgin coconut oil': '🥥',
  oil: '🛢️', // Generic oil
  vinegar: '🍾', 'apple cider vinegar': '🍎', 'white vinegar': '🍾', 'balsamic vinegar': '🍾', 'red wine vinegar': '🍷', 'white wine vinegar': '🥂', 'rice vinegar': '🍚',
  yeast: '🟫', 'active dry yeast': '🟫', 'instant yeast': '🟫', // Updated yeast emoji
  'baking soda': '🧂', // Using salt as placeholder for white powder
  'baking powder': '🧂', // Using salt as placeholder for white powder


  // Dairy & Alternatives
  milk: '🥛', 'cow milk': '🥛', 'whole milk': '🥛', 'skim milk': '🥛', 'low-fat milk': '🥛',
  cheese: '🧀', 'cheddar cheese': '🧀', 'mozzarella cheese': '🧀', 'parmesan cheese': '🧀', 'feta cheese': '🧀', 'cottage cheese': '🧀', 'cream cheese': '🧀', 'goat cheese': '🐐', 'swiss cheese': '🧀', 'provolone cheese': '🧀', 'blue cheese': '🧀',
  paneer: '🧀', // Using cheese for paneer
  butter: '🧈', 'unsalted butter': '🧈', 'salted butter': '🧈',
  yogurt: '🥣', 'yoghurt': '🥣', 'greek yogurt': '🥣', 'plain yogurt': '🥣',
  cream: '🥛', 'heavy cream': '🥛', 'light cream': '🥛', 'whipping cream': '🥛',
  'sour cream': '🥣',
  'half-and-half': '🥛',
  egg: '🥚', eggs: '🥚', 'egg white': '🥚', 'egg yolk': '🥚',
  tofu: '⬜', // White square
  'almond milk': '🥛', 'soy milk': '🥛', 'oat milk': '🥛',
  'coconut milk': '🥥', 'coconut cream': '🥥',
  ghee: '🧈', // Using butter

  // Meats, Poultry & Proteins
  chicken: '🐔', 'chicken breast': '🐔', 'chicken thigh': '🐔', 'chicken drumstick': '🐔', 'chicken wing': '🐔', 'ground chicken': '🐔', 'whole chicken': '🐔',
  beef: '🥩', 'ground beef': '🥩', 'steak': '🥩', 'beef steak': '🥩', 'beef roast': '🥩', 'beef ribs': '🍖',
  pork: '🥓', 'pork chop': '🥩', 'ground pork': '🥓', 'pork loin': '🥩', 'pork belly': '🥓', 'pork ribs': '🍖',
  bacon: '🥓',
  fish: '🐟', 'salmon': '🐟', 'tuna': '🐟', 'cod': '🐟', 'tilapia': '🐟', 'halibut': '🐟', 'trout': '🐟', 'sardines': '🐟', 'anchovies': '🐟',
  shrimp: '🦐', prawn: '🦐',
  lamb: '🐑', 'ground lamb': '🐑', 'lamb chop': '🥩',
  turkey: '🦃', 'ground turkey': '🦃', 'turkey breast': '🦃',
  sausage: '🌭', 'pork sausage': '🌭', 'beef sausage': '🌭', 'chicken sausage': '🌭', 'italian sausage': '🇮🇹',
  ham: '🍖',
  crab: '🦀', 'crab meat': '🦀',
  lobster: '🦞',
  duck: '🦆', 'duck breast': '🦆',

  // Spices & Herbs (generic for many, specific for some)
  parsley: '🌿', 'fresh parsley': '🌿', 'dried parsley': '🌿',
  basil: '🌿', 'fresh basil': '🌿', 'dried basil': '🌿', 'holy basil': '🌿', 'tulsi': '🌿',
  oregano: '🌿', 'dried oregano': '🌿',
  cilantro: '🌿', 'fresh cilantro': '🌿', 'coriander leaves': '🌿', 'dried cilantro': '🌿',
  coriander: '🌿', 'coriander powder': '🌿', 'coriander seeds': '🌿', 'ground coriander': '🌿',
  mint: '🌿', 'fresh mint': '🌿',
  rosemary: '🌿', 'fresh rosemary': '🌿', 'dried rosemary': '🌿',
  thyme: '🌿', 'fresh thyme': '🌿', 'dried thyme': '🌿',
  dill: '🌿', 'fresh dill': '🌿', 'dried dill': '🌿',
  sage: '🌿', 'fresh sage': '🌿', 'dried sage': '🌿',
  cumin: '🌿', 'cumin powder': '🌿', 'cumin seeds': '🌿', 'ground cumin': '🌿', 'jeera': '🌿',
  turmeric: '🟡', 'turmeric powder': '🟡', 'ground turmeric': '🟡', 'haldi': '🟡',
  ginger: '🫚', 'fresh ginger': '🫚', 'ground ginger': '🫚', 'ginger paste': '🫚',
  'ginger-garlic paste': '🧄', // Prioritize garlic emoji
  cinnamon: '🌿', 'cinnamon stick': '🌿', 'cinnamon powder': '🌿', 'ground cinnamon': '🌿',
  nutmeg: '🌰', 'ground nutmeg': '🌰', // Using nut for nutmeg
  clove: '🌿', 'cloves': '🌿', 'ground cloves': '🌿',
  cardamom: '🌿', 'green cardamom': '🌿', 'black cardamom': '🌿', 'cardamom pods': '🌿', 'ground cardamom': '🌿', 'elaichi': '🌿',
  saffron: '🌼', 'kesar': '🌼', 'saffron threads': '🌼',
  paprika: '🌶️', 'smoked paprika': '🌶️', 'sweet paprika': '🌶️',
  'black pepper': '⚫', 'peppercorns': '⚫', 'ground black pepper': '⚫', 'kali mirch': '⚫',
  'white pepper': '⚪', 'ground white pepper': '⚪',
  bayleaf: '🌿', 'bay leaf': '🌿', 'bay leaves': '🌿', 'tej patta': '🌿',
  'star anise': '⭐',
  'curry leaves': '🌿', 'curry leaf': '🌿',
  'garam masala': '🔥', // Fire for garam masala mix
  'mustard seeds': '🟡', 'black mustard seeds': '⚫', 'yellow mustard seeds': '🟡', 'rai': '🟡',
  'fenugreek seeds': '🌿', 'methi seeds': '🌿',
  fenugreek: '🌿', 'fenugreek leaves': '🌿', 'dried fenugreek leaves': '🌿', 'kasuri methi': '🌿',
  'fennel seeds': '🌿', 'saunf': '🌿',
  'asafoetida': '💨', 'hing': '💨', // Puff of smoke
  'ajwain': '🌿', 'carom seeds': '🌿',
  'poppy seeds': '🫘', 'khus khus': '🫘',
  'sesame seeds': '🌰', 'white sesame seeds': '🌰', 'black sesame seeds': '⚫', 'til': '🌰',
  'chives': '🌿', 'fresh chives': '🌿',
  'tarragon': '🌿',
  'marjoram': '🌿',
  'lemongrass': '🌿',

  // Nuts & Seeds (General)
  almond: '🌰', almonds: '🌰', 'sliced almonds': '🌰', 'slivered almonds': '🌰', 'almond flour': '🌾',
  peanut: '🥜', peanuts: '🥜',
  walnut: '🌰', walnuts: '🌰',
  cashew: '🌰', cashews: '🌰',
  pistachio: '🌰', pistachios: '🌰',
  hazelnut: '🌰', hazelnuts: '🌰',
  pecan: '🌰', pecans: '🌰',
  'sunflower seed': '🌻', 'sunflower seeds': '🌻',
  'chia seed': '🫘', 'chia seeds': '🫘', // Using bean for seeds
  'flax seed': '🫘', 'flax seeds': '🫘', 'ground flaxseed': '🫘',
  'pumpkin seed': '🎃', 'pumpkin seeds': '🎃', 'pepitas': '🎃',
  'pine nut': '🌲', 'pine nuts': '🌲', // Pine tree for pine nuts


  // Legumes
  'urad dal': '🫘',
  lentil: '🫘', lentils: '🫘', 'red lentil': '🫘', 'green lentil': '🫘', 'brown lentil': '🫘', 'puy lentils': '🫘', 'masoor dal': '🫘', 'moong dal': '🫘', 'toor dal': '🫘', 'chana dal': '🫘',
  chickpea: '🫘', chickpeas: '🫘', 'garbanzo beans': '🫘', 'chana': '🫘', 'kabuli chana': '🫘',
  'kidney bean': '🫘', 'kidney beans': '🫘', 'red kidney beans': '🫘', 'rajma': '🫘',
  'black bean': '🫘', 'black beans': '🫘',
  'soy bean': '🫘', 'soybean': '🫘', 'soybeans': '🫘',
  edamame: '🫛',
  'lima beans': '🫘',
  'pinto beans': '🫘',
  'navy beans': '🫘',
  'split peas': '🫛',

  // Other Food Items & Condiments
  water: '💧',
  ice: '🧊',
  chocolate: '🍫', 'dark chocolate': '🍫', 'milk chocolate': '🍫', 'semi-sweet chocolate': '🍫', 'bittersweet chocolate': '🍫', 'chocolate chips': '🍫',
  'white chocolate': '⬜', // White square for white chocolate
  'cocoa powder': '🍫', 'unsweetened cocoa powder': '🍫',
  coffee: '☕', 'coffee beans': '☕', 'ground coffee': '☕', 'instant coffee': '☕',
  tea: '🫖', 'tea leaves': '🫖', 'black tea': '☕', 'green tea': '🍵', 'herbal tea': '🌿',
  honey: '🍯',
  'maple syrup': '🍁',
  syrup: '🍯', 'corn syrup': '🌽', 'golden syrup': '🍯', // Generic syrup
  wine: '🍷', 'red wine': '🍷', 'white wine': '🥂',
  beer: '🍺',
  vodka: '🍸', rum: '🥃', whiskey: '🥃', gin: '🍸', tequila: '🍹',
  'soy sauce': '🍾', 'tamari': '🍾', 'shoyu': '🍾',
  mustard: '💛', 'dijon mustard': '💛', 'yellow mustard': '💛', 'mustard paste': '💛',
  ketchup: '🍅',
  mayonnaise: '🥚', 'mayo': '🥚',
  jam: '🍓', 'strawberry jam': '🍓', 'raspberry jam': '🍓', 'apricot jam': '🍑',
  jelly: '🍇', 'grape jelly': '🍇',
  broth: '🥣', 'chicken broth': '🐔', 'vegetable broth': '🥕', 'beef broth': '🥩', 'bone broth': '🦴',
  stock: '🥣', 'chicken stock': '🐔', 'vegetable stock': '🥕', 'beef stock': '🥩',
  vanilla: '🍦', 'vanilla extract': '🍦', 'vanilla bean': '🌿', // Ice cream for vanilla
  gelatin: '🍮', // Custard/pudding for gelatin
  jaggery: '🟤', 'gur': '🟤', // Brown circle for jaggery
  breadcrumbs: '🍞', 'panko breadcrumbs': '🍞',
  pickle: '🥒', pickles: '🥒', 'dill pickle': '🥒',
  olives: '🫒', 'black olives': '⚫', 'green olives': '🟢', 'kalamata olives': '🫒',
  'pizza sauce': '🍕', // More specific sauce for pizza
  'pasta sauce': '🍝', 'marinara sauce': '🍅', // More specific sauce for pasta
  tahini: '🌰', // Sesame paste
  'peanut butter': '🥜',
  'almond butter': '🌰',
  'hot sauce': '🌶️', 'sriracha': '🌶️', 'tabasco': '🌶️',
  'worcestershire sauce': '🍾',
  'fish sauce': '🐟',
  'oyster sauce': '🦪',
  capers: '🟢', // Small green circle

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
  dressing: '🥗', 'salad dressing': '🥗',
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
  chips: '🥔', // Potato for chips (crisps in UK)
  crisps: '🥔', // For UK style potato chips
  popcorn: '🍿',
};

// Order of keywords matters if one is a substring of another.
// This array helps process longer keywords first.
// Prioritize phrases (containing spaces) if lengths are equal.
const sortedEmojiKeywords = Object.keys(ingredientEmojiMap).sort((a, b) => {
  const lenDiff = b.length - a.length;
  if (lenDiff !== 0) {
    return lenDiff;
  }
  // If lengths are equal, prioritize phrases (those containing spaces)
  const aIsPhrase = a.includes(' ');
  const bIsPhrase = b.includes(' ');
  if (aIsPhrase && !bIsPhrase) return -1; // a comes first
  if (!aIsPhrase && bIsPhrase) return 1;  // b comes first
  return 0; // Keep original relative order or sort alphabetically if needed
});

export function getEmojiForIngredient(ingredientName: string): string {
  const nameLower = ingredientName.toLowerCase().replace(/,/g, '').trim();
  
  // Prioritize exact or near-exact matches for longer phrases first
  for (const keyword of sortedEmojiKeywords) {
    // Regex for whole word matching (or phrase matching)
    // Escape special regex characters in the keyword
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = `\\b${escapedKeyword}\\b`;
    const regex = new RegExp(pattern, 'i');
    if (regex.test(nameLower)) {
      return ingredientEmojiMap[keyword];
    }
  }

  // Fallback: If no specific regex match, try a general includes for broader matching, still prioritizing longer keywords
  for (const keyword of sortedEmojiKeywords) {
      if (nameLower.includes(keyword)) {
          return ingredientEmojiMap[keyword];
      }
  }
  return ''; // No emoji if no match
}
