'use client';
import PageShell from '@/components/visthar/PageShell';
import HeroAnimation from '@/components/visthar/HeroAnimation';
import MagneticButton from '@/components/visthar/MagneticButton';
import { Leaf } from 'lucide-react';

export default function Sustainability() {
  return (
    <PageShell>
      <section className="pt-36 pb-24 px-6 min-h-[70vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0"><HeroAnimation variant="leafgrid" className="w-full h-full"/></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]"/>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-4">Sustainability</div>
          <h1 className="text-5xl md:text-7xl font-extralight text-gradient mb-8">Built to last.<br/><span className="text-gradient-neon">Designed to return.</span></h1>
          <p className="text-white/60 text-lg font-light mb-10 max-w-2xl mx-auto">Detailed environmental impact report and policies coming soon. See our V Green Initiative for current commitments.</p>
          <MagneticButton href="/v-green">Explore V Green <Leaf size={14}/></MagneticButton>
        </div>
      </section>
    </PageShell>
  );
}
