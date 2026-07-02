'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

const LS_KEY = 'visthar_cart_v1';

export function CartProvider({ children }) {
  const { user } = useAuth() || {};
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { setItems(JSON.parse(localStorage.getItem(LS_KEY) || '[]')); } catch {}
    setHydrated(true);
  }, []);

  // sync from server when user logs in
  useEffect(() => {
    if (!user) return;
    (async () => {
      const r = await fetch('/api/cart', { credentials: 'include' });
      const d = await r.json();
      const local = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      const merged = [...(d.items || [])];
      local.forEach(li => {
        const existing = merged.find(m => m.slug === li.slug);
        if (existing) existing.qty = Math.max(existing.qty, li.qty);
        else merged.push(li);
      });
      setItems(merged);
      if (merged.length) saveServer(merged);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const saveServer = async (next) => {
    if (!user) return;
    await fetch('/api/cart', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: next }) });
  };
  const persist = (next) => {
    setItems(next);
    if (typeof window !== 'undefined') localStorage.setItem(LS_KEY, JSON.stringify(next));
    saveServer(next);
  };
  const add = useCallback((product, qty = 1) => {
    const next = [...items];
    const ex = next.find(i => i.slug === product.slug);
    if (ex) ex.qty += qty;
    else next.push({ slug: product.slug, name: product.name, price: product.price, image: product.image, qty });
    persist(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, user]);
  const update = (slug, qty) => { const next = items.map(i => i.slug === slug ? { ...i, qty } : i).filter(i => i.qty > 0); persist(next); };
  const remove = (slug) => persist(items.filter(i => i.slug !== slug));
  const clear = () => persist([]);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return <CartCtx.Provider value={{ items, count, total, add, update, remove, clear, hydrated }}>{children}</CartCtx.Provider>;
}
