import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Cart, CartItem, Product } from '../types';

// Acciones del reducer
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart };

// Estado inicial del carrito
const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// Counter para generar IDs únicos sin usar Date.now() (evita problemas de SSR)
let cartItemIdCounter = 1;

// Función para obtener timestamp consistente
function getTimestamp(): string {
  if (typeof window !== 'undefined') {
    return new Date().toISOString();
  }
  // En el servidor, usar una fecha fija para evitar problemas de hidratación
  return '2024-01-01T00:00:00.000Z';
}

// Funciones auxiliares
function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  return { totalItems, totalPrice };
}

function createCartItem(product: Product, quantity: number): CartItem {
  const price = product.price;
  const totalPrice = price * quantity;
  
  return {
    id: `${product.id}-${cartItemIdCounter++}`,
    productId: product.id,
    product,
    quantity,
    price,
    totalPrice,
  };
}

// Reducer
function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === product.id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // El producto ya existe, actualizar cantidad
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * item.price,
              }
            : item
        );
      } else {
        // Producto nuevo, agregarlo al carrito
        const newItem = createCartItem(product, quantity);
        newItems = [...state.items, newItem];
      }

      const { totalItems, totalPrice } = calculateTotals(newItems);
      
      return {
        items: newItems,
        totalItems,
        totalPrice,
        updatedAt: getTimestamp(),
      };
    }

    case 'REMOVE_ITEM': {
      const productId = action.payload;
      const newItems = state.items.filter(item => item.productId !== productId);
      const { totalItems, totalPrice } = calculateTotals(newItems);
      
      return {
        items: newItems,
        totalItems,
        totalPrice,
        updatedAt: getTimestamp(),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si la cantidad es 0 o negativa, remover el item
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: productId });
      }

      const newItems = state.items.map(item =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              totalPrice: quantity * item.price,
            }
          : item
      );

      const { totalItems, totalPrice } = calculateTotals(newItems);
      
      return {
        items: newItems,
        totalItems,
        totalPrice,
        updatedAt: getTimestamp(),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...initialCart,
        updatedAt: getTimestamp(),
      };
    }

    case 'LOAD_CART': {
      return action.payload;
    }

    default:
      return state;
  }
}

// Contexto
interface CartContextType {
  cart: Cart;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}

// Provider
interface CartProviderProps {
  children: ReactNode;
}

// Clave para localStorage
const CART_STORAGE_KEY = 'ecommerce_cart';

export function CartProvider({ children }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart: Cart = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        }
      } catch (error) {
        console.warn('Error al cargar carrito desde localStorage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== 'undefined' && cart.items.length >= 0) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.warn('Error al guardar carrito en localStorage:', error);
      }
    }
  }, [cart]);

  const addItem = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => cart.totalItems;

  const getTotalPrice = () => cart.totalPrice;

  const isInCart = (productId: string) => {
    return cart.items.some(item => item.productId === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = cart.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cart,
    items: cart.items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export { type CartContextType };
