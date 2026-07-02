'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Lock } from 'lucide-react';
import PageShell from '@/components/visthar/PageShell';
import HeroAnimation from '@/components/visthar/HeroAnimation';
import { useCart } from '@/components/visthar/CartContext';

export default function CartPage() {
  const { items, total, update, remove, count } = useCart();
  return (
    <PageShell>
      <section className="pt-36 pb-24 px-6 min-h-screen relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] hidden md:block opacity-40"><HeroAnimation variant="orbits" className="w-full h-full"/></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-2">Cart</div>
              <h1 className="text-5xl md:text-7xl font-extralight text-gradient">Your bag.</h1>
            </div>
            <div className="text-white/40 text-sm">{count} item{count !== 1 ? 's' : ''}</div>
          </div>
          {items.length === 0 ? (
            <div className="glass rounded-3xl p-16 text-center">
              <ShoppingBag size={32} className="text-[#00FF85] mx-auto mb-4" />
              <h3 className="text-2xl font-extralight text-gradient mb-3">Your bag is empty.</h3>
              <p className="text-white/50 mb-8">Begin with a confidential prototype.</p>
              <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00FF85] text-black text-sm font-medium">Explore products <ArrowRight size={14}/></Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                {items.map(i => (
                  <motion.div key={i.slug} layout className="glass rounded-2xl p-4 flex gap-4 items-center">
                    <div className="product-blur relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={i.image} className="w-full h-full object-cover" alt={i.name} />
                      <div className="absolute inset-0 bg-black/30" />
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${i.slug}`} className="text-white font-light hover:text-[#00FF85] transition">{i.name}</Link>
                      <div className="text-white/40 text-xs mt-1">₹{i.price.toLocaleString('en-IN')}</div>
                      <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => update(i.slug, i.qty - 1)} className="w-7 h-7 rounded-full glass flex items-center justify-center text-white/70 hover:text-[#00FF85]"><Minus size={12}/></button>
                        <span className="text-white text-sm w-8 text-center tabular-nums">{i.qty}</span>
                        <button onClick={() => update(i.slug, i.qty + 1)} className="w-7 h-7 rounded-full glass flex items-center justify-center text-white/70 hover:text-[#00FF85]"><Plus size={12}/></button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white">₹{(i.price * i.qty).toLocaleString('en-IN')}</div>
                      <button onClick={() => remove(i.slug)} className="text-white/40 hover:text-red-400 mt-3"><Trash2 size={14}/></button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="glass rounded-2xl p-6 h-fit sticky top-28">
                <h3 className="text-white text-lg font-light mb-5">Order Summary</h3>
                <div className="space-y-2 text-sm pb-4 border-b border-white/5">
                  <div className="flex justify-between"><span className="text-white/50">Subtotal</span><span className="text-white">₹{total.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Shipping</span><span className="text-[#00FF85]">Free</span></div>
                  <div className="flex justify-between"><span className="text-white/50">GST included</span><span className="text-white/40">—</span></div>
                </div>
                <div className="flex justify-between pt-4 mb-6"><span className="text-white">Total</span><span className="text-2xl font-light text-gradient-neon">₹{total.toLocaleString('en-IN')}</span></div>
                <Link href="/checkout" className="w-full px-6 py-4 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition flex items-center justify-center gap-2"><Lock size={13}/> Secure Checkout</Link>
                <div className="text-[10px] text-white/40 text-center mt-3 tracking-wider uppercase">Razorpay · UPI · Cards · Wallets</div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
