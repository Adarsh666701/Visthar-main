'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('visthar_loaded')) { setShow(false); return; }
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / 2200) * 100));
    }, 30);
    const t = setTimeout(() => {
      sessionStorage.setItem('visthar_loaded', '1');
      setShow(false);
    }, 2400);
    return () => { clearTimeout(t); clearInterval(tick); };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[200] bg-[#030303] flex items-center justify-center overflow-hidden"
        >
          {/* radial glow */}
          <div className="absolute inset-0 radial-glow opacity-60" />
          <div className="absolute inset-0 grid-bg opacity-30" />
          {/* particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#00FF85] rounded-full"
              initial={{ x: Math.random() * 1400 - 700, y: Math.random() * 800 - 400, opacity: 0 }}
              animate={{ y: -400, opacity: [0, 1, 0] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-32 h-32 mb-8"
            >
              <div className="absolute inset-0 rounded-full bg-[#00FF85]/20 blur-3xl animate-pulse-ring" />
              <img src="/visthar-logo.png" alt="VISTHAR" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_40px_rgba(255,215,0,0.4)]" />
            </motion.div>
            <motion.div
              initial={{ letterSpacing: '0.5em', opacity: 0 }}
              animate={{ letterSpacing: '0.4em', opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-white text-2xl font-light tracking-[0.4em]"
            >
              VISTHAR
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-[#00FF85]/60 text-[10px] tracking-[0.5em] mt-3 uppercase"
            >
              Future of Smart Accessories
            </motion.div>
            <div className="mt-10 w-64 h-[1px] bg-white/10 overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-transparent via-[#00FF85] to-transparent" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 text-[10px] text-white/40 tracking-widest tabular-nums">{Math.floor(progress).toString().padStart(3, '0')}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
