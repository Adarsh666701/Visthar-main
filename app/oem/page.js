'use client';
import { useState } from 'react';
import PageShell from '@/components/visthar/PageShell';
import SectionTitle from '@/components/visthar/SectionTitle';
import { Briefcase, Globe2, Factory, Award, ArrowRight } from 'lucide-react';
import HeroAnimation from '@/components/visthar/HeroAnimation';
import { toast } from 'sonner';

export default function OEM() {
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', volume: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const change = (k, v) => setForm({ ...form, [k]: v });
  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.company) { toast.error('Company and email are required'); return; }
    setSubmitting(true);
    const res = await fetch('/api/oem-inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { toast.success(data.message); setForm({ company: '', name: '', email: '', phone: '', volume: '', message: '' }); }
    else toast.error(data.error || 'Error');
    setSubmitting(false);
  };
  return (
    <PageShell>
      <section className="relative pt-36 pb-20 px-6 overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#00FF85]/8 blur-[160px] rounded-full" />
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] hidden lg:block opacity-90"><HeroAnimation variant="globe" className="w-full h-full"/></div>
        <div className="relative max-w-5xl mx-auto text-center lg:text-left">
          <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-4">OEM · B2B · Bulk Orders</div>
          <h1 className="text-5xl md:text-8xl font-extralight leading-[1.02] mb-8"><span className="text-gradient">Visthar at</span><br/><span className="text-gradient-neon">enterprise scale.</span></h1>
          <p className="text-white/60 text-lg md:text-xl font-light max-w-3xl">Bulk orders. Co-branded hardware. Custom firmware. Strategic partnerships. Built for procurement teams who refuse to compromise.</p>
        </div>
      </section>
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-4">
          {[
            { icon: Factory, t: 'OEM Manufacturing', d: 'Whitelabel & co-design' },
            { icon: Briefcase, t: 'Corporate Gifting', d: 'Premium branded sets' },
            { icon: Globe2, t: 'Distribution', d: 'Regional & global' },
            { icon: Award, t: 'Enterprise Support', d: 'SLA-backed, dedicated' },
          ].map(({icon: I, t, d}) => (
            <div key={t} className="glass rounded-2xl p-6">
              <I size={22} className="text-[#00FF85] mb-4" />
              <h3 className="text-white font-light">{t}</h3>
              <p className="text-white/50 text-xs mt-1">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionTitle eyebrow="Inquiry" title="Let's build something." subtitle="Tell us about your project. Our partnerships team responds within 48 hours." />
          <form onSubmit={submit} className="glass rounded-3xl p-8 md:p-10 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input required value={form.company} onChange={e => change('company', e.target.value)} placeholder="Company *" className="bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
              <input value={form.name} onChange={e => change('name', e.target.value)} placeholder="Your name" className="bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
              <input required type="email" value={form.email} onChange={e => change('email', e.target.value)} placeholder="Email *" className="bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
              <input value={form.phone} onChange={e => change('phone', e.target.value)} placeholder="Phone" className="bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
            </div>
            <select value={form.volume} onChange={e => change('volume', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-[#00FF85]/50">
              <option value="">Estimated volume</option>
              <option>100 — 1,000 units</option>
              <option>1,000 — 10,000 units</option>
              <option>10,000 — 100,000 units</option>
              <option>100,000+ units</option>
            </select>
            <textarea value={form.message} onChange={e => change('message', e.target.value)} rows={4} placeholder="Tell us about your project" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
            <button disabled={submitting} className="w-full px-6 py-4 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition disabled:opacity-50 flex items-center justify-center gap-2">Submit Inquiry <ArrowRight size={14}/></button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
