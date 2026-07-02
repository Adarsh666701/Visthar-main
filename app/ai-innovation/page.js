'use client';
import { motion } from 'framer-motion';
import PageShell from '@/components/visthar/PageShell';
import SectionTitle from '@/components/visthar/SectionTitle';
import { Cpu, Brain, Eye, Activity, Sparkles, Mic, Languages, Headphones } from 'lucide-react';
import HeroAnimation from '@/components/visthar/HeroAnimation';

export default function AIInnovation() {
  return (
    <PageShell>
      <section className="relative pt-36 pb-24 px-6 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#00FF85]/10 blur-[160px] rounded-full" />
        <div className="absolute inset-0 opacity-40"><HeroAnimation variant="neural" className="w-full h-full"/></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-4">AI Innovation</div>
          <h1 className="text-5xl md:text-8xl font-extralight leading-[1.02] mb-8"><span className="text-gradient">Quiet </span><span className="text-gradient-neon">intelligence.</span></h1>
          <p className="text-white/60 text-xl leading-relaxed font-light max-w-3xl mx-auto">A neural engine woven through every Visthar device. On-device. Privacy-first. Adaptive to you.</p>
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Headphones, t: 'AI Adaptive Audio', d: 'Speakers and earbuds that map your room, your ears, and your environment in real time.' },
              { icon: Eye, t: 'Vision Accessibility', d: 'Live audio descriptions, text recognition, and ambient awareness for visually impaired users.' },
              { icon: Languages, t: 'Realtime Translation', d: 'On-device translation in 40+ languages with sub-200ms latency.' },
              { icon: Activity, t: 'Health Co-pilot', d: 'Continuous biomarker analysis, recovery scoring, and proactive wellness signals.' },
              { icon: Mic, t: 'Conversational AI', d: 'Talk to your Visthar device. It remembers context, schedules, preferences.' },
              { icon: Brain, t: 'Neural Compute', d: 'Custom Visthar V1 silicon. 18 TOPS. Fanless. Always available.' },
              { icon: Cpu, t: 'On-device privacy', d: 'Your data never leaves the device. End-to-end encrypted sync, opt-in only.' },
              { icon: Sparkles, t: 'Ambient intelligence', d: 'The ecosystem learns. Speakers, wearables, and accessories share insights silently.' },
            ].map(({icon: I, t, d}, i) => (
              <motion.div key={t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-6 hover:border-[#00FF85]/30 transition group">
                <div className="w-11 h-11 rounded-full bg-[#00FF85]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition"><I size={18} className="text-[#00FF85]" /></div>
                <h3 className="text-base text-white font-light mb-2">{t}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto glass rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00FF85]/10 blur-[120px] rounded-full" />
          <div className="relative">
            <h3 className="text-3xl md:text-5xl font-extralight text-gradient mb-6">Visthar V1 Neural Engine</h3>
            <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10">Our custom-designed AI silicon — fanless, low-power, always-on. The brain of every flagship Visthar device.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[['18', 'TOPS'], ['<0.5W', 'idle power'], ['5nm', 'process'], ['100%', 'on-device']].map(([n,l]) => (
                <div key={l}><div className="text-4xl font-light text-gradient-neon">{n}</div><div className="text-[10px] tracking-[0.2em] text-white/40 uppercase mt-2">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
