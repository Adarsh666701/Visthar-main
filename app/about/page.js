'use client';
import { motion } from 'framer-motion';
import PageShell from '@/components/visthar/PageShell';
import SectionTitle from '@/components/visthar/SectionTitle';
import MagneticButton from '@/components/visthar/MagneticButton';
import HeroAnimation from '@/components/visthar/HeroAnimation';
import { Cpu, Heart, Globe2, Users } from 'lucide-react';

export default function About() {
  return (
    <PageShell>
      <section className="relative pt-36 pb-20 px-6 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 radial-glow" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] hidden lg:block opacity-80">
          <HeroAnimation variant="geometric" className="w-full h-full"/>
        </div>
        <div className="relative max-w-5xl mx-auto text-center lg:text-left">
          <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-4">About Visthar</div>
          <h1 className="text-5xl md:text-8xl font-extralight text-gradient leading-[1.02] mb-8">Engineered in India.<br/><span className="text-gradient-neon">Designed for the world.</span></h1>
          <p className="text-white/60 text-lg md:text-xl leading-relaxed font-light max-w-3xl">Vistharuio Electronics Private Limited is a next-generation consumer-electronics company building intelligent, eco-conscious accessories — marrying premium Indian engineering with AI-first product design.</p>
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, t: 'AI-first design', d: 'Every Visthar device ships with on-device intelligence and learns the way you live.' },
            { icon: Heart, t: 'Accessibility-led', d: 'Built-in support for visually impaired users and adaptive controls across the lineup.' },
            { icon: Globe2, t: 'Eco-conscious', d: '98% recycled packaging, carbon-neutral logistics, and a closed-loop hardware program.' },
          ].map(({icon: I, t, d}) => (
            <div key={t} className="glass rounded-3xl p-8 hover:border-[#00FF85]/30 transition">
              <div className="w-12 h-12 rounded-full bg-[#00FF85]/10 flex items-center justify-center mb-5"><I size={20} className="text-[#00FF85]" /></div>
              <h3 className="text-xl text-white font-light mb-3">{t}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div><SectionTitle eyebrow="Our story" align="left" title="A new kind of Indian tech company." subtitle="Founded in 2024 by a team of engineers, designers and accessibility advocates, Visthar exists to prove that the most beautiful, most intelligent consumer technology can come from India — and that premium hardware doesn't have to cost the planet." /></div>
          <div className="grid grid-cols-2 gap-4">
            {[['12', 'Patents pending'], ['200K', 'Pre-orders'], ['8', 'Yrs warranty'], ['42', 'Engineers']].map(([n,l]) => (<div key={l} className="glass rounded-2xl p-8 text-center"><div className="text-5xl font-light text-gradient-neon mb-2">{n}</div><div className="text-[10px] tracking-[0.2em] text-white/40 uppercase">{l}</div></div>))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extralight text-gradient mb-6">Join us.</h2>
          <p className="text-white/50 mb-10">We're hiring across engineering, design, and supply chain.</p>
          <MagneticButton href="/contact">Get in touch <Users size={14}/></MagneticButton>
        </div>
      </section>
    </PageShell>
  );
}
