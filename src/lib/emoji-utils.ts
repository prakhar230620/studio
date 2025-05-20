
// src/lib/emoji-utils.ts

const ingredientEmojiMap: Record<string, string> = {
  // Fruits
  apple: '🍎', apples: '🍎', 'green apple': '🍏', 'red apple': '🍎',
  banana: '🍌', bananas: '🍌',
  orange: '🍊', oranges: '🍊', 'blood orange': '🍊', 'mandarin orange': '🍊', 'tangerine': '🍊',
  lemon: '🍋', lemons: '🍋',
  lime: '🍋', limes: '🍋', 'key lime': '🍋',
  grape: '🍇', grapes: '🍇', 'green grapes': '🍇', 'red grapes': '🍇',
  strawberry: '🍓', strawberries: '🍓',
  blueberry: '🫐', blueberries: '🫐',
  raspberry: '🍓', raspberries: '🍓', // Using strawberry as proxy
  blackberry: '🫐', blackberries: '🫐', // Using blueberry as proxy
  pineapple: '🍍', pineapples: '🍍',
  mango: '🥭', mangoes: '🥭',
  watermelon: '🍉', watermelons: '🍉',
  peach: '🍑', peaches: '🍑',
  pear: '🍐', pears: '🍐',
  cherry: '🍒', cherries: '🍒', 'bing cherry': '🍒', 'ranier cherry': '🍒',
  plum: '🍑', plums: '🍑', // Using peach for plum
  kiwi: '🥝', kiwis: '🥝',
  coconut: '🥥', coconuts: '🥥', 'shredded coconut': '🥥',
  fig: '🍑', figs: '🍑', // Using peach for fig as placeholder
  pomegranate: '🍓', pomegranates: '🍓', // Using strawberry as placeholder
  avocado: '🥑', avocados: '🥑',
  papaya: '🥭', // Using mango as proxy
  guava: '🍈', // Using melon as proxy
  melon: '🍈', 'cantaloupe': '🍈', 'honeydew': '🍈',
  apricot: '🍑', apricots: '🍑',
  nectarine: '🍑', nectarines: '🍑',
  passionfruit: '🍓', // Placeholder
  dragonfruit: '🐉', 'pitaya': '🐉', // Placeholder text, actual emoji might be different
  lychee: '🔴', // Red circle
  rambutan: '🔴', // Red circle
  durian: '🍈', // Proxy
  persimmon: '🍑', // Proxy
  starfruit: '⭐', 'carambola': '⭐',
  cranberry: '🔴', cranberries: '🔴',
  date: '🌴', dates: '🌴', // Palm tree for dates
  gooseberry: '🟢', // Green circle
  currant: '🔴', 'blackcurrant': '🫐', 'redcurrant': '🔴',
  rhubarb: '🌿',
  elderberry: '🫐',

  // Vegetables
  tomato: '🍅', tomatoes: '🍅', 'cherry tomato': '🍅', 'roma tomato': '🍅', 'grape tomato': '🍅', 'heirloom tomato': '🍅', 'sun-dried tomato': '🍅', 'canned tomatoes': '🥫', 'tomato paste': '🥫', 'tomato sauce': '🥫', 'tomato puree': '🥫',
  potato: '🥔', potatoes: '🥔', 'russet potato': '🥔', 'red potato': '🥔', 'yukon gold potato': '🥔', 'fingerling potato': '🥔', 'new potato': '🥔',
  onion: '🧅', onions: '🧅',
  'red onion': '🧅', 'yellow onion': '🧅', 'white onion': '🧅', 'sweet onion': '🧅',
  'spring onion': '🧅', 'green onion': '🧅', 'scallion': '🧅',
  shallot: '🧄', shallots: '🧄', // Closer to garlic in appearance/use sometimes
  garlic: '🧄', 'garlic clove': '🧄', 'minced garlic': '🧄', 'garlic powder': '🧂', 'granulated garlic': '🧂',
  carrot: '🥕', carrots: '🥕', 'baby carrot': '🥕',
  broccoli: '🥦', 'broccoli florets': '🥦', 'broccolini': '🥦',
  spinach: '🥬', 'baby spinach': '🥬',
  lettuce: '🥬', 'romaine lettuce': '🥬', 'iceberg lettuce': '🥬', 'butter lettuce': '🥬', 'arugula': '🌿', 'rocket': '🌿', 'mache': '🌿', 'radicchio': '🥬', 'endive': '🥬',
  cucumber: '🥒', cucumbers: '🥒', 'pickling cucumber': '🥒', 'english cucumber': '🥒',
  'bell pepper': '🫑', 'bell peppers': '🫑',
  'red bell pepper': '🫑',
  'green bell pepper': '🫑',
  'yellow bell pepper': '🫑',
  'orange bell pepper': '🫑',
  capsicum: '🫑',
  pepper: '🌶️', // General pepper for spicy types
  chili: '🌶️', 'chilli': '🌶️', 'green chili': '🌶️', 'red chili': '🌶️', 'bird eye chili': '🌶️',
  'jalapeno pepper': '🌶️', jalapeno: '🌶️',
  'serrano pepper': '🌶️',
  'habanero pepper': '🌶️',
  'poblano pepper': '🫑', // Less spicy
  'anaheim pepper': '🫑',
  'cayenne pepper': '🌶️',
  'chipotle pepper': '🌶️', // Smoked jalapeno
  'chili powder': '🌶️', 'red chili powder': '🌶️', 'cayenne powder': '🌶️', 'ancho chili powder': '🌶️', 'chipotle powder': '🌶️',
  corn: '🌽', 'sweet corn': '🌽', 'corn on the cob': '🌽', 'canned corn': '🥫', 'frozen corn': '🧊',
  pea: '🫛', peas: '🫛', 'green peas': '🫛', 'snow peas': '🫛', 'snap peas': '🫛', 'split peas': '🫛', 'chickpea': '🫘', 'chickpeas': '🫘', 'garbanzo beans': '🫘', 'chana': '🫘', 'kabuli chana': '🫘',
  mushroom: '🍄', mushrooms: '🍄', 'button mushroom': '🍄', 'cremini mushroom': '🍄', 'portobello mushroom': '🍄', 'shiitake mushroom': '🍄', 'oyster mushroom': '🍄', 'enoki mushroom': '🍄', 'maitake mushroom': '🍄', 'chanterelle mushroom': '🍄', 'morel mushroom': '🍄', 'dried mushroom': '🍄',
  eggplant: '🍆', 'aubergine': '🍆',
  cabbage: '🥬', 'red cabbage': '🥬', 'green cabbage': '🥬', 'napa cabbage': '🥬', 'savoy cabbage': '🥬', 'bok choy': '🥬', 'pak choi': '🥬',
  pumpkin: '🎃', 'pumpkin puree': '🎃',
  zucchini: '🥒', 'courgette': '🥒',
  cauliflower: '🥦', // Using broccoli as proxy
  sweetpotato: '🍠', 'sweet potato': '🍠',
  beetroot: '🍠', beets: '🍠', // Using sweet potato as proxy
  radish: '🥕', radishes: '🥕', 'daikon radish': '⚪', // Using carrot as proxy for generic, white circle for daikon
  celery: '🥬', // Using lettuce/cabbage as proxy
  asparagus: '🌿', // Generic herb/plant for asparagus
  kale: '🥬',
  leek: '🥬', leeks: '🥬',
  artichoke: '🌿', 'artichoke hearts': '🌿', // Placeholder
  brusselsprout: '🥬', 'brussels sprout': '🥬', 'brussels sprouts': '🥬',
  okra: '🟢', 'lady finger': '🟢', // Green circle
  turnip: '⚪', turnips: '⚪', // Placeholder, white circle
  parsnip: '🥕', // Using carrot
  yam: '🍠',
  squash: '🎃', 'butternut squash': '🎃', 'spaghetti squash': '🎃', 'acorn squash': '🎃', 'delicata squash': '🎃',
  fennel: '🌿', 'fennel bulb': '🌿',
  kohlrabi: '🥬', // Proxy
  watercress: '🌿',
  swisschard: '🥬', 'swiss chard': '🥬',
  jerusalemartichoke: '🥔', 'sunchoke': '🥔', // Proxy

  // Grains, Pasta, Bread & Staples
  flour: '🌾', 'all-purpose flour': '🌾', 'wheat flour': '🌾', 'whole wheat flour': '🌾', 'bread flour': '🌾', 'cake flour': '🌾', 'maida': '🌾', 'gram flour': '🌾', 'besan': '🌾', 'rice flour': '🍚', 'corn flour': '🌽', 'semolina': '🌾', 'sooji': '🌾', 'suji': '🌾', 'rye flour': '🌾', 'spelt flour': '🌾', 'oat flour': '🥣', 'coconut flour': '🥥', 'almond flour': '🌰', 'tapioca flour': '⚪', 'arrowroot powder': '⚪',
  rice: '🍚', 'basmati rice': '🍚', 'jasmine rice': '🍚', 'brown rice': '🍚', 'white rice': '🍚', 'sushi rice': '🍚', 'arborio rice': '🍚', 'wild rice': '🌾', 'long grain rice': '🍚', 'short grain rice': '🍚', 'sticky rice': '🍚', 'puffed rice': '🍚', 'flattened rice': '🍚', 'poha': '🍚', 'dosa rice': '🍚',
  pasta: '🍝', 'spaghetti': '🍝', 'penne': '🍝', 'macaroni': '🍝', 'fettuccine': '🍝', 'lasagna noodles': '🍝', 'fusilli': '🍝', 'rigatoni': '🍝', 'linguine': '🍝', 'orzo': '🍚', 'ravioli': '🥟', 'tortellini': '🥟',
  bread: '🍞', 'white bread': '🍞', 'brown bread': '🍞', 'whole wheat bread': '🍞', 'sourdough bread': '🍞', 'multigrain bread': '🍞', 'rye bread': '🍞', 'pita bread': '🥙', 'naan bread': '🥙', 'flatbread': '🥙',
  baguette: '🥖',
  bun: '🍔', 'burger bun': '🍔', 'hot dog bun': '🌭', 'brioche bun': '🍔', 'slider bun': '🍔',
  noodle: '🍜', noodles: '🍜', 'ramen noodles': '🍜', 'egg noodles': '🍜', 'rice noodles': '🍜', 'soba noodles': '🍜', 'udon noodles': '🍜', 'vermicelli': '🍜', 'glass noodles': '🍜', 'chow mein noodles': '🍜',
  oat: '🥣', oats: '🥣', oatmeal: '🥣', 'rolled oats': '🥣', 'steel-cut oats': '🥣', 'quick oats': '🥣',
  quinoa: '🍚', // Using rice as proxy
  couscous: '🍚', // Using rice as proxy
  cornmeal: '🌽', polenta: '🌽', 'grits': '🌽',
  cornstarch: '🌽', 'corn starch': '🌽', // (UK cornflour is cornstarch)
  'potato starch': '🥔',
  barley: '🌾', 'pearl barley': '🌾',
  sugar: '🍬', 'white sugar': '🍬', 'granulated sugar': '🍬', 'caster sugar': '🍬',
  'brown sugar': '🟤', 'light brown sugar': '🟤', 'dark brown sugar': '🟤', 'muscovado sugar': '🟤', 'demerara sugar': '🟤',
  'icing sugar': '🍬', 'powdered sugar': '🍬', 'confectioners sugar': '🍬',
  'maple syrup': '🍁',
  honey: '🍯',
  agave: '🍯', 'agave nectar': '🍯', // Using honey as proxy
  molasses: '🟤', 'blackstrap molasses': '🟤',
  'corn syrup': '🌽', 'high fructose corn syrup': '🌽', 'golden syrup': '🍯',
  stevia: '🌿', // Herb for stevia
  salt: '🧂', 'table salt': '🧂', 'sea salt': '🧂', 'kosher salt': '🧂', 'himalayan pink salt': '🧂', 'black salt': '🧂', 'kala namak': '🧂', 'rock salt': '🧂', 'fleur de sel': '🧂',
  'olive oil': '🫒', 'extra virgin olive oil': '🫒', 'light olive oil': '🫒',
  'vegetable oil': '🛢️', 'cooking oil': '🛢️',
  'sunflower oil': '🌻',
  'canola oil': '🛢️', 'rapeseed oil': '🛢️',
  'corn oil': '🌽',
  'sesame oil': '🌰', 'toasted sesame oil': '🌰',
  'mustard oil': '🌻', // Using sunflower as proxy for a seed oil
  'coconut oil': '🥥', 'virgin coconut oil': '🥥', 'refined coconut oil': '🥥',
  'peanut oil': '🥜',
  'avocado oil': '🥑',
  'grapeseed oil': '🍇',
  'flaxseed oil': '🫘',
  'walnut oil': '🌰',
  'almond oil': '🌰',
  oil: '🛢️', // Generic oil
  vinegar: '🍾', 'apple cider vinegar': '🍎', 'white vinegar': '🍾', 'balsamic vinegar': '🍾', 'red wine vinegar': '🍷', 'white wine vinegar': '🥂', 'rice vinegar': '🍚', 'malt vinegar': '🍺', 'sherry vinegar': '🍾', 'champagne vinegar': '🥂',
  yeast: '🟫', 'active dry yeast': '🟫', 'instant yeast': '🟫', 'fresh yeast': '🟫', 'nutritional yeast': '🧀', // Often has a cheesy flavor
  'baking soda': '🧂', // Using salt as placeholder for white powder
  'baking powder': '🧂', // Using salt as placeholder for white powder
  'cream of tartar': '🧂',

  // Dairy & Alternatives
  milk: '🥛', 'cow milk': '🥛', 'whole milk': '🥛', 'skim milk': '🥛', 'low-fat milk': '🥛', 'semi-skimmed milk': '🥛', 'evaporated milk': '🥫', 'condensed milk': '🥫', 'powdered milk': '🥣', 'buttermilk': '🥛',
  cheese: '🧀', 'cheddar cheese': '🧀', 'mozzarella cheese': '🧀', 'parmesan cheese': '🧀', 'feta cheese': '🧀', 'cottage cheese': '🧀', 'cream cheese': '🧀', 'goat cheese': '🐐', 'swiss cheese': '🧀', 'provolone cheese': '🧀', 'blue cheese': '🧀', 'brie cheese': '🧀', 'camembert cheese': '🧀', 'gouda cheese': '🧀', 'ricotta cheese': '🧀', 'mascarpone cheese': '🧀', 'halloumi cheese': '🧀', 'manchego cheese': '🧀', 'gruyere cheese': '🧀',
  paneer: '🧀', // Using cheese for paneer
  butter: '🧈', 'unsalted butter': '🧈', 'salted butter': '🧈', 'clarified butter': '🧈',
  yogurt: '🥣', 'yoghurt': '🥣', 'greek yogurt': '🥣', 'plain yogurt': '🥣', 'fruit yogurt': '🍓',
  cream: '🥛', 'heavy cream': '🥛', 'light cream': '🥛', 'whipping cream': '🥛', 'double cream': '🥛', 'single cream': '🥛', 'clotted cream': '🧈',
  'sour cream': '🥣',
  'creme fraiche': '🥣',
  'half-and-half': '🥛',
  egg: '🥚', eggs: '🥚', 'egg white': '🥚', 'egg yolk': '🥚', 'hard boiled egg': '🥚', 'scrambled eggs': '🍳', 'omelette': '🍳', 'fried egg': '🍳',
  tofu: '⬜', 'silken tofu': '⬜', 'firm tofu': '⬜', 'smoked tofu': '⬜', // White square
  'almond milk': '🥛', 'soy milk': '🥛', 'oat milk': '🥛', 'rice milk': '🍚', 'hemp milk': '🌿', 'cashew milk': '🌰',
  'coconut milk': '🥥', 'coconut cream': '🥥',
  ghee: '🧈', // Using butter

  // Meats, Poultry & Proteins
  chicken: '🐔', 'chicken breast': '🐔', 'chicken thigh': '🐔', 'chicken drumstick': '🐔', 'chicken wing': '🐔', 'ground chicken': '🐔', 'whole chicken': '🐔', 'roast chicken': '🍗',
  beef: '🥩', 'ground beef': '🥩', 'steak': '🥩', 'beef steak': '🥩', 'beef roast': '🥩', 'beef ribs': '🍖', 'brisket': '🥩', 'sirloin': '🥩', 'ribeye': '🥩', 'filet mignon': '🥩', 'corned beef': '🥩', 'beef jerky': '🥩',
  pork: '🥓', 'pork chop': '🥩', 'ground pork': '🥓', 'pork loin': '🥩', 'pork belly': '🥓', 'pork ribs': '🍖', 'pork shoulder': '🍖', 'pulled pork': '🍖',
  bacon: '🥓', 'pancetta': '🥓',
  fish: '🐟', 'salmon': '🐟', 'tuna': '🐟', 'cod': '🐟', 'tilapia': '🐟', 'halibut': '🐟', 'trout': '🐟', 'sardines': '🐟', 'anchovies': '🐟', 'mackerel': '🐟', 'sea bass': '🐟', 'snapper': '🐟', 'catfish': '🐟', 'smoked salmon': '🐟', 'canned tuna': '🥫',
  shrimp: '🦐', prawn: '🦐', 'king prawn': '🦐', 'tiger prawn': '🦐',
  lamb: '🐑', 'ground lamb': '🐑', 'lamb chop': '🥩', 'lamb shank': '🍖', 'leg of lamb': '🍖',
  turkey: '🦃', 'ground turkey': '🦃', 'turkey breast': '🦃', 'turkey bacon': '🥓',
  sausage: '🌭', 'pork sausage': '🌭', 'beef sausage': '🌭', 'chicken sausage': '🌭', 'italian sausage': '🇮🇹', 'chorizo': '🌶️', 'bratwurst': '🌭', 'salami': '🍖', 'pepperoni': '🍕',
  ham: '🍖', 'prosciutto': '🍖', 'serrano ham': '🍖',
  crab: '🦀', 'crab meat': '🦀', 'king crab': '🦀', 'snow crab': '🦀',
  lobster: '🦞',
  mussels: '🦪',
  oysters: '🦪',
  scallops: '🍥', // Fish cake for scallops
  clams: '🦪',
  duck: '🦆', 'duck breast': '🦆', 'duck confit': '🍗',
  quail: '🐦', 'quail eggs': '🥚',
  venison: '🦌', 'deer meat': '🦌',
  rabbit: '🐇',
  tempeh: '🟫', // Brown square
  seitan: '🌾', // Wheat gluten

  // Spices & Herbs (generic for many, specific for some)
  parsley: '🌿', 'fresh parsley': '🌿', 'dried parsley': '🌿', 'flat leaf parsley': '🌿', 'curly parsley': '🌿',
  basil: '🌿', 'fresh basil': '🌿', 'dried basil': '🌿', 'holy basil': '🌿', 'tulsi': '🌿', 'thai basil': '🌿',
  oregano: '🌿', 'dried oregano': '🌿', 'fresh oregano': '🌿',
  cilantro: '🌿', 'fresh cilantro': '🌿', 'coriander leaves': '🌿', 'dried cilantro': '🌿',
  coriander: '🌿', 'coriander powder': '🌿', 'coriander seeds': '🌿', 'ground coriander': '🌿',
  mint: '🌿', 'fresh mint': '🌿', 'spearmint': '🌿', 'peppermint': '🌿',
  rosemary: '🌿', 'fresh rosemary': '🌿', 'dried rosemary': '🌿',
  thyme: '🌿', 'fresh thyme': '🌿', 'dried thyme': '🌿', 'lemon thyme': '🍋',
  dill: '🌿', 'fresh dill': '🌿', 'dried dill': '🌿',
  sage: '🌿', 'fresh sage': '🌿', 'dried sage': '🌿',
  cumin: '🌿', 'cumin powder': '🌿', 'cumin seeds': '🌿', 'ground cumin': '🌿', 'jeera': '🌿',
  turmeric: '🟡', 'turmeric powder': '🟡', 'ground turmeric': '🟡', 'haldi': '🟡', 'fresh turmeric': '🫚', // Similar to ginger root
  ginger: '🫚', 'fresh ginger': '🫚', 'ground ginger': '🫚', 'ginger paste': '🫚', 'candied ginger': '🍬',
  'ginger-garlic paste': '🧄', // Prioritize garlic emoji
  cinnamon: '🌿', 'cinnamon stick': '🌿', 'cinnamon powder': '🌿', 'ground cinnamon': '🌿',
  nutmeg: '🌰', 'ground nutmeg': '🌰', // Using nut for nutmeg
  clove: '🌿', 'cloves': '🌿', 'ground cloves': '🌿',
  cardamom: '🌿', 'green cardamom': '🌿', 'black cardamom': '🌿', 'cardamom pods': '🌿', 'ground cardamom': '🌿', 'elaichi': '🌿',
  saffron: '🌼', 'kesar': '🌼', 'saffron threads': '🌼',
  paprika: '🌶️', 'smoked paprika': '🌶️', 'sweet paprika': '🌶️', 'hot paprika': '🌶️',
  'black pepper': '⚫', 'peppercorns': '⚫', 'ground black pepper': '⚫', 'kali mirch': '⚫', 'white peppercorns': '⚪',
  'white pepper': '⚪', 'ground white pepper': '⚪',
  'pink peppercorn': '🔴',
  'sichuan peppercorn': '🔴',
  bayleaf: '🌿', 'bay leaf': '🌿', 'bay leaves': '🌿', 'tej patta': '🌿',
  'star anise': '⭐',
  'curry leaves': '🌿', 'curry leaf': '🌿', 'kadi patta': '🌿',
  'garam masala': '🔥', // Fire for garam masala mix
  'curry powder': '🍛',
  'mustard seeds': '🟡', 'black mustard seeds': '⚫', 'yellow mustard seeds': '🟡', 'brown mustard seeds': '🟤', 'rai': '🟡',
  'fenugreek seeds': '🌿', 'methi seeds': '🌿',
  fenugreek: '🌿', 'fenugreek leaves': '🌿', 'dried fenugreek leaves': '🌿', 'kasuri methi': '🌿',
  'fennel seeds': '🌿', 'saunf': '🌿', 'ground fennel': '🌿',
  'asafoetida': '💨', 'hing': '💨', // Puff of smoke
  'ajwain': '🌿', 'carom seeds': '🌿',
  'poppy seeds': '🫘', 'khus khus': '🫘', 'white poppy seeds': '⚪', 'blue poppy seeds': '⚫',
  'sesame seeds': '🌰', 'white sesame seeds': '🌰', 'black sesame seeds': '⚫', 'til': '🌰',
  'nigella seeds': '⚫', 'kalonji': '⚫',
  'chives': '🌿', 'fresh chives': '🌿',
  'tarragon': '🌿',
  'marjoram': '🌿',
  'lemongrass': '🌿',
  lavender: '💜', 'culinary lavender': '💜',
  vanilla: '🍦', 'vanilla extract': '🍦', 'vanilla bean': '🌿', 'vanilla paste': '🍦', // Ice cream for vanilla
  'allspice': '🌰', // Proxy
  'anise seeds': '⭐', // Proxy with star anise
  'caraway seeds': '🌿', // Proxy
  'celery seeds': '🌿', // Proxy
  'dill seeds': '🌿', // Proxy
  'juniper berries': '🫐', // Proxy
  'mace': '🌰', // Proxy (outer shell of nutmeg)
  'sumac': '🔴', // Red circle for color

  // Nuts & Seeds (General)
  almond: '🌰', almonds: '🌰', 'sliced almonds': '🌰', 'slivered almonds': '🌰', 'ground almonds': '🌰', 'marzipan': '🍬',
  peanut: '🥜', peanuts: '🥜', 'roasted peanuts': '🥜',
  walnut: '🌰', walnuts: '🌰',
  cashew: '🌰', cashews: '🌰', 'cashew nuts': '🌰',
  pistachio: '🌰', pistachios: '🌰',
  hazelnut: '🌰', hazelnuts: '🌰',
  pecan: '🌰', pecans: '🌰',
  'sunflower seed': '🌻', 'sunflower seeds': '🌻',
  'chia seed': '🫘', 'chia seeds': '🫘', // Using bean for seeds
  'flax seed': '🫘', 'flax seeds': '🫘', 'ground flaxseed': '🫘', 'linseed': '🫘',
  'pumpkin seed': '🎃', 'pumpkin seeds': '🎃', 'pepitas': '🎃',
  'pine nut': '🌲', 'pine nuts': '🌲', // Pine tree for pine nuts
  'brazil nut': '🌰',
  'macadamia nut': '🌰',
  'tigernut': '🌰', // Proxy
  'hemp seeds': '🌿', // Proxy

  // Legumes
  'urad dal': '🫘', 'black gram': '🫘',
  lentil: '🫘', lentils: '🫘', 'red lentil': '🫘', 'green lentil': '🫘', 'brown lentil': '🫘', 'puy lentils': '🫘', 'masoor dal': '🫘', 'moong dal': '🫘', 'yellow moong dal': '🫘', 'toor dal': '🫘', 'arhar dal': '🫘', 'chana dal': '🫘', 'bengal gram': '🫘', 'split chickpeas': '🫘',
  'kidney bean': '🫘', 'kidney beans': '🫘', 'red kidney beans': '🫘', 'rajma': '🫘',
  'black bean': '🫘', 'black beans': '🫘',
  'black eyed peas': '🫘', 'lobia': '🫘',
  'soy bean': '🫘', 'soybean': '🫘', 'soybeans': '🫘',
  edamame: '🫛',
  'lima beans': '🫘', 'butter beans': '🫘',
  'pinto beans': '🫘',
  'navy beans': '🫘', 'haricot beans': '🫘',
  'cannellini beans': '🫘',
  'adzuki beans': '🫘',
  'mung beans': '🫘', 'green gram': '🫘',
  'broad beans': '🫛', 'fava beans': '🫛',

  // Other Food Items & Condiments
  water: '💧', 'sparkling water': '🥤', 'tonic water': '🥤',
  ice: '🧊', 'ice cubes': '🧊',
  chocolate: '🍫', 'dark chocolate': '🍫', 'milk chocolate': '🍫', 'semi-sweet chocolate': '🍫', 'bittersweet chocolate': '🍫', 'chocolate chips': '🍫', 'chocolate bar': '🍫', 'couverture chocolate': '🍫',
  'white chocolate': '⬜', // White square for white chocolate
  'cocoa powder': '🍫', 'unsweetened cocoa powder': '🍫', 'dutch process cocoa': '🍫', 'cacao powder': '🍫', 'cacao nibs': '🌰',
  coffee: '☕', 'coffee beans': '☕', 'ground coffee': '☕', 'instant coffee': '☕', 'espresso': '☕',
  tea: '🫖', 'tea leaves': '🫖', 'black tea': '☕', 'green tea': '🍵', 'herbal tea': '🌿', 'oolong tea': '🍵', 'white tea': '🍵', 'chai': '☕', 'matcha': '🍵', 'earl grey tea': '☕', 'chamomile tea': '🌼', 'hibiscus tea': '🌺', 'rooibos tea': '🔴',
  wine: '🍷', 'red wine': '🍷', 'white wine': '🥂', 'rose wine': '🥂', 'sparkling wine': '🥂', 'champagne': '🍾', 'prosecco': '🥂', 'port wine': '🍷', 'sherry': '🍷',
  beer: '🍺', 'lager': '🍺', 'ale': '🍺', 'stout': '🍺', 'ipa': '🍺',
  spirits: '🥃', vodka: '🍸', rum: '🥃', whiskey: '🥃', 'whisky': '🥃', 'scotch': '🥃', 'bourbon': '🥃', gin: '🍸', tequila: '🍹', brandy: '🥃', liqueur: '🍹', 'sake': '🍶', 'soju': '🍶', 'mezcal': '🌵',
  'soy sauce': '🍾', 'tamari': '🍾', 'shoyu': '🍾', 'light soy sauce': '🍾', 'dark soy sauce': '🍾', 'kecap manis': '🍾',
  mustard: '💛', 'dijon mustard': '💛', 'yellow mustard': '💛', 'mustard paste': '💛', 'wholegrain mustard': '💛', 'english mustard': '💛',
  ketchup: '🍅', 'tomato ketchup': '🍅',
  mayonnaise: '🥚', 'mayo': '🥚', 'vegan mayo': '🥑',
  jam: '🍓', 'strawberry jam': '🍓', 'raspberry jam': '🍓', 'apricot jam': '🍑', 'mixed fruit jam': '🍇', 'marmalade': '🍊',
  jelly: '🍇', 'grape jelly': '🍇',
  broth: '🥣', 'chicken broth': '🐔', 'vegetable broth': '🥕', 'beef broth': '🥩', 'bone broth': '🦴', 'fish broth': '🐟',
  stock: '🥣', 'chicken stock': '🐔', 'vegetable stock': '🥕', 'beef stock': '🥩', 'fish stock': '🐟', 'bouillon cube': '🧱', 'stock powder': '🧂',
  gelatin: '🍮', 'agar agar': '🌿', // Custard/pudding for gelatin
  jaggery: '🟤', 'gur': '🟤', // Brown circle for jaggery
  breadcrumbs: '🍞', 'panko breadcrumbs': '🍞', 'dried breadcrumbs': '🍞', 'fresh breadcrumbs': '🍞',
  pickle: '🥒', pickles: '🥒', 'dill pickle': '🥒', 'gherkin': '🥒', 'cornichon': '🥒',
  olives: '🫒', 'black olives': '⚫', 'green olives': '🟢', 'kalamata olives': '🫒',
  'pizza sauce': '🍕', // More specific sauce for pizza
  'pasta sauce': '🍝', 'marinara sauce': '🍅', 'arrabiata sauce': '🌶️', 'pesto sauce': '🌿', 'alfredo sauce': '🥛', 'bolognese sauce': '🥩', // More specific sauce for pasta
  tahini: '🌰', // Sesame paste
  'peanut butter': '🥜',
  'almond butter': '🌰', 'cashew butter': '🌰',
  'hot sauce': '🌶️', 'sriracha': '🌶️', 'tabasco': '🌶️', 'chili garlic sauce': '🌶️', 'gochujang': '🌶️', 'harissa': '🌶️',
  'worcestershire sauce': '🍾',
  'fish sauce': '🐟', 'nam pla': '🐟',
  'oyster sauce': '🦪',
  'hoisin sauce': '🍾',
  'teriyaki sauce': '🍾',
  'bbq sauce': '🔥', 'barbecue sauce': '🔥',
  capers: '🟢', // Small green circle
  seaweed: '🌿', 'nori': '🌿', 'kombu': '🌿', 'wakame': '🌿', 'dulse': '🌿',
  'miso paste': '🥣', 'red miso': '🔴', 'white miso': '⚪',
  'mirin': '🍶', // Japanese cooking wine
  'rice wine': '🍶', 'shaoxing wine': '🍶',
  'rose water': '🌹',
  'orange blossom water': '🍊',
  'food coloring': '🎨', 'red food coloring': '🔴', 'gel food coloring': '🎨',
  'sprinkles': '🎉', 'jimmies': '🎉',
  'marshmallows': '☁️',
  'popcorn kernels': '🍿',

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
  icecream: '🍨', 'ice cream': '🍨', 'sorbet': '🍧', 'gelato': '🍨',
  smoothie: '🥤',
  juice: '🧃', 'orange juice': '🍊', 'apple juice': '🍎',
  sauce: '🥫', // Generic sauce
  dressing: '🥗', 'salad dressing': '🥗', 'vinaigrette': '🍾',
  gravy: '🥣',
  stew: '🥘',
  casserole: '🥘',
  wrap: '🌯',
  roll: '🌯', // Spring roll, kathi roll etc.
  biryani: '🍚', // Rice for biryani
  korma: '🍛',
  tikka: '🍢', // Skewer for tikka
  kebab: '🍢',
  'french fries': '🍟', 'fries': '🍟',
  chips: '🥔', // Potato for chips (crisps in UK)
  crisps: '🥔', // For UK style potato chips
  popcorn: '🍿',
  salsa: '💃', // Dancing emoji for salsa dip, or 🍅 if preferred
  guacamole: '🥑',
  hummus: '🥣',
  dip: '🥣',
  spread: '🧈', // Butter as generic spread
  filling: '🥧', // Pie for filling
  topping: '🍒', // Cherry for topping
  garnish: '🌿', // Herb for garnish
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

