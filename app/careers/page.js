'use client';
import PageShell from '@/components/visthar/PageShell';
import MagneticButton from '@/components/visthar/MagneticButton';
import HeroAnimation from '@/components/visthar/HeroAnimation';
import { Briefcase, Code, Palette, Cpu, TrendingUp } from 'lucide-react';

const ROLES = [
  { icon: Code, t: 'Senior Embedded Engineer', loc: 'Bengaluru · Full-time' },
  { icon: Cpu, t: 'AI/ML Researcher (Audio)', loc: 'Bengaluru · Full-time' },
  { icon: Palette, t: 'Lead Industrial Designer', loc: 'Bengaluru · Full-time' },
  { icon: TrendingUp, t: 'Supply Chain Lead', loc: 'Bengaluru · Full-time' },
  { icon: Briefcase, t: 'Brand & Communications', loc: 'Remote · Full-time' },
];

export default function Careers() {
  return (
    <PageShell>
      <section className="pt-36 pb-20 px-6 min-h-[70vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0"><HeroAnimation variant="orbits" className="w-full h-full opacity-70"/></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-4">Careers</div>
          <h1 className="text-5xl md:text-7xl font-extralight text-gradient mb-6">Build the future with us.</h1>
          <p className="text-white/60 text-lg font-light mb-8">We're hiring across hardware engineering, industrial design, AI/ML, and supply chain.</p>
          <MagneticButton href="#roles">View Open Roles</MagneticButton>
        </div>
      </section>
      <section id="roles" className="pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {ROLES.map(({ icon: I, t, loc }) => (
            <div key={t} className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-[#00FF85]/30 transition group">
              <div className="w-12 h-12 rounded-full bg-[#00FF85]/10 flex items-center justify-center group-hover:scale-110 transition"><I size={18} className="text-[#00FF85]"/></div>
              <div className="flex-1">
                <div className="text-white font-light">{t}</div>
                <div className="text-white/40 text-xs mt-1">{loc}</div>
              </div>
              <a href="/contact" className="text-[#00FF85] text-sm hover:underline">Apply →</a>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
