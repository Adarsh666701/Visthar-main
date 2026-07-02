'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, User, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/future-lab', label: 'Future Lab' },
  { href: '/ai-innovation', label: 'AI Innovation' },
  { href: '/v-green', label: 'V Green' },
  { href: '/oem', label: 'OEM' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout } = useAuth() || {};
  const { count } = useCart() || { count: 0 };
  const router = useRouter();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const doLogout = async () => { await logout(); setUserMenu(false); router.push('/'); };

  return (
    <>
      <motion.nav initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 2.4 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark py-3' : 'py-5 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-[#00FF85]/20 blur-xl rounded-full group-hover:bg-[#00FF85]/40 transition" />
              <img src="/visthar-logo.png" alt="VISTHAR" className="relative w-full h-full object-contain" />
            </div>
            <span className="text-white font-medium tracking-[0.3em] text-sm hidden sm:block">VISTHAR</span>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} className="relative px-4 py-2 text-[13px] text-white/70 hover:text-white transition group">
                {l.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-[#00FF85] transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 relative">
            <Link href="/products" className="hidden md:flex w-9 h-9 rounded-full glass items-center justify-center text-white/70 hover:text-[#00FF85] transition"><Search size={15} /></Link>
            <Link href="/cart" className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/70 hover:text-[#00FF85] transition relative">
              <ShoppingBag size={15} />
              {count > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00FF85] text-black text-[9px] rounded-full flex items-center justify-center font-bold">{count}</span>}
            </Link>
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/70 hover:text-[#00FF85] transition"><User size={15}/></button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 top-12 w-56 glass-dark rounded-2xl p-2 z-50">
                      <div className="px-4 py-3 border-b border-white/5"><div className="text-white text-sm">{user.name || 'Member'}</div><div className="text-white/40 text-xs">{user.email}</div></div>
                      <Link href="/cart" onClick={()=>setUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-[#00FF85] hover:bg-white/5 rounded-lg"><ShoppingBag size={13}/> My cart</Link>
                      <button onClick={doLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-red-400 hover:bg-white/5 rounded-lg"><LogOut size={13}/> Sign out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="hidden md:inline-flex px-4 py-2 rounded-full glass text-xs text-white/80 hover:text-[#00FF85] tracking-wider">Sign in</Link>
            )}
            <button onClick={() => setOpen(true)} className="lg:hidden w-9 h-9 rounded-full glass flex items-center justify-center text-white"><Menu size={16} /></button>
          </div>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] glass-dark lg:hidden flex flex-col">
            <div className="flex justify-between items-center p-6">
              <img src="/visthar-logo.png" className="w-10 h-10 object-contain" alt="" />
              <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full glass flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 gap-1">
              {LINKS.map((l, i) => (
                <motion.div key={l.href} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <Link onClick={() => setOpen(false)} href={l.href} className="block text-3xl font-light text-white py-3 border-b border-white/5">{l.label}</Link>
                </motion.div>
              ))}
              {!user && <Link onClick={()=>setOpen(false)} href="/login" className="block text-3xl font-light text-[#00FF85] py-3 border-b border-white/5">Sign in</Link>}
              {user && <button onClick={()=>{doLogout();setOpen(false);}} className="block text-left text-3xl font-light text-[#00FF85] py-3">Sign out</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
