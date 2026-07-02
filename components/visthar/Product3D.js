'use client';
import { motion } from 'framer-motion';

// Pure CSS+SVG cinematic reveal-teaser scene, themed per category.
// No Three.js required (avoids the R3F/React-18 reconciler bug).
// Sits on top of the blurred product image and gives a futuristic feel.

function Rings({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#00FF85]/40"
          style={{ inset: `${10 + i * 12}%` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 18 + i * 6, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </>
  );
}

function Orbits() {
  return (
    <>
      {[0, 90, 180, 270].map((deg, i) => (
        <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: i * 0.5 }} className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#00FF85] rounded-full shadow-[0_0_20px_#00FF85]" style={{ transform: `rotate(${deg}deg) translateX(120px) translate(-50%, -50%)` }} />
        </motion.div>
      ))}
    </>
  );
}

function Particles({ count = 14 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#00FF85] rounded-full"
          initial={{ x: Math.random() * 400 - 200, y: Math.random() * 400 - 200, opacity: 0 }}
          animate={{ y: [null, Math.random() * 400 - 200], opacity: [0, 1, 0] }}
          transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
        />
      ))}
    </>
  );
}

function EarbudsScene() {
  return (
    <>
      <Rings count={3} />
      <Particles count={10} />
      {/* Two earbuds floating */}
      <motion.div animate={{ y: [-8, 8, -8], x: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/2 left-[36%] -translate-y-1/2">
        <div className="relative">
          <div className="w-16 h-20 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-[#1a1a1a] via-[#080808] to-black border border-[#00FF85]/20 shadow-[0_0_40px_rgba(0,255,133,0.3)]"/>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00FF85] shadow-[0_0_15px_#00FF85] animate-pulse"/>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-2 h-12 bg-gradient-to-b from-[#1a1a1a] to-black rounded-full"/>
        </div>
      </motion.div>
      <motion.div animate={{ y: [8, -8, 8], x: [2, -2, 2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="absolute top-1/2 right-[36%] -translate-y-1/2">
        <div className="relative">
          <div className="w-16 h-20 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-[#1a1a1a] via-[#080808] to-black border border-[#00FF85]/20 shadow-[0_0_40px_rgba(0,255,133,0.3)]"/>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00FF85] shadow-[0_0_15px_#00FF85] animate-pulse"/>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-2 h-12 bg-gradient-to-b from-[#1a1a1a] to-black rounded-full"/>
        </div>
      </motion.div>
    </>
  );
}

function HeadphonesScene() {
  return (
    <>
      <Rings count={3} />
      <Particles count={10} />
      <motion.div animate={{ rotate: [-5, 5, -5], y: [-6, 6, -6] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 flex items-center justify-center">
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none" className="drop-shadow-[0_0_30px_rgba(0,255,133,0.4)]">
          <path d="M40 110 Q40 30 110 30 Q180 30 180 110" stroke="url(#h-grad)" strokeWidth="6" fill="none"/>
          <rect x="20" y="100" width="40" height="60" rx="18" fill="#0a0a0a" stroke="#00FF85" strokeWidth="1.5"/>
          <rect x="160" y="100" width="40" height="60" rx="18" fill="#0a0a0a" stroke="#00FF85" strokeWidth="1.5"/>
          <circle cx="40" cy="130" r="6" fill="#00FF85"/>
          <circle cx="180" cy="130" r="6" fill="#00FF85"/>
          <defs><linearGradient id="h-grad" x1="0" y1="0" x2="220" y2="0"><stop stopColor="#00FF85"/><stop offset="0.5" stopColor="#fff"/><stop offset="1" stopColor="#00FF85"/></linearGradient></defs>
        </svg>
      </motion.div>
    </>
  );
}

function SpeakerScene() {
  return (
    <>
      <Particles count={10} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-44 h-56 rounded-[36px] bg-gradient-to-b from-[#1a1a1a] via-[#0a0a0a] to-black border border-white/10 shadow-[0_0_50px_rgba(0,255,133,0.3)] overflow-hidden">
          <div className="absolute inset-x-4 top-4 h-32 rounded-3xl bg-black/80 flex items-center justify-center">
            {[0,1,2].map(i => (
              <motion.div key={i} animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} className="absolute w-20 h-20 rounded-full border-2 border-[#00FF85]"/>
            ))}
            <div className="w-10 h-10 rounded-full bg-[#00FF85] shadow-[0_0_30px_#00FF85]"/>
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {[0,1,2].map(i => <motion.div key={i} animate={{ height: [6, 16, 6] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} className="w-1 bg-[#00FF85] rounded-full"/>)}
          </div>
        </div>
      </div>
    </>
  );
}

function GlassesScene() {
  return (
    <>
      <Rings count={2} />
      <Particles count={10} />
      <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 flex items-center justify-center">
        <svg width="260" height="120" viewBox="0 0 260 120" fill="none" className="drop-shadow-[0_0_30px_rgba(0,255,133,0.5)]">
          <rect x="20" y="35" width="90" height="55" rx="20" fill="#0a0a0a" stroke="#00FF85" strokeWidth="2"/>
          <rect x="150" y="35" width="90" height="55" rx="20" fill="#0a0a0a" stroke="#00FF85" strokeWidth="2"/>
          <line x1="110" y1="60" x2="150" y2="60" stroke="#00FF85" strokeWidth="2"/>
          <circle cx="65" cy="62" r="3" fill="#00FF85"/>
          <circle cx="195" cy="62" r="3" fill="#00FF85"/>
        </svg>
      </motion.div>
      {/* HUD scan line */}
      <motion.div animate={{ y: ['-50%', '150%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00FF85] to-transparent"/>
    </>
  );
}

function ChargerScene() {
  return (
    <>
      <Particles count={10} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48 rounded-full bg-gradient-to-b from-[#1a1a1a] to-black border border-white/10 shadow-[0_0_50px_rgba(0,255,133,0.3)] flex items-center justify-center">
          {[0,1,2,3].map(i => (
            <motion.div key={i} animate={{ scale: [1, 2.2], opacity: [0.6, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6 }} className="absolute w-20 h-20 rounded-full border-2 border-[#00FF85]"/>
          ))}
          <div className="w-16 h-16 rounded-full bg-[#00FF85] shadow-[0_0_40px_#00FF85] flex items-center justify-center text-black font-bold text-2xl">⚡</div>
        </div>
      </div>
    </>
  );
}

function WearableScene() {
  return (
    <>
      <Rings count={2} />
      <Orbits />
      <Particles count={8} />
      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-32 h-40 rounded-[28px] bg-gradient-to-b from-[#1a1a1a] to-black border border-[#00FF85]/30 shadow-[0_0_40px_rgba(0,255,133,0.3)] flex items-center justify-center">
          <div className="w-20 h-28 rounded-2xl bg-black border border-[#00FF85]/20 flex flex-col items-center justify-center gap-1">
            <div className="text-[8px] text-[#00FF85] tracking-widest">VISTHAR</div>
            <div className="text-xl text-white font-light tabular-nums">12:42</div>
            <div className="text-[8px] text-[#00FF85]/60">HR 72 bpm</div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

const SCENES = {
  earbuds: EarbudsScene,
  headphones: HeadphonesScene,
  speakers: SpeakerScene,
  'ai-wearables': WearableScene,
  'ai-accessories': GlassesScene,
  chargers: ChargerScene,
  'fast-chargers': ChargerScene,
  cables: ChargerScene,
  'smart-devices': WearableScene,
  'future-products': GlassesScene,
};

export default function Product3D({ category = 'earbuds' }) {
  const Scene = SCENES[category] || EarbudsScene;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* core glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#00FF85]/15 blur-[80px] rounded-full"/>
      <Scene />
    </div>
  );
}
