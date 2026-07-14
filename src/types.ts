export type MenuCategory = 'burgers' | 'pizza' | 'corndogs' | 'fries_wings' | 'boba_drinks';

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  type: 'checkbox' | 'radio';
  group?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: MenuCategory;
  modifierCategory: 'burger' | 'pizza' | 'corndog' | 'wings' | 'boba';
  isAvailable?: boolean; // Owner can toggle availability
}

export interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  modifiers: Array<{ name: string; price: number }>;
  unitTotal: number;
  total: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  category: 'Art & Wine' | 'Community' | 'Music';
  description: string;
  price: number | 'Free';
  date: number;
  month: string;
  day: string;
  time: string;
  imageUrl: string;
  isFeatured?: boolean;
}

export interface Reservation {
  id: string;
  date: string;
  monthStr: string;
  year: string;
  time: string;
  guests: number;
  specialRequests?: string;
  reference: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  status: 'pending' | 'confirmed' | 'seated' | 'cancelled';
  createdAt: string;
}

export interface Order {
  id: string;
  code: string;
  items: CartItem[];
  subtotal: number;
  tip: number;
  total: number;
  diningType: 'pickup' | 'dinein';
  name: string;
  phone: string;
  email?: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
}
