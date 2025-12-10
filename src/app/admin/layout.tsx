'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <main>{children}</main>
    </div>
  );
}