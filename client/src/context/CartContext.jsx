import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return setCart({ items: [] });
    try {
      const res = await api.get('/cart');
      setCart(res.data || { items: [] });
    } catch {}
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, qty = 1) => {
    setLoading(true);
    try {
      const res = await api.post('/cart', { productId, qty });
      setCart(res.data);
      return true;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (itemId, qty) => {
    try {
      const res = await api.put(`/cart/${itemId}`, { qty });
      setCart(res.data);
    } catch {}
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      setCart(res.data);
    } catch {}
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart({ items: [] });
    } catch {}
  };

  const totalItems = cart.items?.reduce((acc, i) => acc + i.qty, 0) || 0;
  const totalPrice = cart.items?.reduce((acc, i) => acc + i.price * i.qty, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem, clearCart, totalItems, totalPrice, loading, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
