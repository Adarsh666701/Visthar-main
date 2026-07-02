'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/visthar/AuthContext';
import { toast } from 'sonner';

export default function AdminLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      if (u.role !== 'admin') { toast.error('Not an admin account'); setLoading(false); return; }
      toast.success('Welcome back, admin.');
      router.push('/admin');
    } catch (err) { toast.error(err.message); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FF85]/10 blur-[160px] rounded-full" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6">
            <ShieldCheck size={12} className="text-[#00FF85]" />
            <span className="text-[10px] tracking-[0.4em] text-[#00FF85] uppercase">Admin Access</span>
          </div>
          <img src="/visthar-logo.png" className="w-16 h-16 mx-auto mb-4" alt="" />
          <h1 className="text-4xl font-extralight text-gradient mb-2">Admin Panel</h1>
          <p className="text-white/50 text-sm">Authorized personnel only.</p>
        </div>
        <form onSubmit={submit} className="glass rounded-3xl p-8 space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="admin@email.com" className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
            <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
          </div>
          <button disabled={loading} className="w-full px-6 py-4 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition disabled:opacity-50 flex items-center justify-center gap-2">{loading ? 'Authenticating...' : <>Sign In <ArrowRight size={14}/></>}</button>
        </form>
      </motion.div>
    </div>
  );
}
