import { MenuItem, ModifierOption, CommunityEvent } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // Gourmet Burgers
  {
    id: 'b1',
    name: "Lola's Double Smash Burger",
    description: "Two smashed premium beef patties, melted cheddar cheese, caramelized onions, and Lola's secret house burger sauce on a toasted brioche bun.",
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    modifierCategory: 'burger'
  },
  {
    id: 'b2',
    name: "Fiery Crispy Chicken Burger",
    description: "Buttermilk fried chicken breast tossed in a hot chili glaze, topped with pickled jalapeños, cooling herb ranch, and shredded lettuce on a toasted sesame bun.",
    price: 6800,
    imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
    category: 'burgers',
    modifierCategory: 'burger'
  },

  // Supreme Pizza
  {
    id: 'pz1',
    name: "Lola's Supreme Pizza",
    description: "Our signature high-hydration crust topped with loaded mozzarella, premium pepperoni, seasoned minced beef, bell peppers, sweet red onions, and olives.",
    price: 11500,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    category: 'pizza',
    modifierCategory: 'pizza'
  },
  {
    id: 'pz2',
    name: "Creamy Chicken & Mushroom Pizza",
    description: "Garlic Alfredo base sauce, tender grilled chicken breast slices, wild button mushrooms, stretchy mozzarella, finished with fresh garden oregano.",
    price: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
    category: 'pizza',
    modifierCategory: 'pizza'
  },

  // Corndogs
  {
    id: 'cd1',
    name: "Half & Half Mozzarella Corndog",
    description: "Half premium beef frankfurter, half gooey block mozzarella, hand-dipped in our sweet golden yeast batter and fried to crunchy, stretchy perfection.",
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=600&q=80',
    category: 'corndogs',
    modifierCategory: 'corndog'
  },
  {
    id: 'cd2',
    name: "Potato Crust Cheese Corndog",
    description: "Gooey mozzarella and beef frankfurter wrapped in batter studded with crunchy diced potato cubes, fried golden and finished with sweet mayonnaise.",
    price: 4000,
    imageUrl: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=600&q=80',
    category: 'corndogs',
    modifierCategory: 'corndog'
  },

  // Fries & Wings
  {
    id: 'fw1',
    name: "Sticky BBQ Wings & Hand-Cut Fries",
    description: "6 jumbo crisp-fried wings tossed in our sweet, smoky house BBQ reduction, served alongside rustic hand-cut, sea salt-dusted potato fries.",
    price: 6200,
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
    category: 'fries_wings',
    modifierCategory: 'wings'
  },
  {
    id: 'fw2',
    name: "Buffalo Hot Wings & Sweet Potato Fries",
    description: "6 jumbo wings tossed in fiery, authentic cayenne pepper glaze, served with fresh cooling blue cheese dip and crispy sweet potato wedges.",
    price: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=80',
    category: 'fries_wings',
    modifierCategory: 'wings'
  },

  // Boba Tea/Drinks
  {
    id: 'bb1',
    name: "Classic Brown Sugar Milk Boba",
    description: "Caramelized brown sugar syrup tiger-striped around fresh chilled whole milk, rich premium Assam black tea, and slow-cooked warm, chewy tapioca boba pearls.",
    price: 4800,
    imageUrl: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80',
    category: 'boba_drinks',
    modifierCategory: 'boba'
  },
  {
    id: 'bb2',
    name: "Strawberry Matcha Boba Float",
    description: "A gorgeous layered drink with ceremonial grade Japanese matcha whisked over oat milk, sweet house-made wild strawberry puree, and chewy boba.",
    price: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    category: 'boba_drinks',
    modifierCategory: 'boba'
  },
  {
    id: 'bb3',
    name: "Lola's Sunset Citrus Refresher",
    description: "Zesty blood orange, freshly squeezed lime juice, wild garden mint leaves, and cold-brewed Nigerian zobo (hibiscus) served over crushed ice.",
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80',
    category: 'boba_drinks',
    modifierCategory: 'boba'
  }
];

export const MODIFIER_DATA: Record<string, ModifierOption[]> = {
  burger: [
    { id: 'm1', name: 'Extra Cheddar Cheese Slice', price: 1500, type: 'checkbox' },
    { id: 'm2', name: 'Add Smoked Turkey Bacon', price: 2000, type: 'checkbox' },
    { id: 'm3', name: 'Add Double Beef Patty', price: 3500, type: 'checkbox' }
  ],
  pizza: [
    { id: 'm4', name: 'Extra Mozzarella Cheese', price: 2000, type: 'checkbox' },
    { id: 'm5', name: 'Add Extra Pepperoni Slices', price: 1800, type: 'checkbox' },
    { id: 'm6', name: 'Stuffed Crust (Cheese Filled)', price: 2500, type: 'checkbox' }
  ],
  corndog: [
    { id: 'm7', name: 'Light Sugar Dust Coating', price: 300, type: 'checkbox' },
    { id: 'm8', name: 'Drizzle Sweet Condensed Milk', price: 500, type: 'checkbox' },
    { id: 'm9', name: 'Drizzle House Spicy Mayo', price: 400, type: 'checkbox' }
  ],
  wings: [
    { id: 'm10', name: 'Toss in Extra BBQ Sauce', price: 800, type: 'checkbox' },
    { id: 'm11', name: 'Upgrade to Cheesy Fries', price: 1800, type: 'checkbox' },
    { id: 'm12', name: 'Add Extra Ranch Dipping Sauce', price: 600, type: 'checkbox' }
  ],
  boba: [
    { id: 'm13', name: 'Extra Portion Tapioca Boba', price: 1000, type: 'checkbox' },
    { id: 'm14', name: 'Add Honey Popping Boba', price: 1200, type: 'checkbox' },
    { id: 'm15', name: 'Sub Oat Milk (Dairy-Free)', price: 1500, type: 'radio', group: 'milk' }
  ]
};

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'e1',
    title: 'Lola\'s Terracotta Paint & Sip',
    category: 'Art & Wine',
    description: 'Guided clay planter and canvas painting session with earthy tones, paired with a selection of premium mocktails, wines, and hot corndogs.',
    price: 15000,
    date: 24,
    month: 'Oct',
    day: 'Thursday',
    time: '6:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    isFeatured: true
  },
  {
    id: 'e2',
    title: 'Abraka Courtyard Book Club',
    category: 'Community',
    description: 'An evening of contemporary literature reviews with young creatives. Savor fresh boba tea and burgers while discussing "The Girl with the Louding Voice".',
    price: 'Free',
    date: 2,
    month: 'Nov',
    day: 'Saturday',
    time: '10:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'e3',
    title: 'Acoustic Soul & Boba Karaoke',
    category: 'Music',
    description: 'Live soft acoustic sets from Delta State young vocalists followed by a cozy open-mic session. A yellow-lit, slow-living communal atmosphere to recharge.',
    price: 5000,
    date: 15,
    month: 'Nov',
    day: 'Friday',
    time: '8:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
  }
];

export const GALLERY_MOMENTS = [
  {
    id: 'gm1',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    alt: 'Juicy double smash burgers stacked high',
    likes: '1.4k',
    comments: '128',
    platform: 'instagram'
  },
  {
    id: 'gm2',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    alt: 'Vibrant layered matcha and strawberry boba float',
    likes: '2.1k',
    comments: '345',
    platform: 'tiktok'
  },
  {
    id: 'gm3',
    imageUrl: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=600&q=80',
    alt: 'Golden, stretchy mozzarella corndog with sugar dust',
    likes: '982',
    comments: '76',
    platform: 'instagram'
  },
  {
    id: 'gm4',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    alt: 'Freshly baked supreme pizza with a cheesy pull',
    likes: '1.8k',
    comments: '201',
    platform: 'instagram'
  },
  {
    id: 'gm5',
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80',
    alt: 'Crispy fried chicken wings tossed in BBQ sauce next to hand-cut fries',
    likes: '3.4k',
    comments: '582',
    platform: 'tiktok'
  },
  {
    id: 'gm6',
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80',
    alt: 'Glistening blood orange and lime botanical refreshers on a sunny terrace',
    likes: '1.1k',
    comments: '94',
    platform: 'instagram'
  }
];
