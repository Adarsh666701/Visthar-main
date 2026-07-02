'use client';
import { motion } from 'framer-motion';

// Unique signature animations for each page hero.
// Pure CSS + SVG + Framer Motion. Lightweight. No Three.js.

const NeuralNet = () => {
  const nodes = [
    { x: 20, y: 30 }, { x: 50, y: 20 }, { x: 80, y: 35 },
    { x: 30, y: 60 }, { x: 60, y: 55 }, { x: 85, y: 70 },
    { x: 20, y: 85 }, { x: 50, y: 80 }, { x: 75, y: 90 },
  ];
  const links = [[0,1],[1,2],[0,3],[1,3],[1,4],[2,4],[2,5],[3,4],[3,6],[4,5],[4,7],[5,8],[6,7],[7,8]];
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
      {links.map(([a,b], i) => (
        <motion.line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="#00FF85" strokeWidth="0.15" strokeOpacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }} />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.x} cy={n.y} r="1" fill="#00FF85" animate={{ r: [0.8, 1.6, 0.8], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2 + (i%3), repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </svg>
  );
};

const GeometricShape = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div animate={{ rotateY: 360, rotateX: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} style={{ transformStyle: 'preserve-3d' }} className="relative w-64 h-64">
      {/* faces */}
      {[
        { t: 'translateZ(80px)', bg: 'rgba(0,255,133,0.06)' },
        { t: 'translateZ(-80px)', bg: 'rgba(0,255,133,0.04)' },
        { t: 'rotateY(90deg) translateZ(80px)', bg: 'rgba(0,255,133,0.05)' },
        { t: 'rotateY(-90deg) translateZ(80px)', bg: 'rgba(0,255,133,0.05)' },
        { t: 'rotateX(90deg) translateZ(80px)', bg: 'rgba(0,255,133,0.03)' },
        { t: 'rotateX(-90deg) translateZ(80px)', bg: 'rgba(0,255,133,0.03)' },
      ].map((f, i) => (
        <div key={i} className="absolute inset-0 border border-[#00FF85]/40" style={{ transform: f.t, background: f.bg, boxShadow: '0 0 30px rgba(0,255,133,0.2)' }} />
      ))}
    </motion.div>
  </div>
);

const Globe = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative w-72 h-72">
      <div className="absolute inset-0 rounded-full border border-[#00FF85]/30 animate-pulse"/>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute inset-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="50" rx="48" ry="14" fill="none" stroke="#00FF85" strokeWidth="0.4" strokeOpacity="0.4"/>
          <ellipse cx="50" cy="50" rx="48" ry="28" fill="none" stroke="#00FF85" strokeWidth="0.4" strokeOpacity="0.3"/>
          <ellipse cx="50" cy="50" rx="48" ry="42" fill="none" stroke="#00FF85" strokeWidth="0.4" strokeOpacity="0.2"/>
          <ellipse cx="50" cy="50" rx="14" ry="48" fill="none" stroke="#00FF85" strokeWidth="0.4" strokeOpacity="0.4"/>
          <ellipse cx="50" cy="50" rx="28" ry="48" fill="none" stroke="#00FF85" strokeWidth="0.4" strokeOpacity="0.3"/>
        </svg>
      </motion.div>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear', delay: i * 0.3 }} className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-[#00FF85] rounded-full shadow-[0_0_12px_#00FF85]" style={{ transform: `rotate(${deg}deg) translateX(140px) translate(-50%, -50%)` }}/>
        </motion.div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-[#00FF85]/20 blur-2xl"/>
      </div>
    </div>
  </div>
);

const Envelope = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="relative">
      <svg width="220" height="140" viewBox="0 0 220 140" fill="none" className="drop-shadow-[0_0_30px_rgba(0,255,133,0.4)]">
        <rect x="10" y="20" width="200" height="110" rx="12" fill="#0a0a0a" stroke="#00FF85" strokeWidth="1.5"/>
        <path d="M10 30 L110 90 L210 30" stroke="#00FF85" strokeWidth="1.5" fill="none"/>
        <circle cx="180" cy="50" r="4" fill="#00FF85" className="animate-pulse"/>
      </svg>
    </motion.div>
    {[...Array(6)].map((_, i) => (
      <motion.div key={i} className="absolute w-1 h-1 bg-[#00FF85] rounded-full" initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: (Math.random()-0.5)*400, y: -200, opacity: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }} />
    ))}
  </div>
);

const CareerOrbits = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    {[1, 2, 3].map((r, i) => (
      <motion.div key={i} animate={{ rotate: i % 2 === 0 ? 360 : -360 }} transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }} className="absolute rounded-full border border-[#00FF85]/30" style={{ width: 150 + r * 60, height: 150 + r * 60 }}>
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#00FF85] rounded-full shadow-[0_0_15px_#00FF85]"/>
      </motion.div>
    ))}
    <div className="w-20 h-20 rounded-full bg-[#00FF85]/30 blur-2xl"/>
    <div className="absolute w-12 h-12 rounded-full bg-[#00FF85] flex items-center justify-center text-black font-bold">V</div>
  </div>
);

const LeafGrid = () => (
  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-2 opacity-50">
    {[...Array(24)].map((_, i) => (
      <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }} transition={{ duration: 3, repeat: Infinity, delay: (i % 6) * 0.2 + Math.floor(i/6) * 0.1 }} className="w-full h-full flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-[#00FF85]/40"/>
      </motion.div>
    ))}
  </div>
);

const Waveform = () => (
  <div className="absolute inset-0 flex items-center justify-center gap-1">
    {[...Array(24)].map((_, i) => (
      <motion.div key={i} animate={{ height: ['10%', '70%', '10%'] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.05, ease: 'easeInOut' }} className="w-1.5 bg-gradient-to-t from-[#00FF85]/30 to-[#00FF85] rounded-full"/>
    ))}
  </div>
);

const VARIANTS = { neural: NeuralNet, geometric: GeometricShape, globe: Globe, envelope: Envelope, orbits: CareerOrbits, leafgrid: LeafGrid, waveform: Waveform };

export default function HeroAnimation({ variant = 'geometric', className = '' }) {
  const Scene = VARIANTS[variant] || GeometricShape;
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-[#00FF85]/10 blur-[80px] rounded-full"/>
      <Scene />
    </div>
  );
}
