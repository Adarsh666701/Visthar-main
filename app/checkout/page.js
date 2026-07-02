'use client';
import { useAuth } from '@/components/visthar/AuthContext';
import { useCart } from '@/components/visthar/CartContext';
import HeroAnimation from '@/components/visthar/HeroAnimation';
import PageShell from '@/components/visthar/PageShell';
import { motion } from 'framer-motion';
import { Check, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCart();
  const { user, loading } = useAuth();
  const [shipping, setShipping] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login?next=/checkout');
  }, [loading, user, router]);
  useEffect(() => { if (user) setShipping(s => ({ ...s, name: user.name || '', email: user.email })); }, [user]);

  const placeOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Cart is empty');
    setProcessing(true);
    try {
      const intentRes = await fetch('/api/payments/create-intent', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shipping }),
      });
      const intentData = await intentRes.json();
      if (!intentRes.ok) throw new Error(intentData.error || 'Unable to initialize payment');

      // Stripe client-side confirmation (Elements) can be added here.
      const paymentIntentId = intentData?.payment?.paymentIntentId;

      const res = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipping, paymentProvider: 'stripe', paymentIntentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.order);
        clear();
      } else {
        throw new Error(data.error || 'Failed');
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    }
    setProcessing(false);
  };

  if (success) {
    return (
      <PageShell>
        <section className="pt-36 pb-24 px-6 min-h-screen flex items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00FF85]/20 blur-[120px] rounded-full" />
            <div className="relative">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className="w-20 h-20 rounded-full bg-[#00FF85] flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-black" strokeWidth={3}/>
              </motion.div>
              <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-3">Order Confirmed</div>
              <h1 className="text-4xl md:text-5xl font-extralight text-gradient mb-3">Thank you.</h1>
              <p className="text-white/60 mb-2">Order ID: <span className="text-white font-mono text-sm">{success.id}</span></p>
              <p className="text-white/40 text-xs mb-2">Stripe payment intent: {success.stripePaymentIntentId || 'mocked'}</p>
              <p className="text-white/50 text-sm mb-8">Total paid: <span className="text-gradient-neon text-xl">₹{success.total.toLocaleString('en-IN')}</span></p>
              <button onClick={() => router.push('/products')} className="px-8 py-3 rounded-full bg-[#00FF85] text-black text-sm font-medium">Continue exploring</button>
              <div className="mt-6 text-[10px] text-yellow-500/70 tracking-wider">Stripe structure enabled. Add Stripe Elements on client for live confirmation UX.</div>
            </div>
          </motion.div>
        </section>
      </PageShell>
    );
  }

  if (loading || !user) return <PageShell><div className="min-h-screen flex items-center justify-center text-white/50">Loading...</div></PageShell>;

  return (
    <PageShell>
      <section className="pt-36 pb-24 px-6 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] hidden md:block opacity-30"><HeroAnimation variant="globe" className="w-full h-full"/></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-3">Checkout</div>
          <h1 className="text-5xl md:text-6xl font-extralight text-gradient mb-12">Complete your order.</h1>
          <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-3 border-yellow-500/20">
            <ShieldCheck size={18} className="text-yellow-500" />
            <div className="text-xs text-yellow-200/80">Stripe payments are structured on backend. Add Stripe Elements client flow for live card confirmation.</div>
          </div>
          <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white text-lg font-light mb-4">Shipping address</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[['name','Full name'],['email','Email','email'],['phone','Phone'],['pincode','Pincode']].map(([k,p,t]) => (
                    <input key={k} required={k!=='phone'} type={t||'text'} value={shipping[k]} onChange={e=>setShipping({...shipping,[k]:e.target.value})} placeholder={p} className="bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
                  ))}
                  <input required value={shipping.address} onChange={e=>setShipping({...shipping,address:e.target.value})} placeholder="Address" className="sm:col-span-2 bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
                  <input required value={shipping.city} onChange={e=>setShipping({...shipping,city:e.target.value})} placeholder="City" className="bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
                  <input required value={shipping.state} onChange={e=>setShipping({...shipping,state:e.target.value})} placeholder="State" className="bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white text-lg font-light mb-4">Payment Method</h3>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-[#00FF85]/40 bg-[#00FF85]/5">
                  <CreditCard size={20} className="text-[#00FF85]" />
                  <div>
                    <div className="text-white text-sm">Stripe · Cards · Wallets</div>
                    <div className="text-white/40 text-[11px]">Secure 256-bit encrypted checkout</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 h-fit sticky top-28">
              <h3 className="text-white text-lg font-light mb-4">Summary</h3>
              <div className="space-y-2 pb-4 border-b border-white/5 max-h-48 overflow-auto">
                {items.map(i => (
                  <div key={i.slug} className="flex justify-between text-sm"><span className="text-white/70">{i.name} ×{i.qty}</span><span className="text-white">₹{(i.price*i.qty).toLocaleString('en-IN')}</span></div>
                ))}
              </div>
              <div className="flex justify-between mt-4 mb-6"><span className="text-white">Total</span><span className="text-2xl font-light text-gradient-neon">₹{total.toLocaleString('en-IN')}</span></div>
              <button disabled={processing || items.length === 0} className="w-full px-6 py-4 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition disabled:opacity-50 flex items-center justify-center gap-2">{processing ? 'Processing...' : <><Lock size={13}/> Pay ₹{total.toLocaleString('en-IN')}</>}</button>
            </div>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
