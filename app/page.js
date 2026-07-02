'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Leaf, Cpu, Zap, ShieldCheck, Headphones, Glasses, Star, ChevronRight, Award, Globe2 } from 'lucide-react';
import PageShell from '@/components/visthar/PageShell';
import ProductCard from '@/components/visthar/ProductCard';
import MagneticButton from '@/components/visthar/MagneticButton';
import SectionTitle from '@/components/visthar/SectionTitle';
import { PRODUCTS, CATEGORIES, HERO_BG, ECO_BG } from '@/lib/products';

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 }); const sy = useSpring(my, { stiffness: 50, damping: 20 });
  useEffect(() => {
    const onMove = (e) => { mx.set((e.clientX / window.innerWidth - 0.5) * 30); my.set((e.clientY / window.innerHeight - 0.5) * 30); };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* bg image */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-40" style={{ filter: 'blur(8px) saturate(180%)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/70 to-[#050505]" />
      </motion.div>
      {/* grid */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* radial glow */}
      <motion.div style={{ x: sx, y: sy }} className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#00FF85]/15 blur-[140px]" />
      <motion.div style={{ y: y2 }} className="absolute bottom-20 right-20 w-[400px] h-[400px] rounded-full bg-[#00FF85]/10 blur-[120px]" />
      {/* floating particles - reduced for perf */}
      {[...Array(8)].map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 bg-[#00FF85]/60 rounded-full"
          initial={{ x: Math.random() * 1600, y: Math.random() * 900 }}
          animate={{ y: [null, Math.random() * 900], opacity: [0, 1, 0] }}
          transition={{ duration: 8 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 4 }} />
      ))}
      {/* floating logo orb */}
      <motion.div style={{ x: sx, y: sy, opacity }} className="absolute top-1/2 right-[8%] -translate-y-1/2 hidden lg:block">
        <motion.div animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="relative w-[380px] h-[380px]">
          <div className="absolute inset-0 bg-[#00FF85]/20 blur-[100px] rounded-full" />
          <div className="absolute inset-12 border border-[#00FF85]/20 rounded-full animate-pulse" />
          <div className="absolute inset-20 border border-[#00FF85]/10 rounded-full" />
          <img src="/visthar-logo.png" alt="" className="relative w-full h-full object-contain drop-shadow-[0_0_60px_rgba(255,215,0,0.5)]" />
        </motion.div>
      </motion.div>
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-[#00FF85] rounded-full animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] text-white/70 uppercase">Visthar Electronics · Series One · 2026</span>
        </motion.div>
        <h1 className="text-[clamp(2.8rem,9vw,8rem)] font-extralight leading-[0.95] tracking-[-0.04em] max-w-5xl">
          <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2.7, ease: [0.22, 1, 0.36, 1] }} className="block text-gradient">Future of</motion.span>
          <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2.85, ease: [0.22, 1, 0.36, 1] }} className="block text-gradient-neon">Smart Accessories.</motion.span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.1 }} className="max-w-xl text-white/60 text-lg md:text-xl mt-8 font-light leading-relaxed">
          AI-powered, eco-conscious technology engineered for the next generation of human experience.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.3 }} className="flex flex-wrap gap-4 mt-10">
          <MagneticButton href="/products">Explore Collection <ArrowRight size={15} /></MagneticButton>
          <MagneticButton href="/future-lab" variant="ghost">Pre-Book AI Devices <Sparkles size={14} /></MagneticButton>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.6 }} className="flex flex-wrap gap-x-12 gap-y-4 mt-16 pt-8 border-t border-white/5 max-w-2xl">
          {[['200K+', 'pre-orders'], ['12', 'patents pending'], ['98%', 'recycled packaging'], ['8', 'years warranty']].map(([n, l]) => (
            <div key={l}><div className="text-2xl font-light text-white">{n}</div><div className="text-[10px] tracking-[0.2em] text-white/40 uppercase mt-1">{l}</div></div>
          ))}
        </motion.div>
      </motion.div>
      {/* scroll indicator */}
      <motion.div animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-[10px] tracking-[0.4em] flex flex-col items-center gap-2">
        <span>SCROLL</span>
        <span className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}

function Marquee() {
  const items = ['INTRODUCING', 'VISTHAR × AI', 'V GREEN INITIATIVE', 'CONFIDENTIAL PROTOTYPES', 'PREMIUM INDIAN ENGINEERING', 'LAUNCHING 2026'];
  return (
    <div className="relative py-8 border-y border-white/5 bg-[#020202] overflow-hidden">
      <motion.div animate={{ x: [0, -1200] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="flex gap-16 whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <div key={i} className="flex items-center gap-16 text-3xl md:text-5xl font-extralight tracking-[0.2em] text-white/30">
            {t}
            <span className="w-2 h-2 bg-[#00FF85] rounded-full" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Categories() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Collection" title="An ecosystem, engineered." subtitle="Ten categories. One vision. A new generation of intelligent accessories built for the way you actually live." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((c, i) => (
            <motion.div key={c.slug} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={`/category/${c.slug}`} className="block relative aspect-[3/4] rounded-2xl glass overflow-hidden p-5 group hover:border-[#00FF85]/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00FF85]/0 to-[#00FF85]/0 group-hover:from-[#00FF85]/10 group-hover:to-transparent transition duration-700" />
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#00FF85]/5 blur-3xl group-hover:bg-[#00FF85]/15 transition duration-700" />
                <div className="relative flex flex-col h-full justify-between">
                  <div className="text-[10px] text-white/40 tracking-[0.3em] uppercase">0{i+1}</div>
                  <div>
                    <div className="text-base text-white font-light mb-1">{c.name}</div>
                    <div className="text-[11px] text-[#00FF85]/70 mb-3">{c.tagline}</div>
                    <div className="flex items-center gap-1 text-white/40 text-xs group-hover:text-[#00FF85] transition">Explore <ChevronRight size={12} className="group-hover:translate-x-1 transition" /></div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.products?.length) setProducts(data.products);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#00FF85]/5 blur-[120px]" />
      <div className="relative max-w-7xl mx-auto">
        <SectionTitle eyebrow="Featured Drops" title="Confidential prototypes." subtitle="All product imagery intentionally obscured. Reveal happens on launch day. Pre-book to be among the first." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function FutureLabTeaser() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#00FF85]/8 blur-[160px] rounded-full" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6">
              <Cpu size={12} className="text-[#00FF85]" />
              <span className="text-[10px] tracking-[0.3em] text-white/70 uppercase">Future Lab · Restricted Access</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extralight text-gradient leading-[1.05] tracking-tight mb-6">Unreleased.<br/><span className="text-gradient-neon">Unforgettable.</span></h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">A glimpse into the products being shaped behind closed doors. Only verified members get early access. Visthar smart glasses include world-class accessibility features for visually impaired users.</p>
            <div className="flex gap-3 flex-wrap">
              {[{ icon: Headphones, label: 'AI Earbuds' }, { icon: Glasses, label: 'Smart Glasses' }, { icon: Sparkles, label: 'Pulse Band' }].map(({icon: I, label}) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                  <I size={14} className="text-[#00FF85]" /><span className="text-sm text-white/80">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-10"><MagneticButton href="/future-lab">Enter Future Lab <ArrowRight size={14} /></MagneticButton></div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="relative aspect-square">
            <div className="absolute inset-0 rounded-full border border-[#00FF85]/30 animate-pulse" />
            <div className="absolute inset-10 rounded-full border border-[#00FF85]/20" />
            <div className="absolute inset-20 rounded-full border border-white/10" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute inset-0">
              {[0, 90, 180, 270].map((deg, i) => (
                <div key={i} className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#00FF85] rounded-full shadow-[0_0_20px_#00FF85]" style={{ transform: `rotate(${deg}deg) translateX(180px) translate(-50%, -50%)` }} />
              ))}
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} className="relative w-48 h-48">
                <div className="absolute inset-0 bg-[#00FF85]/30 blur-3xl rounded-full" />
                <img src="/visthar-logo.png" alt="" className="relative w-full h-full object-contain drop-shadow-[0_0_40px_rgba(255,215,0,0.5)]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VGreenSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <img src={ECO_BG} alt="" className="w-full h-full object-cover opacity-20" style={{ filter: 'blur(4px)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-[#050505]/40" />
      </div>
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6">
            <Leaf size={12} className="text-[#00FF85]" />
            <span className="text-[10px] tracking-[0.3em] text-white/70 uppercase">V Green Initiative</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-extralight text-gradient leading-[1.05] tracking-tight mb-6">Tech that<br/><span className="text-gradient-neon">heals the planet.</span></h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">Plastic-free packaging, carbon-negative manufacturing, and a closed-loop recycling program built into every product we ship.</p>
          <div className="grid grid-cols-3 gap-6">
            {[['-89%', 'plastic use'], ['100%', 'recyclable'], ['2027', 'net-zero target']].map(([n, l]) => (
              <div key={l}><div className="text-3xl font-light text-gradient-neon">{n}</div><div className="text-[10px] tracking-[0.2em] text-white/40 uppercase mt-2">{l}</div></div>
            ))}
          </div>
          <div className="mt-10"><MagneticButton href="/v-green" variant="ghost">Explore V Green <Leaf size={14} /></MagneticButton></div>
        </div>
        <div className="relative aspect-square">
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} className="absolute w-2 h-2 bg-[#00FF85] rounded-full" initial={{ x: Math.random()*400, y: Math.random()*400 }} animate={{ x: Math.random()*400, y: Math.random()*400 }} transition={{ duration: 8+Math.random()*4, repeat: Infinity, repeatType: 'reverse' }} />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
              <Leaf size={200} className="text-[#00FF85]/30" strokeWidth={0.5} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const reviews = [
    { name: 'Aarav K.', city: 'Bengaluru', rating: 5, text: 'The build quality and sound profile of the AI Earbuds are genuinely industry leading. India finally has Apple-grade hardware.' },
    { name: 'Priya M.', city: 'Mumbai', rating: 5, text: 'My pre-order experience felt like an Apple keynote. The pulse band design is beautiful and the accessibility features are revolutionary.' },
    { name: 'Rohan S.', city: 'Delhi', rating: 5, text: 'Visthar feels different. Quiet luxury, real innovation. The smart glasses prototype I tried at their lab is the future.' },
    { name: 'Neha V.', city: 'Pune', rating: 5, text: 'Finally a brand combining premium feel with sustainability. The recycled aluminum chassis on the speaker is gorgeous.' },
  ];
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Trusted by thousands" title="A community of believers." subtitle="Real words from our earliest backers, pre-order customers, and lab visitors." />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }} className="glass rounded-2xl p-6 group hover:border-[#00FF85]/30 transition relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00FF85]/0 group-hover:bg-[#00FF85]/10 blur-2xl transition duration-700" />
              <div className="flex gap-0.5 mb-4">{[...Array(r.rating)].map((_, j) => <Star key={j} size={12} className="fill-[#00FF85] text-[#00FF85]" />)}</div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">“{r.text}”</p>
              <div className="pt-4 border-t border-white/5"><div className="text-white text-sm">{r.name}</div><div className="text-white/40 text-xs">{r.city}</div></div>
            </motion.div>
          ))}
        </div>
        <div className="mt-20 flex flex-wrap justify-center items-center gap-10 opacity-60">
          {['Apple-grade build', 'ISO 9001', 'Carbon Trust', 'Make in India', 'IP57 rated', 'Hi-Res Audio'].map(l => (
            <div key={l} className="flex items-center gap-2 text-white/50 text-xs tracking-wider"><Award size={14} className="text-[#00FF85]/60" /> {l}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 radial-glow" />
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="inline-block mb-8">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-[#00FF85]/30 blur-2xl rounded-full animate-pulse" />
            <img src="/visthar-logo.png" alt="" className="relative w-full h-full object-contain" />
          </div>
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-extralight text-gradient leading-[1.05] mb-6">This is the future.<br/><span className="text-gradient-neon">You're invited.</span></h2>
        <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">Pre-book any Visthar device and join the founder list. Limited slots. Cinematic launch experience.</p>
        <div className="flex flex-wrap gap-4 justify-center"><MagneticButton href="/future-lab">Pre-Book Now <Zap size={14} /></MagneticButton><MagneticButton href="/oem" variant="ghost">For Business <Globe2 size={14} /></MagneticButton></div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <Marquee />
      <Categories />
      <FeaturedProducts />
      <FutureLabTeaser />
      <VGreenSection />
      <TrustSection />
      <CTASection />
    </PageShell>
  );
}
