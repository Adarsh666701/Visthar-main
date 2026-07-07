'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import PageShell from '@/components/visthar/PageShell';
import { useAuth } from '@/components/visthar/AuthContext';
import { toast } from 'sonner';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneMasked, setPhoneMasked] = useState('');

  const sendOTP = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setPhoneMasked(data.phone_masked);
      setStep('otp');
      toast.success('OTP sent to your phone!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      // Store user data in local storage or auth context
      localStorage.setItem('auth_token', data.token);
      toast.success('Welcome to Visthar!');
      router.push('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell hideFooter>
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FF85]/10 blur-[160px] rounded-full" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          key={step}
          className="relative w-full max-w-md"
        >
          <div className="text-center mb-10">
            <img src="/visthar-logo.png" className="w-16 h-16 mx-auto mb-4" alt="VISTHAR" />
            <h1 className="text-4xl font-extralight text-gradient mb-2">
              {step === 'form' ? 'Create account' : 'Verify phone'}
            </h1>
            <p className="text-white/50 text-sm">
              {step === 'form'
                ? 'Join the future of smart accessories.'
                : `We sent a code to ${phoneMasked}`}
            </p>
          </div>

          {step === 'form' ? (
            <form onSubmit={sendOTP} className="glass rounded-3xl p-8 space-y-4">
              <div className="relative">
                <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50"
                />
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50"
                />
              </div>
              <div className="relative">
                <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1234567890"
                  className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50"
                />
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  required
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Password (6+ characters)"
                  className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FF85]/50"
                />
              </div>
              <button
                disabled={loading}
                className="w-full px-6 py-4 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'} <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOTP} className="glass rounded-3xl p-8 space-y-6">
              <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center text-4xl tracking-widest bg-transparent text-white placeholder:text-white/20 focus:outline-none font-mono"
                />
              </div>
              <p className="text-center text-sm text-white/50">
                Enter the 6-digit code sent to your phone
              </p>
              <div className="space-y-3">
                <button
                  disabled={loading || otp.length !== 6}
                  className="w-full px-6 py-4 rounded-full bg-[#00FF85] text-black text-sm font-medium hover:shadow-[0_0_30px_rgba(0,255,133,0.5)] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign Up'} <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setOtp('');
                  }}
                  className="w-full px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </form>
          )}
        </motion.div>
        <div className="absolute bottom-10 left-0 right-0 text-center text-sm text-white/50">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00FF85] hover:underline">
            Sign in
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
