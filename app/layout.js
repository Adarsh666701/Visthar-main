import './globals.css';
import LoadingScreen from '@/components/visthar/LoadingScreen';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/visthar/AuthContext';
import { CartProvider } from '@/components/visthar/CartContext';

export const metadata = {
  title: 'VISTHAR — Future of Smart Accessories',
  description: 'AI-powered, eco-conscious technology engineered for the next generation. Premium Indian innovation in smart audio, AI wearables, and intelligent accessories.',
  icons: { icon: '/visthar-logo.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#050505] text-white antialiased">
        <AuthProvider>
          <CartProvider>
            <LoadingScreen />
            {children}
            <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#0a0a0c', border: '1px solid rgba(0,255,133,0.2)', color: '#fff' } }} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
