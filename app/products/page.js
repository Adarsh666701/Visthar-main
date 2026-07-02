'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import PageShell from '@/components/visthar/PageShell';
import ProductCard from '@/components/visthar/ProductCard';
import SectionTitle from '@/components/visthar/SectionTitle';
import HeroAnimation from '@/components/visthar/HeroAnimation';
import { PRODUCTS, CATEGORIES } from '@/lib/products';

const CAT_IMAGES = {
  chargers: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGNoYXJnZXJ8ZW58MHx8fGJsYWNrfDE3Nzg0NDAzMTR8MA&ixlib=rb-4.1.0&q=85',
  'fast-chargers': 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGNoYXJnZXJ8ZW58MHx8fGJsYWNrfDE3Nzg0NDAzMTR8MA&ixlib=rb-4.1.0&q=85',
  cables: 'https://images.unsplash.com/photo-1616133321649-d29ebc595799?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxkYXJrJTIwdGVjaCUyMGFic3RyYWN0fGVufDB8fHxibGFja3wxNzc4NDQwMzA4fDA&ixlib=rb-4.1.0&q=85',
  earbuds: 'https://images.unsplash.com/photo-1520186994231-6ea0019d8d51?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwyfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjBkYXJrfGVufDB8fHxibGFja3wxNzc4NDQwMzA2fDA&ixlib=rb-4.1.0&q=85',
  headphones: 'https://images.unsplash.com/photo-1505739718967-6df30ff369c7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaGVhZHBob25lc3xlbnwwfHx8YmxhY2t8MTc3ODQ0MDMwN3ww&ixlib=rb-4.1.0&q=85',
  speakers: 'https://images.unsplash.com/photo-1617722694908-9be1092d1bc2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxzbWFydCUyMHNwZWFrZXJ8ZW58MHx8fGJsYWNrfDE3Nzg0NDAzMTR8MA&ixlib=rb-4.1.0&q=85',
  'smart-devices': 'https://images.unsplash.com/photo-1616133321649-d29ebc595799?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxkYXJrJTIwdGVjaCUyMGFic3RyYWN0fGVufDB8fHxibGFja3wxNzc4NDQwMzA4fDA&ixlib=rb-4.1.0&q=85',
  'ai-wearables': 'https://images.unsplash.com/photo-1647668771036-f692bbdc9f0d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwzfHxzbWFydHdhdGNoJTIwd2VhcmFibGV8ZW58MHx8fGJsYWNrfDE3Nzg0NDAzMTV8MA&ixlib=rb-4.1.0&q=85',
  'ai-accessories': 'https://images.unsplash.com/photo-1552305608-a69fc8595989?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwyfHxzbWFydCUyMGdsYXNzZXMlMjBmdXR1cmlzdGljfGVufDB8fHxibGFja3wxNzc4NDQwMzA2fDA&ixlib=rb-4.1.0&q=85',
  'future-products': 'https://images.unsplash.com/photo-1552305608-a69fc8595989?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwyfHxzbWFydCUyMGdsYXNzZXMlMjBmdXR1cmlzdGljfGVufDB8fHxibGFja3wxNzc4NDQwMzA2fDA&ixlib=rb-4.1.0&q=85',
};

export default function ProductsPage() {
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('relevance');
  const [products, setProducts] = useState(PRODUCTS);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.products?.length) setProducts(data.products);
      })
      .catch(() => {});
  }, []);

  const list = useMemo(() => {
    let r = filter === 'all' ? products : products.filter(p => p.category === filter);
    if (q.trim()) {
      const t = q.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(t) || p.tagline.toLowerCase().includes(t) || p.features.join(' ').toLowerCase().includes(t));
    }
    if (sort === 'price-asc') r = [...r].sort((a,b)=>a.price-b.price);
    if (sort === 'price-desc') r = [...r].sort((a,b)=>b.price-a.price);
    if (sort === 'name') r = [...r].sort((a,b)=>a.name.localeCompare(b.name));
    return r;
  }, [filter, q, sort, products]);

  return (
    <PageShell>
      <section className="relative pt-36 pb-8 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00FF85]/8 blur-[140px] rounded-full" />
        <div className="absolute inset-0 opacity-40"><HeroAnimation variant="waveform" className="w-full h-full"/></div>
        <div className="relative max-w-7xl mx-auto">
          <SectionTitle eyebrow="All Products" title="The Visthar collection." subtitle="Every product. Every category. All confidential until launch day." />
        </div>
      </section>

      {/* Category image rail */}
      <section className="px-6 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin">
            <button onClick={() => setFilter('all')} className={`flex-shrink-0 snap-start relative w-44 h-28 rounded-2xl overflow-hidden border transition group ${filter==='all'?'border-[#00FF85]':'border-white/10 hover:border-white/30'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF85]/30 to-[#0a0a0a]"/>
              <div className="absolute inset-0 grid-bg opacity-40"/>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[10px] tracking-[0.3em] text-white/60 uppercase">View</div>
                <div className="text-white text-base font-light">All</div>
              </div>
            </button>
            {CATEGORIES.map(c => (
              <button key={c.slug} onClick={() => setFilter(c.slug)} className={`flex-shrink-0 snap-start relative w-44 h-28 rounded-2xl overflow-hidden border transition group ${filter===c.slug?'border-[#00FF85] glow-neon':'border-white/10 hover:border-[#00FF85]/40'}`}>
                <img src={CAT_IMAGES[c.slug]} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-110" style={{filter:'blur(8px) brightness(0.55) saturate(140%)'}}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"/>
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <div className="text-[9px] tracking-[0.3em] text-[#00FF85] uppercase mb-0.5">{c.tagline}</div>
                  <div className="text-white text-sm font-light">{c.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search + sort */}
      <section className="px-6 mb-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products, features, or tags..." className="w-full glass rounded-full pl-12 pr-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/40"/>
          </div>
          <div className="relative">
            <SlidersHorizontal size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40"/>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="glass rounded-full pl-11 pr-8 py-3 text-sm text-white focus:outline-none">
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-white/40 text-xs mb-6 tracking-wider uppercase">{list.length} result{list.length!==1?'s':''}</div>
          {list.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-white/40 mb-4">No products found.</div>
              <button onClick={()=>{setQ('');setFilter('all');}} className="text-[#00FF85] hover:underline text-sm">Clear filters</button>
            </div>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
            </motion.div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
