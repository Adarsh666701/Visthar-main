'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, Linkedin, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [s, setS] = useState({ email: 'hello@visthar.com', company: 'Vistharuio Electronics Private Limited', instagram: '#', twitter: '#', youtube: '#', linkedin: '#' });
  useEffect(() => { fetch('/api/site-settings').then(r => r.json()).then(d => d.settings && setS(prev => ({ ...prev, ...d.settings }))).catch(() => {}); }, []);
  const subscribe = async (e) => {
    e.preventDefault(); if (!email) return;
    await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    setDone(true); setEmail(''); setTimeout(() => setDone(false), 4000);
  };
  return (
    <footer className="relative bg-[#030303] border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#00FF85]/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#00FF85]/5 blur-3xl rounded-full" />
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6"><img src="/visthar-logo.png" className="w-12 h-12 object-contain" alt="VISTHAR" /><span className="text-white tracking-[0.3em] text-sm">VISTHAR</span></div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm">Engineering the future of smart accessories. AI-powered, eco-conscious, premium Indian innovation.</p>
            <form onSubmit={subscribe} className="relative max-w-sm">
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Get launch updates" className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 pr-14 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00FF85]/50" />
              <button className="absolute right-1 top-1 w-10 h-10 rounded-full bg-[#00FF85] text-black flex items-center justify-center hover:scale-105 transition"><Send size={14} /></button>
            </form>
            {done && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#00FF85] text-xs mt-2">Subscribed. Welcome to the future.</motion.p>}
          </div>
          {[
            { title: 'Products', links: [['Earbuds','/category/earbuds'],['Headphones','/category/headphones'],['AI Wearables','/category/ai-wearables'],['Chargers','/category/chargers'],['All Products','/products']] },
            { title: 'Company', links: [['About','/about'],['AI Innovation','/ai-innovation'],['V Green','/v-green'],['Future Lab','/future-lab'],['Careers','/careers']] },
            { title: 'Support', links: [['Contact','/contact'],['OEM & B2B','/oem'],['Shipping','/shipping'],['Returns','/refund'],['Privacy','/privacy']] },
          ].map(col => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="text-white text-xs tracking-[0.3em] uppercase mb-5">{col.title}</h4>
              <ul className="space-y-3">{col.links.map(([label, href]) => (<li key={href}><Link href={href} className="text-white/50 hover:text-[#00FF85] text-sm transition">{label}</Link></li>))}</ul>
            </div>
          ))}
          <div className="md:col-span-2">
            <h4 className="text-white text-xs tracking-[0.3em] uppercase mb-5">Connect</h4>
            <div className="flex gap-3 mb-4">
              {[[Instagram, s.instagram], [Twitter, s.twitter], [Youtube, s.youtube], [Linkedin, s.linkedin]].map(([Icon, href], i) => (
                <a key={i} href={href || '#'} className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/60 hover:text-[#00FF85] hover:border-[#00FF85]/40 transition"><Icon size={14} /></a>
              ))}
            </div>
            <p className="text-white/40 text-xs">{s.email}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
          <p className="text-white/30 text-xs">© {new Date().getFullYear()} {s.company}. All rights reserved.</p>
          <div className="flex gap-6 text-white/30 text-xs">
            <Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/shipping">Shipping</Link><Link href="/refund">Refund</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
