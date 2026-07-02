'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageShell from '@/components/visthar/PageShell';
import SectionTitle from '@/components/visthar/SectionTitle';
import ProductCard from '@/components/visthar/ProductCard';
import { PRODUCTS } from '@/lib/products';
import { Lock, Headphones, Glasses, Watch, Sparkles, Bell } from 'lucide-react';
import { toast } from 'sonner';

function Countdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date();
    target.setMonth(target.getMonth() + 2);
    const tick = () => {
      const diff = target - new Date();
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({ d, h, m, s });
    };
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t);
  }, []);
  return (
    <div className="flex gap-3 md:gap-6 justify-center">
      {[['DAYS', time.d], ['HRS', time.h], ['MIN', time.m], ['SEC', time.s]].map(([l, v]) => (
        <div key={l} className="glass rounded-2xl px-5 md:px-8 py-5 text-center min-w-[80px]">
          <div className="text-3xl md:text-5xl font-extralight text-gradient-neon tabular-nums">{String(v).padStart(2, '0')}</div>
          <div className="text-[9px] md:text-[10px] tracking-[0.3em] text-white/40 uppercase mt-2">{l}</div>
        </div>
      ))}
    </div>
  );
}

export default function FutureLab() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.products?.length) setProducts(data.products);
      })
      .catch(() => {});
  }, []);

  const submit = async () => {
    if (!email) return toast.error('Email is required');
    setSubmitting(true);
    const res = await fetch('/api/prebook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, productSlug: 'future-lab-waitlist' }) });
    if (res.ok) { toast.success('You\'re on the founder list.'); setEmail(''); }
    else toast.error('Something went wrong');
    setSubmitting(false);
  };
  return (
    <PageShell>
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#00FF85]/10 blur-[160px] rounded-full" />
        {[...Array(10)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-[#00FF85] rounded-full" initial={{ x: Math.random()*1600, y: Math.random()*900, opacity: 0 }} animate={{ y: Math.random()*900, opacity: [0, 1, 0] }} transition={{ duration: 7+Math.random()*5, repeat: Infinity, delay: Math.random()*3 }} />
        ))}
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full mb-8">
            <Lock size={12} className="text-[#00FF85]" />
            <span className="text-[10px] tracking-[0.4em] text-[#00FF85] uppercase">Restricted Access · Confidential</span>
          </motion.div>
          <h1 className="text-5xl md:text-9xl font-extralight leading-[0.95] mb-8"><span className="text-gradient">Future</span><br/><span className="text-gradient-neon">Lab.</span></h1>
          <p className="text-white/60 text-xl leading-relaxed font-light max-w-2xl mx-auto mb-12">A glimpse behind the curtain. Unreleased Visthar prototypes — reserved for founder-list members.</p>
          <Countdown />
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-6">Until first reveal</p>
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="Showcase" title="In development." subtitle="Final design and specifications remain confidential. All images intentionally obscured." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00FF85]/10 blur-[120px] rounded-full" />
          <div className="relative">
            <Sparkles size={32} className="text-[#00FF85] mx-auto mb-4" />
            <h3 className="text-3xl md:text-5xl font-extralight text-gradient mb-4">Join the founder list.</h3>
            <p className="text-white/50 mb-8">Only 1,000 slots. First-reveal access. Limited-edition founder serial numbers.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="flex-1 bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00FF85]/50" />
              <button disabled={submitting} onClick={submit} className="px-6 py-3 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition disabled:opacity-50 flex items-center justify-center gap-2"><Bell size={14}/> Get Early Access</button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
