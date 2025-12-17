// lib/cart-context.tsx - Shopping cart state management
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '@/types';

interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (variant_id: string) => void;
  updateQuantity: (variant_id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (variant_id: string) => boolean;
  getItemQuantity: (variant_id: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'geeks_creation_cart';
const TAX_RATE = 0.075; // 7.5% VAT (Nigeria)
const FREE_SHIPPING_THRESHOLD = 50000; // ₦50,000
const SHIPPING_COST = 2500; // ₦2,500

function calculateCart(items: CartItem[]): Cart {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;
  const item_count = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, subtotal, tax, shipping, total, item_count };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(() => {
    if (typeof window === 'undefined') {
      return {
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        item_count: 0,
      };
    }

    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const items: CartItem[] = JSON.parse(savedCart);
        return calculateCart(items);
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }

    return {
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      item_count: 0,
    };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.items.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart.items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex(i => i.variant_id === item.variant_id);
      let newItems: CartItem[];

      if (existingIndex >= 0) {
        // Update existing item
        newItems = [...prev.items];
        const newQuantity = Math.min(
          newItems[existingIndex].quantity + quantity,
          newItems[existingIndex].max_quantity
        );
        newItems[existingIndex] = { ...newItems[existingIndex], quantity: newQuantity };
      } else {
        // Add new item
        newItems = [...prev.items, { ...item, quantity }];
      }

      return calculateCart(newItems);
    });
  };

  const removeFromCart = (variant_id: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter(item => item.variant_id !== variant_id);
      return calculateCart(newItems);
    });
  };

  const updateQuantity = (variant_id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variant_id);
      return;
    }

    setCart((prev) => {
      const newItems = prev.items.map(item => {
        if (item.variant_id === variant_id) {
          return {
            ...item,
            quantity: Math.min(quantity, item.max_quantity)
          };
        }
        return item;
      });
      return calculateCart(newItems);
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      item_count: 0,
    });
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const isInCart = (variant_id: string): boolean => {
    return cart.items.some(item => item.variant_id === variant_id);
  };

  const getItemQuantity = (variant_id: string): number => {
    const item = cart.items.find(i => i.variant_id === variant_id);
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}