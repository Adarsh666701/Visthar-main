'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageShell from '@/components/visthar/PageShell';
import ProductCard from '@/components/visthar/ProductCard';
import SectionTitle from '@/components/visthar/SectionTitle';
import MagneticButton from '@/components/visthar/MagneticButton';
import { getCategory, getProductsByCategory } from '@/lib/products';
import Link from 'next/link';
import { ArrowLeft, Bell } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const cat = getCategory(params.slug);
  const [products, setProducts] = useState(() => getProductsByCategory(params.slug));

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.products) setProducts(data.products.filter((product) => product.category === params.slug));
      })
      .catch(() => {});
  }, [params.slug]);

  if (!cat) return <PageShell><div className="min-h-screen flex items-center justify-center">Category not found</div></PageShell>;

  return (
    <PageShell>
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#00FF85]/10 blur-[160px] rounded-full" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-7xl mx-auto">
          <Link href="/products" className="flex items-center gap-2 text-white/50 hover:text-[#00FF85] text-sm mb-10"><ArrowLeft size={14} /> All Categories</Link>
          <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-4">Visthar Collection</div>
          <h1 className="text-6xl md:text-8xl font-extralight text-gradient leading-[1.02] mb-6">{cat.name}.</h1>
          <p className="text-2xl md:text-3xl font-extralight text-gradient-neon mb-6">{cat.tagline}</p>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">{cat.desc}</p>
        </div>
      </section>
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="glass rounded-3xl p-16 text-center max-w-2xl mx-auto">
              <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-4">Preview Locked</div>
              <h3 className="text-3xl md:text-4xl font-extralight text-gradient mb-4">Coming soon.</h3>
              <p className="text-white/50 mb-8">Products in this category are still under wraps. Join the early access list to be the first notified.</p>
              <MagneticButton href="/future-lab"><Bell size={14}/> Get Notified</MagneticButton>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
