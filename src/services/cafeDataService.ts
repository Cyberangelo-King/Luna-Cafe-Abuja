import { MenuItem, CommunityEvent, Reservation, Order } from '../types';
import { MENU_ITEMS, COMMUNITY_EVENTS } from '../data';

const STORAGE_KEYS = {
  MENU_ITEMS: 'luna_cafe_menu_items',
  COMMUNITY_EVENTS: 'luna_cafe_community_events',
  RESERVATIONS: 'luna_cafe_reservations',
  ORDERS: 'luna_cafe_orders',
};

// Seed initial data if not exists
export function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
    const items = MENU_ITEMS.map(item => ({ ...item, isAvailable: true }));
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
  }

  if (!localStorage.getItem(STORAGE_KEYS.COMMUNITY_EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_EVENTS, JSON.stringify(COMMUNITY_EVENTS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
    // Some mock past/future reservations so the owner dashboard looks alive
    const mockReservations: Reservation[] = [
      {
        id: 'res-1',
        guestName: 'Chinedu Okafor',
        guestEmail: 'chinedu@example.com',
        guestPhone: '+234 803 123 4567',
        date: '2026-07-15',
        monthStr: 'Jul',
        year: '2026',
        time: '11:00 AM',
        guests: 4,
        specialRequests: 'Courtyard seating requested, birthday celebration.',
        reference: 'LUNA-7741',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'res-2',
        guestName: 'Fatima Yar’Adua',
        guestEmail: 'fatima@example.com',
        guestPhone: '+234 812 987 6543',
        date: '2026-07-16',
        monthStr: 'Jul',
        year: '2026',
        time: '12:30 PM',
        guests: 2,
        specialRequests: 'Allergies: gluten free modifications.',
        reference: 'LUNA-2391',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      }
    ];
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(mockReservations));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const mockOrders: Order[] = [
      {
        id: 'ord-1',
        code: 'A390',
        items: [
          {
            id: 'item-1',
            name: 'The Luna Cortado',
            basePrice: 4500,
            quantity: 2,
            modifiers: [{ name: 'Oat Milk Alternative', price: 2000 }],
            unitTotal: 6500,
            total: 13000
          }
        ],
        subtotal: 13000,
        tip: 2000,
        total: 16500,
        diningType: 'dinein',
        name: 'Amina Bello',
        phone: '08099887766',
        status: 'completed',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
  }
}

// Menu Items Helpers
export function getStoredMenuItems(): MenuItem[] {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredMenuItems(items: MenuItem[]) {
  localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
  window.dispatchEvent(new Event('luna_menu_updated'));
}

// Community Events Helpers
export function getStoredEvents(): CommunityEvent[] {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.COMMUNITY_EVENTS);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredEvents(events: CommunityEvent[]) {
  localStorage.setItem(STORAGE_KEYS.COMMUNITY_EVENTS, JSON.stringify(events));
  window.dispatchEvent(new Event('luna_events_updated'));
}

// Reservations Helpers
export function getStoredReservations(): Reservation[] {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredReservations(reservations: Reservation[]) {
  localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  window.dispatchEvent(new Event('luna_reservations_updated'));
}

// Orders Helpers
export function getStoredOrders(): Order[] {
  initializeStorage();
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return raw ? JSON.parse(raw) : [];
}

export function saveStoredOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  window.dispatchEvent(new Event('luna_orders_updated'));
}
