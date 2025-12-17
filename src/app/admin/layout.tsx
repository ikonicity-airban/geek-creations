'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Shield, LogOut, Instagram, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/admin/login');
      return;
    }

    // Check if user is admin (geekcreations.com or codeoven.tech email)
    const userEmail = session.user.email || '';
    const isAdmin = 
      userEmail.endsWith('@geekcreations.com') ||
      userEmail.endsWith('@codeoven.tech') ||
      userEmail === 'admin@geekscreation.com';

    if (!isAdmin) {
      await supabase.auth.signOut();
      router.push('/admin/login');
      return;
    }

    setEmail(userEmail);
    setIsAuthenticated(true);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-indigo-500 animate-pulse" />
          <p className="text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-indigo-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                GEEKS CREATION ADMIN
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Logged in as: {email}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut} size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Admin Content */}
      <main className="min-h-[calc(100vh-200px)]">{children}</main>

      {/* Admin Footer with Gradient */}
      <footer 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #401268 0%, #c5a3ff 50%, #e2ae3d 100%)'
        }}
      >
        {/* Animated Gloss/Shimmer Effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              'linear-gradient(90deg, transparent 100%, rgba(255,255,255,0.1) 50%, transparent 0%)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundPosition: '200% 0',
          }}
        />
        
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Glow Orbs */}
        <div 
          className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-50"
          style={{ backgroundColor: 'rgba(197, 163, 255, 0.3)' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-50"
          style={{ backgroundColor: 'rgba(226, 174, 61, 0.3)' }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <motion.h3 
                className="text-2xl font-black mb-4 text-white relative"
                style={{
                  textShadow: '0 0 20px rgba(197, 163, 255, 0.5), 0 0 40px rgba(197, 163, 255, 0.3)'
                }}
                whileHover={{
                  textShadow: '0 0 30px rgba(197, 163, 255, 0.8), 0 0 60px rgba(197, 163, 255, 0.5)',
                  scale: 1.02,
                }}
                transition={{ duration: 0.3 }}
              >
                GEEKS
                <br />
                CREATION
              </motion.h3>
              <p className="text-white/80 text-sm mb-4">
                Made by nerds. Worn by legends.
              </p>
              <div className="flex gap-4">
                <motion.a
                  href="https://instagram.com/geekcreations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 0 20px rgba(197, 163, 255, 0.6), 0 0 40px rgba(197, 163, 255, 0.3)',
                  }}
                  style={{
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Instagram className="w-5 h-5 text-white" />
                </motion.a>
                <motion.a
                  href="https://twitter.com/geekcreations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 0 20px rgba(197, 163, 255, 0.6), 0 0 40px rgba(197, 163, 255, 0.3)',
                  }}
                  style={{
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>
                Platform
              </h4>
              <ul className="space-y-2">
                {['Start Selling', 'Products', 'Pricing', 'Features'].map((item) => (
                  <motion.li
                    key={item}
                    className="text-white/70 cursor-pointer text-sm relative"
                    whileHover={{
                      color: '#ffffff',
                      x: 4,
                      textShadow: '0 0 8px rgba(197, 163, 255, 0.6)',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>
                Resources
              </h4>
              <ul className="space-y-2">
                {['Documentation', 'Design Guide', 'Blog', 'Support'].map((item) => (
                  <motion.li
                    key={item}
                    className="text-white/70 cursor-pointer text-sm relative"
                    whileHover={{
                      color: '#ffffff',
                      x: 4,
                      textShadow: '0 0 8px rgba(197, 163, 255, 0.6)',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>
                Company
              </h4>
              <ul className="space-y-2">
                {['About Us', 'Contact', 'Terms', 'Privacy'].map((item) => (
                  <motion.li
                    key={item}
                    className="text-white/70 cursor-pointer text-sm relative"
                    whileHover={{
                      color: '#ffffff',
                      x: 4,
                      textShadow: '0 0 8px rgba(197, 163, 255, 0.6)',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="pt-8 border-t text-center relative"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <motion.p 
              className="text-white/70 text-sm"
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              © 2025 Geeks Creation. All rights reserved. Powered by CodeOven 🔥
            </motion.p>
          </div>
        </div>
      </footer>
    </div>
  );
}