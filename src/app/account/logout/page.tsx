"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function AccountLogoutPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function performLogout() {
      try {
        await supabase.auth.signOut();
        // Redirect to homepage and refresh
        router.push("/");
        router.refresh();
      } catch (err) {
        console.error("Logout failed:", err);
        router.push("/");
      }
    }
    performLogout();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground font-semibold text-sm">
        Signing you out, see you soon! 👋
      </p>
    </div>
  );
}
