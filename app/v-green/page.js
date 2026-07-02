'use client';
import { motion } from 'framer-motion';
import PageShell from '@/components/visthar/PageShell';
import SectionTitle from '@/components/visthar/SectionTitle';
import { Leaf, Recycle, Wind, Sun, Droplet, TreePine } from 'lucide-react';
import { ECO_BG } from '@/lib/products';

export default function VGreen() {
  return (
    <PageShell>
      <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={ECO_BG} alt="" className="w-full h-full object-cover opacity-30" style={{ filter: 'blur(6px) hue-rotate(70deg)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/60 to-[#050505]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FF85]/10 blur-[160px] rounded-full" />
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} className="absolute text-[#00FF85]/40" initial={{ x: Math.random()*1600, y: -50, opacity: 0 }} animate={{ y: 900, opacity: [0, 1, 0], rotate: 360 }} transition={{ duration: 14+Math.random()*8, repeat: Infinity, delay: Math.random()*10 }}>
            <Leaf size={14+Math.random()*16} />
          </motion.div>
        ))}
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-4">V Green Initiative</div>
          <h1 className="text-5xl md:text-8xl font-extralight leading-[1.02] mb-8"><span className="text-gradient">Tech that</span><br/><span className="text-gradient-neon">heals the planet.</span></h1>
          <p className="text-white/60 text-xl leading-relaxed font-light max-w-3xl mx-auto">Our promise: every Visthar device leaves the planet better than we found it.</p>
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            ['-89%', 'Reduction in single-use plastic across all packaging'],
            ['100%', 'Recyclable hardware. End-of-life takeback program included'],
            ['2027', 'Net-zero operations target. We\'re ahead of schedule'],
          ].map(([n, d], i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.1 }} className="glass rounded-3xl p-10 text-center">
              <div className="text-6xl font-light text-gradient-neon mb-4">{n}</div>
              <p className="text-white/60 text-sm leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="Our pillars" title="Sustainability, designed in." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Recycle, t: 'Closed-loop hardware', d: 'Return any Visthar device. We recycle it into the next generation.' },
              { icon: Wind, t: 'Carbon-neutral logistics', d: '100% offset shipping. Renewable-powered fulfillment centers.' },
              { icon: Sun, t: 'Solar manufacturing', d: 'Our factories run on 92% solar. Target 100% by Q4 2026.' },
              { icon: Droplet, t: 'Water positive', d: 'For every liter we use, we restore 1.4L through community projects.' },
              { icon: TreePine, t: '1M trees planted', d: 'For every 1,000 devices sold, we plant 1,000 trees in partnership with local NGOs.' },
              { icon: Leaf, t: 'Plastic-free packaging', d: 'Mushroom mycelium foam and recycled paper. Zero plastic, fully compostable.' },
            ].map(({icon: I, t, d}, i) => (
              <motion.div key={t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i*0.05 }} className="glass rounded-2xl p-7 hover:border-[#00FF85]/30 transition">
                <div className="w-12 h-12 rounded-full bg-[#00FF85]/10 flex items-center justify-center mb-5"><I size={20} className="text-[#00FF85]" /></div>
                <h3 className="text-lg text-white font-light mb-2">{t}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
