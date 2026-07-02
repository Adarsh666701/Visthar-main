'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MagneticButton({ children, href, variant = 'primary', onClick, type, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25 });
  };
  const onLeave = () => setPos({ x: 0, y: 0 });
  const styles = variant === 'primary'
    ? 'bg-[#00FF85] text-black hover:bg-white border-[#00FF85] hover:shadow-[0_0_40px_rgba(0,255,133,0.5)]'
    : 'bg-white/5 text-white border-white/20 hover:border-[#00FF85]/60 hover:bg-white/10 backdrop-blur-xl';

  const inner = (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.5 }}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border text-sm tracking-wider font-medium transition-all duration-300 cursor-pointer ${styles} ${className}`}
    >
      {children}
    </motion.span>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return <button onClick={onClick} type={type}>{inner}</button>;
}
