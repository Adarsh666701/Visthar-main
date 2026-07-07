'use client';
import { useCart } from '@/components/visthar/CartContext';
import PageShell from '@/components/visthar/PageShell';
import { PRODUCTS } from '@/lib/products';
import { motion } from 'framer-motion';
import { ArrowLeft, Battery, Bell, Box, Check, Cpu, Heart, Lock, Shield, ShoppingBag, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Product3D = dynamic(() => import('@/components/visthar/Product3D'), { ssr: false, loading: () => null });

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState(PRODUCTS);
  const { add } = useCart() || {};
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [show3D, setShow3D] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const fallbackImage = PRODUCTS[0]?.image || '';

  useEffect(() => {
    let isMounted = true;
    const slug = params?.slug;

    const loadProduct = async () => {
      if (!slug) {
        if (isMounted) setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const listRes = await fetch('/api/products', { cache: 'no-store' });
        const listData = await listRes.json();
        if (isMounted && Array.isArray(listData?.products)) {
          setProducts(listData.products);
          const matched = listData.products.find((item) => item.slug === slug);
          if (matched) {
            setProduct(matched);
            setLoading(false);
            return;
          }
        }

        const detailRes = await fetch(`/api/products/${encodeURIComponent(String(slug))}`, { cache: 'no-store' });
        const detailData = await detailRes.json();

        if (isMounted) {
          if (detailData?.product) {
            setProduct(detailData.product);
          } else {
            const fallback = PRODUCTS.find((item) => item.slug === slug) || null;
            setProduct(fallback);
          }
        }
      } catch {
        if (isMounted) {
          setProduct(PRODUCTS.find((item) => item.slug === slug) || null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [params.slug]);

  const handleImageError = (event) => {
    if (event.currentTarget.src !== fallbackImage) {
      event.currentTarget.src = fallbackImage;
    }
  };

  if (loading) return <PageShell><div className="min-h-screen flex items-center justify-center text-white">Loading product...</div></PageShell>;

  if (!product) return <PageShell><div className="min-h-screen flex items-center justify-center text-white">Product not found. <Link href="/products" className="text-[#00FF85] ml-2">Back</Link></div></PageShell>;

  const related = products.filter(p => p.slug !== product.slug).slice(0, 3);

  const submit = async (endpoint, successMsg) => {
    if (!email) { toast.error('Email is required'); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name, productSlug: product.slug }) });
      const data = await res.json();
      if (res.ok) { toast.success(successMsg); setEmail(''); setName(''); }
      else toast.error(data.error || 'Something went wrong');
    } catch { toast.error('Network error'); }
    setSubmitting(false);
  };

  const addToCart = () => { add(product, 1); toast.success(`${product.name} added to cart`); };

  return (
    <PageShell>
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#00FF85]/8 blur-[160px] rounded-full" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/50 hover:text-[#00FF85] text-sm mb-10 transition"><ArrowLeft size={14} /> Back</button>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0a0a0c] to-[#020202]">
              {/* blurred image as background texture */}
              <div className="absolute inset-0 product-blur-strong pointer-events-none opacity-50">
                <img src={product.image || fallbackImage} alt={product.name} className="w-full h-full object-cover" onError={handleImageError} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
              </div>
              {/* 3D scene on top */}
              {show3D && <Product3D category={product.category} />}
              {/* core glow */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="absolute w-72 h-72 bg-[#00FF85]/20 blur-3xl rounded-full" />
              </div>
              {/* overlays */}
              <div className="absolute top-6 left-6 glass-dark px-3 py-1.5 rounded-full flex items-center gap-2 z-10">
                <Lock size={10} className="text-[#00FF85]" />
                <span className="text-[10px] tracking-[0.2em] text-white/80">{product.badge}</span>
              </div>
              <button onClick={() => setShow3D(!show3D)} className="absolute top-6 right-6 glass-dark px-3 py-1.5 rounded-full flex items-center gap-2 z-10 hover:border-[#00FF85]/40 transition">
                <Box size={11} className="text-[#00FF85]" />
                <span className="text-[10px] tracking-[0.2em] text-white/80">{show3D ? '3D ON' : '3D OFF'}</span>
              </button>
              <div className="absolute bottom-6 left-6 glass-dark px-3 py-1.5 rounded-full text-[10px] tracking-[0.2em] text-[#00FF85] z-10">Reveal teaser · final design at launch</div>
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00FF85] to-transparent animate-scan" />
              </div>
            </motion.div>
            <div>
              <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-4">{product.status}</div>
              <h1 className="text-5xl md:text-6xl font-extralight text-gradient leading-[1.05] mb-4">{product.name}</h1>
              <p className="text-white/60 text-lg font-light mb-8">{product.tagline}</p>
              <div className="flex items-baseline gap-3 mb-8">
                <div className="text-4xl font-light text-white">₹{product.price.toLocaleString('en-IN')}</div>
                <div className="text-white/40 text-sm">incl. all taxes</div>
              </div>
              <div className="flex gap-2 mb-6">
                <button onClick={addToCart} className="flex-1 px-6 py-4 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition flex items-center justify-center gap-2"><ShoppingBag size={14}/> Add to Cart</button>
                <button className="px-5 py-4 rounded-full glass text-white text-sm hover:border-[#00FF85]/40 transition"><Heart size={14}/></button>
              </div>
              <div className="glass rounded-2xl p-6 mb-6">
                <div className="text-xs text-[#00FF85] tracking-[0.3em] uppercase mb-3">Pre-Book · Notify Me</div>
                <p className="text-white/50 text-sm mb-4">Join the founder list. Limited slots. First reveal access.</p>
                <div className="space-y-2">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)" className="w-full bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00FF85]/50" />
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@email.com" className="w-full bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00FF85]/50" />
                </div>
                <div className="flex gap-2 mt-4">
                  <button disabled={submitting} onClick={() => submit('prebook', 'Pre-booking confirmed. Welcome.')} className="flex-1 px-6 py-3 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50"><Zap size={14} /> Pre-Book</button>
                  <button disabled={submitting} onClick={() => submit('notify-me', "You'll be notified at launch.")} className="px-6 py-3 rounded-full glass text-white text-sm hover:border-[#00FF85]/40 transition flex items-center gap-2"><Bell size={14} /> Notify Me</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/40">
                <div className="flex items-center gap-1"><Shield size={12} className="text-[#00FF85]" /> 2-yr warranty</div>
                <div className="flex items-center gap-1"><Battery size={12} className="text-[#00FF85]" /> Eco-recycle</div>
                <div className="flex items-center gap-1"><Cpu size={12} className="text-[#00FF85]" /> AI on-device</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extralight text-gradient mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-6 hover:border-[#00FF85]/30 transition">
                <div className="w-10 h-10 rounded-full bg-[#00FF85]/10 flex items-center justify-center mb-4"><Check size={16} className="text-[#00FF85]" /></div>
                <div className="text-white text-sm font-light">{f}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6 bg-[#030303]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extralight text-gradient mb-12">Specifications</h2>
          <div className="glass rounded-2xl divide-y divide-white/5">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center px-6 py-5"><div className="text-white/50 text-sm">{k}</div><div className="text-white text-sm">{v}</div></div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extralight text-gradient mb-12">Also from Visthar</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map(p => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="product-blur block aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 hover:border-[#00FF85]/30 transition relative">
                <img src={p.image || fallbackImage} className="w-full h-full object-cover" alt={p.name} onError={handleImageError} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80" />
                <div className="absolute bottom-6 left-6">
                  <div className="text-[10px] text-[#00FF85] tracking-[0.3em] uppercase mb-1">{p.status}</div>
                  <div className="text-white text-xl font-light">{p.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
