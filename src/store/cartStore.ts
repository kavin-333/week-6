import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface CartStore {
  // Products
  products: Product[];
  
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Cart
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Gaming Laptop Pro X1",
    price: 1299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1640955014216-75201056c829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3B8ZW58MXx8fHwxNzYwNzg3NDUyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "High-performance gaming laptop with RGB keyboard"
  },
  {
    id: 2,
    name: "Wireless Gaming Mouse",
    price: 79.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1628832307345-7404b47f1751?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZXxlbnwxfHx8fDE3NjA4Mzk2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Ergonomic wireless mouse with customizable RGB"
  },
  {
    id: 3,
    name: "Mechanical Keyboard RGB",
    price: 149.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1602025882379-e01cf08baa51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmR8ZW58MXx8fHwxNzYwODU1MTE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Premium mechanical keyboard with RGB backlighting"
  },
  {
    id: 4,
    name: "4K Gaming Monitor",
    price: 599.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb25pdG9yfGVufDF8fHx8MTc2MDg1NTExNXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "27-inch 4K HDR gaming monitor 144Hz"
  },
  {
    id: 5,
    name: "Premium Headphones",
    price: 249.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1646500366920-b4c5ce29237d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwc3R1ZGlvfGVufDF8fHx8MTc2MDc4MzU4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Noise-cancelling wireless headphones"
  },
  {
    id: 6,
    name: "Smart Watch Ultra",
    price: 399.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNofGVufDF8fHx8MTc2MDg0Njc3NXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Fitness tracking smartwatch with AMOLED display"
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    price: 129.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVldG9vdGglMjBzcGVha2VyfGVufDF8fHx8MTc2MDg1MTIwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Portable waterproof speaker with LED lights"
  },
  {
    id: 8,
    name: "USB-C Hub Pro",
    price: 89.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1616578273461-3a99ce422de6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2IlMjBodWJ8ZW58MXx8fHwxNzYwODU1MTE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Multi-port USB-C hub for laptops"
  },
  {
    id: 9,
    name: "Webcam HD 1080p",
    price: 119.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1623949556303-b0d17d198863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWJjYW18ZW58MXx8fHwxNzYwNzkwMzc3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Professional webcam for streaming"
  },
  {
    id: 10,
    name: "Gaming Chair Elite",
    price: 349.99,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1619725002198-6a689b72f41d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjaGFpcnxlbnwxfHx8fDE3NjA3Nzc1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Ergonomic gaming chair with lumbar support"
  },
  {
    id: 11,
    name: "Standing Desk",
    price: 499.99,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1622131278701-eb225474ffd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGluZyUyMGRlc2t8ZW58MXx8fHwxNzYwODU1MTE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Electric height-adjustable standing desk"
  },
  {
    id: 12,
    name: "LED Desk Lamp",
    price: 59.99,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1621447980929-6638614633c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNrJTIwbGFtcHxlbnwxfHx8fDE3NjA3OTk0MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Smart LED desk lamp with wireless charging"
  },
  {
    id: 13,
    name: "Graphics Tablet",
    price: 279.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1572532350840-f682a3cf9dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljcyUyMHRhYmxldHxlbnwxfHx8fDE3NjA4NTUxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Professional drawing tablet with pen"
  },
  {
    id: 14,
    name: "External SSD 1TB",
    price: 159.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1577538926210-fc6cc624fde2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxleHRlcm5hbCUyMHNzZHxlbnwxfHx8fDE3NjA4NTUxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "High-speed portable SSD drive"
  },
  {
    id: 15,
    name: "Wireless Earbuds",
    price: 179.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzYwODE2MTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Active noise cancellation earbuds"
  },
  {
    id: 16,
    name: "Phone Stand Holder",
    price: 29.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553556135-009e5858adce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMHN0YW5kfGVufDF8fHx8MTc2MDg1NTEyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Adjustable aluminum phone stand"
  },
  {
    id: 17,
    name: "Cable Management Kit",
    price: 24.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1760348213270-7cd00b8c3405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJsZSUyMG9yZ2FuaXplcnxlbnwxfHx8fDE3NjA4NTUxMjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Complete cable management solution"
  },
  {
    id: 18,
    name: "Monitor Arm Mount",
    price: 139.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1646771032500-27b440b2d947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25pdG9yJTIwYXJtfGVufDF8fHx8MTc2MDg1NTEyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Dual monitor arm mount system"
  },
  {
    id: 19,
    name: "RGB Light Strips",
    price: 39.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1541519920349-237d9c325cac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWQlMjBsaWdodHN8ZW58MXx8fHwxNzYwODU1MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Smart RGB LED strip lights 16ft"
  },
  {
    id: 20,
    name: "Laptop Cooling Pad",
    price: 49.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1628296499994-70face79ab36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb29sZXJ8ZW58MXx8fHwxNzYwODU1MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "RGB laptop cooling pad with fans"
  },
  {
    id: 21,
    name: "Microphone Studio Pro",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608024472541-676ad5cd69e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBtaWNyb3Bob25lfGVufDF8fHx8MTc2MDg1NTEyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "USB condenser microphone for streaming"
  },
  {
    id: 22,
    name: "Ring Light 18 inch",
    price: 89.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1478826160983-e6db8c7d537a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaW5nJTIwbGlnaHR8ZW58MXx8fHwxNzYwODU1MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Dimmable LED ring light with stand"
  },
  {
    id: 23,
    name: "VR Headset",
    price: 449.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ciUyMGhlYWRzZXR8ZW58MXx8fHwxNzYwNzY1ODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Virtual reality headset with controllers"
  },
  {
    id: 24,
    name: "Portable Charger 20000mAh",
    price: 69.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1585995603413-eb35b5f4a50b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmt8ZW58MXx8fHwxNzYwNzY4NzA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Fast charging portable battery pack"
  },
  {
    id: 25,
    name: "Smartphone Pro Max",
    price: 999.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1592890288564-76628a30a657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lfGVufDF8fHx8MTc2MDc2ODcwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Latest flagship smartphone with 5G"
  },
  {
    id: 26,
    name: "Tablet Pro 12.9",
    price: 799.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1672239069328-dd1535c0d78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2V8ZW58MXx8fHwxNzYwNzUxNTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Professional tablet with stylus support"
  },
  {
    id: 27,
    name: "Fitness Tracker Band",
    price: 99.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwdHJhY2tlcnxlbnwxfHx8fDE3NjA4NTUxMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Health monitoring fitness band"
  },
  {
    id: 28,
    name: "Action Camera 4K",
    price: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1677172954692-90cf8bdc91e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBjYW1lcmF8ZW58MXx8fHwxNzYwODU1MTI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Waterproof 4K action camera"
  }
];

export const useCartStore = create<CartStore>((set, get) => ({
  products: initialProducts,
  isAuthenticated: false,
  user: null,
  items: [],
  
  login: async (email, password) => {
    // Mock authentication - in production, this would call a real API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple validation for demo
    if (email && password.length >= 6) {
      set({
        isAuthenticated: true,
        user: {
          id: '1',
          email: email,
          name: email.split('@')[0]
        }
      });
      return true;
    }
    return false;
  },
  
  signup: async (name, email, password) => {
    // Mock signup - in production, this would call a real API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple validation for demo
    if (name && email && password.length >= 6) {
      set({
        isAuthenticated: true,
        user: {
          id: '1',
          email: email,
          name: name
        }
      });
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      items: []
    });
  },
  
  addItem: (product) => {
    const items = get().items;
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      set({
        items: items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
  },
  
  removeItem: (productId) => {
    set({ items: get().items.filter(item => item.id !== productId) });
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
    } else {
      set({
        items: get().items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      });
    }
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  }
}));
