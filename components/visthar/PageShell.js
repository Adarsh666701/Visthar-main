'use client';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PageShell({ children, hideFooter = false }) {
  return (
    <>
      <Navbar />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="min-h-screen bg-[#050505] text-white">
        {children}
      </motion.main>
      {!hideFooter && <Footer />}
    </>
  );
}
