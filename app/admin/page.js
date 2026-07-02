'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/visthar/AuthContext';
import { LayoutDashboard, Settings, Mail, Users, ShoppingBag, Briefcase, Send, LogOut, BellRing, Save, RefreshCw, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'settings', label: 'Contact Settings', icon: Settings },
  { id: 'prebookings', label: 'Pre-bookings', icon: BellRing },
  { id: 'oem', label: 'OEM Leads', icon: Briefcase },
  { id: 'contacts', label: 'Contact Messages', icon: Mail },
  { id: 'newsletter', label: 'Newsletter', icon: Send },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'users', label: 'Users', icon: Users },
];

export default function AdminPanel() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({ email: '', phone: '', address: '', hq: '', instagram: '', twitter: '', youtube: '', linkedin: '', company: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') router.push('/admin/login');
  }, [user, loading, router]);

  const loadStats = () => fetch('/api/admin/stats', { credentials: 'include' }).then(r => r.json()).then(setStats);
  const loadList = (id) => fetch(`/api/admin/${id}`, { credentials: 'include' }).then(r => r.json()).then(d => setItems(d.items || []));
  const loadSettings = () => fetch('/api/site-settings').then(r => r.json()).then(d => d.settings && setSettings(s => ({ ...s, ...d.settings })));

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    if (tab === 'dashboard') loadStats();
    else if (tab === 'settings') loadSettings();
    else loadList(tab);
  }, [tab, user]);

  const saveSettings = async () => {
    setBusy(true);
    const res = await fetch('/api/site-settings', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    if (res.ok) toast.success('Settings saved — live on the site.'); else toast.error('Failed to save');
    setBusy(false);
  };

  if (loading || !user || user.role !== 'admin') return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 glass-dark border-r border-white/5 flex flex-col p-5">
        <Link href="/" className="flex items-center gap-3 mb-10 px-2">
          <img src="/visthar-logo.png" className="w-10 h-10" alt="" />
          <div><div className="text-sm tracking-[0.3em]">VISTHAR</div><div className="text-[9px] text-[#00FF85] tracking-[0.3em]">ADMIN</div></div>
        </Link>
        <nav className="flex-1 space-y-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${tab === t.id ? 'bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/30' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <t.icon size={15}/> {t.label}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-white/5">
          <div className="px-3 py-2 text-xs text-white/60">{user.email}</div>
          <button onClick={() => { logout(); router.push('/'); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-white/5"><LogOut size={14}/> Sign out</button>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-[10px] text-[#00FF85] tracking-[0.4em] uppercase">Visthar Admin</div>
            <h1 className="text-4xl font-extralight text-gradient capitalize">{tab.replace('-', ' ')}</h1>
          </div>
          <button onClick={() => tab === 'dashboard' ? loadStats() : tab === 'settings' ? loadSettings() : loadList(tab)} className="glass rounded-full px-4 py-2 text-xs flex items-center gap-2 hover:border-[#00FF85]/40"><RefreshCw size={12}/> Refresh</button>
        </div>

        {tab === 'dashboard' && stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['Revenue', '₹' + (stats.revenue || 0).toLocaleString('en-IN'), IndianRupee, '#00FF85'],
              ['Orders', stats.orders, ShoppingBag, '#00FF85'],
              ['Users', stats.users, Users, '#00FF85'],
              ['Pre-bookings', stats.prebookings, BellRing, '#00FF85'],
              ['OEM Leads', stats.oem, Briefcase, '#00FF85'],
              ['Newsletter', stats.newsletter, Send, '#00FF85'],
              ['Contacts', stats.contact, Mail, '#00FF85'],
              ['Notify-Me', stats.notify, BellRing, '#00FF85'],
            ].map(([label, val, Icon]) => (
              <div key={label} className="glass rounded-2xl p-6">
                <Icon size={18} className="text-[#00FF85] mb-3"/>
                <div className="text-3xl font-light text-white tabular-nums">{val}</div>
                <div className="text-[10px] tracking-[0.2em] text-white/40 uppercase mt-2">{label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-4">
            <p className="text-white/50 text-sm mb-2">These settings auto-reflect in the website footer and contact page.</p>
            <div className="glass rounded-2xl p-6 space-y-4">
              {[
                ['company', 'Company legal name'],
                ['email', 'Contact email'],
                ['phone', 'Contact phone'],
                ['address', 'Address (short)'],
                ['hq', 'HQ display'],
                ['instagram', 'Instagram URL'],
                ['twitter', 'Twitter / X URL'],
                ['youtube', 'YouTube URL'],
                ['linkedin', 'LinkedIn URL'],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-[10px] text-white/40 tracking-[0.2em] uppercase block mb-2">{label}</label>
                  <input value={settings[key] || ''} onChange={e => setSettings({...settings, [key]: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-[#00FF85]/50"/>
                </div>
              ))}
              <button onClick={saveSettings} disabled={busy} className="w-full px-6 py-3 rounded-full bg-[#00FF85] text-black text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"><Save size={14}/> {busy ? 'Saving...' : 'Save Settings'}</button>
            </div>
          </motion.div>
        )}

        {!['dashboard','settings'].includes(tab) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
            {items.length === 0 ? <div className="p-10 text-center text-white/40 text-sm">No records yet.</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5">
                    <tr>{Object.keys(items[0]).filter(k => !['_id'].includes(k)).slice(0, 7).map(k => (<th key={k} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white/40 font-normal">{k}</th>))}</tr>
                  </thead>
                  <tbody>
                    {items.map((row, i) => (
                      <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02]">
                        {Object.keys(items[0]).filter(k => !['_id'].includes(k)).slice(0, 7).map(k => (<td key={k} className="px-4 py-3 text-white/70 max-w-[200px] truncate">{typeof row[k] === 'object' ? JSON.stringify(row[k]).slice(0, 50) : String(row[k] || '—').slice(0, 60)}</td>))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
