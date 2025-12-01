import { createSignal } from 'solid-js';

export type CartItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerLiter: number;
  liters: number;
  image: string;
  quantity: number;
};

const [cartItems, setCartItems] = createSignal<CartItem[]>([]);
const [isCartOpen, setIsCartOpen] = createSignal(false);

// Load from localStorage on init
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('chopp-cart');
  if (stored) {
    try {
      setCartItems(JSON.parse(stored));
    } catch (e) {
      console.error('Error loading cart:', e);
    }
  }
}

export const cartStore = {
  items: cartItems,
  isOpen: isCartOpen,
  
  addItem: (item: Omit<CartItem, 'quantity'>) => {
    const current = cartItems();
    const existing = current.find(i => i.id === item.id && i.liters === item.liters);
    
    if (existing) {
      setCartItems(current.map(i => 
        i.id === item.id && i.liters === item.liters
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCartItems([...current, { ...item, quantity: 1 }]);
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('chopp-cart', JSON.stringify(cartItems()));
    }
  },
  
  removeItem: (id: string, liters: number) => {
    setCartItems(cartItems().filter(i => !(i.id === id && i.liters === liters)));
    if (typeof window !== 'undefined') {
      localStorage.setItem('chopp-cart', JSON.stringify(cartItems()));
    }
  },
  
  updateQuantity: (id: string, liters: number, quantity: number) => {
    if (quantity <= 0) {
      cartStore.removeItem(id, liters);
      return;
    }
    
    setCartItems(cartItems().map(i => 
      i.id === id && i.liters === liters
        ? { ...i, quantity }
        : i
    ));
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('chopp-cart', JSON.stringify(cartItems()));
    }
  },
  
  clear: () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chopp-cart');
    }
  },
  
  getTotal: () => {
    return cartItems().reduce((sum, item) => 
      sum + (item.pricePerLiter * item.liters * item.quantity), 0
    );
  },
  
  getTotalItems: () => {
    return cartItems().reduce((sum, item) => sum + item.quantity, 0);
  },
  
  toggleCart: () => setIsCartOpen(!isCartOpen()),
  openCart: () => setIsCartOpen(true),
  closeCart: () => setIsCartOpen(false)
};
