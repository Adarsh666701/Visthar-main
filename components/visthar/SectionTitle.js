'use client';
import { motion } from 'framer-motion';

export default function SectionTitle({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'} max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
      {eyebrow && (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 mb-5">
          <span className="w-8 h-px bg-[#00FF85]" />
          <span className="text-[#00FF85] text-[11px] tracking-[0.4em] uppercase">{eyebrow}</span>
          <span className="w-8 h-px bg-[#00FF85]" />
        </motion.div>
      )}
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extralight text-gradient leading-[1.1] tracking-tight">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white/50 text-lg mt-6 leading-relaxed font-light">
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
