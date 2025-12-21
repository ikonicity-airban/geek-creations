"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const isLoginPage = pathname === "/admin/login";

  const checkAuth = useCallback(async () => {
    // Skip auth check on login page
    if (isLoginPage) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      setLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        router.push("/admin/login");
        return;
      }

      if (!session) {
        setLoading(false);
        router.push("/admin/login");
        return;
      }

      // Check if user is admin (geekcreations.com or codeoven.tech email)
      const userEmail = session.user.email || "";
      const isAdmin =
        userEmail.endsWith("@geekcreations.com") ||
        userEmail.endsWith("@codeoven.tech") ||
        userEmail === "admin@geekscreation.com";

      if (!isAdmin) {
        await supabase.auth.signOut();
        setLoading(false);
        router.push("/admin/login");
        return;
      }

      setEmail(userEmail);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error("Error in checkAuth:", error);
      setLoading(false);
      router.push("/admin/login");
    }
  }, [router, supabase, isLoginPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void checkAuth();

    // Only set up auth listener if not on login page
    if (!isLoginPage) {
      // Listen for auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          void checkAuth();
        } else {
          setLoading(false);
          setIsAuthenticated(false);
          router.push("/admin/login");
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [checkAuth, router, supabase, isLoginPage]);

  // If on login page, render children directly without auth check
  if (isLoginPage) {
    return <>{children}</>;
  }

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
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 md:flex-row",
        "h-screen"
      )}
    >
      <AdminSidebar email={email} />
      <div className="flex flex-1 overflow-y-auto bg-white dark:bg-gray-900">
        <main className="flex h-full w-full flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
