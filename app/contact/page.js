'use client';
import { useState, useEffect } from 'react';
import PageShell from '@/components/visthar/PageShell';
import SectionTitle from '@/components/visthar/SectionTitle';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import HeroAnimation from '@/components/visthar/HeroAnimation';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [s, setS] = useState({ email: 'hello@visthar.com', phone: '+91 — Coming soon', hq: 'Bengaluru, India' });
  useEffect(() => { fetch('/api/site-settings').then(r => r.json()).then(d => d.settings && setS(prev => ({ ...prev, ...d.settings }))).catch(() => {}); }, []);
  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { toast.success(data.message); setForm({ name: '', email: '', subject: '', message: '' }); }
    else toast.error(data.error || 'Error');
    setSubmitting(false);
  };
  return (
    <PageShell>
      <section className="relative pt-36 pb-16 px-6 overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00FF85]/8 blur-[160px] rounded-full" />
        <div className="absolute inset-0 opacity-50"><HeroAnimation variant="envelope" className="w-full h-full"/></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase mb-4">Contact</div>
          <h1 className="text-5xl md:text-8xl font-extralight leading-[1.02] mb-8"><span className="text-gradient">Say </span><span className="text-gradient-neon">hello.</span></h1>
          <p className="text-white/60 text-lg font-light">We read every message. Real responses within 24 hours.</p>
        </div>
      </section>
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Mail, t: 'Email', d: s.email },
            { icon: Phone, t: 'Phone', d: s.phone },
            { icon: MapPin, t: 'HQ', d: s.hq || s.address },
          ].map(({icon: I, t, d}) => (
            <div key={t} className="glass rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#00FF85]/10 flex items-center justify-center"><I size={18} className="text-[#00FF85]" /></div>
              <div><div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">{t}</div><div className="text-white text-sm mt-1">{d}</div></div>
            </div>
          ))}
        </div>
      </section>
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={submit} className="glass rounded-3xl p-8 md:p-10 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email *" className="bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
            </div>
            <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Subject" className="w-full bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
            <textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} placeholder="Message *" className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50" />
            <button disabled={submitting} className="w-full px-6 py-4 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition disabled:opacity-50 flex items-center justify-center gap-2">Send Message <ArrowRight size={14}/></button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
