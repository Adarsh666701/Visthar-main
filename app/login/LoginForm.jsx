'use client';
import { useAuth } from '@/components/visthar/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get('next') || '/';
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back.');
      router.push(next);
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FF85]/10 blur-[160px] rounded-full" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/visthar-logo.png" className="w-16 h-16 mx-auto mb-4" alt="VISTHAR" />
          <h1 className="text-4xl font-extralight text-gradient mb-2">Sign in</h1>
          <p className="text-white/50 text-sm">Welcome back to Visthar.</p>
        </div>
        <form onSubmit={submit} className="glass rounded-3xl p-8 space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@email.com"
              className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50"
            />
          </div>
          <button
            disabled={loading}
            className="w-full px-6 py-4 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={14} />
          </button>
          <div className="text-center text-sm text-white/50 pt-2">
            New to Visthar?{' '}
            <Link href="/signup" className="text-[#00FF85] hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
