'use client';
import { PRODUCTS } from '@/lib/products';
import { motion } from 'framer-motion';
import { ArrowUpRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Product3D from './Product3D';

export default function ProductCard({ product, index = 0 }) {
  const fallbackImage = PRODUCTS[0]?.image || '';
  const [imageSrc, setImageSrc] = useState(product.image || fallbackImage);

  useEffect(() => {
    setImageSrc(product.image || fallbackImage);
  }, [product.image, fallbackImage]);

  const handleImageError = () => {
    if (imageSrc !== fallbackImage) {
      setImageSrc(fallbackImage);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="product-blur relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a0a0c] via-[#0f0f12] to-[#050505] border border-white/5 group-hover:border-[#00FF85]/30 transition-all duration-500">
          {/* image bg */}
          <img src={imageSrc} alt={product.name} className="absolute inset-0 w-full h-full object-cover" onError={handleImageError} />
          {/* dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
          {/* grid bg */}
          <div className="absolute inset-0 grid-bg opacity-20 group-hover:opacity-30 transition" />
          {/* themed 3D scene on hover - replaces blurred image */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <Product3D category={product.category} />
          </div>
          {/* neon glow on hover */}
          <div className="absolute -inset-1 bg-[#00FF85]/0 group-hover:bg-[#00FF85]/10 blur-2xl transition duration-700" />
          {/* scan line */}
          <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00FF85] to-transparent animate-scan" />
          </div>
          {/* badge */}
          <div className="absolute top-5 left-5 z-10">
            <div className="glass-dark px-3 py-1.5 rounded-full flex items-center gap-2">
              <Lock size={9} className="text-[#00FF85]" />
              <span className="text-[9px] tracking-[0.2em] text-white/80 font-medium">{product.badge}</span>
            </div>
          </div>
          <div className="absolute top-5 right-5 z-10">
            <div className="w-9 h-9 rounded-full glass-dark flex items-center justify-center text-white/70 group-hover:text-[#00FF85] group-hover:rotate-45 transition duration-500">
              <ArrowUpRight size={14} />
            </div>
          </div>
          {/* bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
            <div className="text-[10px] text-[#00FF85] tracking-[0.3em] uppercase mb-2">{product.status}</div>
            <h3 className="text-xl text-white font-light mb-1">{product.name}</h3>
            <p className="text-white/50 text-sm mb-3">{product.tagline}</p>
            <div className="flex items-center justify-between">
              <div className="text-white/80 text-sm">₹{product.price.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-white/40 tracking-widest uppercase">Hover to preview →</div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
