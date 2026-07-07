'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/auth/me', { credentials: 'include' });
      try {
        const d = await r.json();
        setUser(d.user || null);
      } catch (err) {
        console.error('Failed to parse /api/auth/me response', { status: r.status, headers: Object.fromEntries(r.headers), err });
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = async (email, password) => {
    const r = await fetch('/api/auth/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    let d;
    try {
      d = await r.json();
    } catch (err) {
      const text = await r.text().catch(() => '<unreadable body>');
      console.error('Non-JSON response from /api/auth/login', { status: r.status, body: text });
      throw new Error(`Login failed: unexpected response (${r.status})`);
    }
    if (!r.ok) throw new Error(d.error || 'Login failed');
    setUser(d.user);
    return d.user;
  };
  const signup = async (email, password, name) => {
    const r = await fetch('/api/auth/register', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
    let d;
    try {
      d = await r.json();
    } catch (err) {
      const text = await r.text().catch(() => '<unreadable body>');
      console.error('Non-JSON response from /api/auth/register', { status: r.status, body: text });
      throw new Error(`Signup failed: unexpected response (${r.status})`);
    }
    if (!r.ok) throw new Error(d.error || 'Signup failed');
    setUser(d.user);
    return d.user;
  };
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return <AuthCtx.Provider value={{ user, loading, login, signup, logout, refresh }}>{children}</AuthCtx.Provider>;
}
