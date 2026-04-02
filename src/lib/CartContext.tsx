import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';
import type { Product } from './api';

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedWaistSize?: string;
  selectedScale?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: { size?: string; waistSize?: string; scale?: string }) => void;
  removeFromCart: (productId: string, variantKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantKey?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Load cart from localStorage on mount
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('f1-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('f1-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1, variant?: { size?: string; waistSize?: string; scale?: string }) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === variant?.size && item.selectedWaistSize === variant?.waistSize && item.selectedScale === variant?.scale);
      if (existing) {
        // Update quantity if product already in cart
        toast.success(`Added ${quantity} more ${product.name} to cart`, {
          description: `Now ${existing.quantity + quantity} in cart`
        });
        return prev.map(item =>
          item.id === product.id && item.selectedSize === variant?.size && item.selectedWaistSize === variant?.waistSize && item.selectedScale === variant?.scale
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Add new product to cart
      toast.success(`Added ${product.name} to cart`, {
        description: `${quantity} item${quantity > 1 ? 's' : ''} added`
      });
      return [...prev, { ...product, quantity, selectedSize: variant?.size, selectedWaistSize: variant?.waistSize, selectedScale: variant?.scale }];
    });
  };

  const removeFromCart = (productId: string, variantKey?: string) => {
    const item = items.find(i => i.id === productId && (variantKey ? i.selectedSize === variantKey || i.selectedWaistSize === variantKey || i.selectedScale === variantKey : true));
    if (item) {
      toast.info(`Removed ${item.name} from cart`);
    }
    setItems(prev => prev.filter(item => item.id !== productId || (variantKey ? item.selectedSize !== variantKey && item.selectedWaistSize !== variantKey && item.selectedScale !== variantKey : false)));
  };

  const updateQuantity = (productId: string, quantity: number, variantKey?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantKey);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId && (variantKey ? item.selectedSize === variantKey || item.selectedWaistSize === variantKey || item.selectedScale === variantKey : true)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    toast.success('Cart cleared');
    setItems([]);
    localStorage.removeItem('f1-cart');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
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