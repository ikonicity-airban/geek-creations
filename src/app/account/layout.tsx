"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Sparkles,
  LogOut,
  Menu,
  X,
  Bell,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, ThemeProvider } from "@/lib/theme-context";
import { MerchandiseDoodleBackground } from "@/components/auth/merchandise-doodle-bg";
import { CurrencySwitcher } from "@/components/locale/currency-switcher";
import { LanguageSwitcher } from "@/components/locale/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AccountLayoutContent>{children}</AccountLayoutContent>
    </ThemeProvider>
  );
}

function AccountLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode } = useTheme();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          const currentUrl = encodeURIComponent(window.location.pathname);
          router.push(`/login?redirect=${currentUrl}`);
        } else {
          setUser(session.user);
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const menuItems = [
    {
      name: "Overview",
      href: "/account",
      icon: LayoutDashboard,
    },
    {
      name: "My Orders",
      href: "/account/orders",
      icon: ShoppingBag,
    },
    {
      name: "Profile & Addresses",
      href: "/account/addresses",
      icon: MapPin,
    },
    {
      name: "Launch Customizer",
      href: "/editor",
      icon: Sparkles,
      external: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium text-sm">
          Securing your dashboard...
        </p>
      </div>
    );
  }

  if (!user) return null;

  const userInitials =
    user.user_metadata?.display_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ||
    user.email?.substring(0, 2).toUpperCase() ||
    "GK";

  const displayName = user.user_metadata?.display_name || user.email || "Geek User";

  // Page title mapping for desktop topbar
  const currentPageTitle =
    menuItems.find((item) => item.href === pathname)?.name || "Dashboard";

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-3">
      {/* Top Part: Header + Profile + Scrollable Nav */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Brand Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-lg font-black bg-clip-text text-transparent bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              GEEK CREATIONS
            </span>
          </Link>
          <button
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Quick Pill */}
        <div className="p-3.5 my-3 bg-card/60 backdrop-blur-xs flex items-center gap-3 rounded-2xl border border-border/50 shadow-xs shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-black text-xs flex items-center justify-center shadow-md">
            {userInitials}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-foreground text-xs truncate">{displayName}</p>
            <span className="text-[10px] text-muted-foreground">Geek Member 🔥</span>
          </div>
        </div>

        {/* ScrollArea for Navigation Items */}
        <ScrollArea className="flex-1 pr-1">
          <nav className="py-2 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-xs transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/95"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                  onClick={() => {
                    if (!item.external) setMobileMenuOpen(false);
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </div>

      {/* Logout Link Pinned at Absolute Bottom */}
      <div className="pt-3 pb-1 border-t border-border/50 shrink-0 mt-auto">
        <Link
          href="/account/logout"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors w-full"
          onClick={() => setMobileMenuOpen(false)}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen md:h-screen md:max-h-screen flex flex-col md:flex-row relative bg-background overflow-x-hidden md:overflow-hidden">
      {/* Dynamic Brand Background with Dark Mode overlay & Merchandise Doodles */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-all duration-300 z-0 bg-[url('/img/brand-bg-light.png')] dark:bg-[url('/img/brand-bg-dark.png')]"
      />
      {/* Readability Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300 z-0 bg-[rgba(248,246,240,0.92)] dark:bg-[rgba(1,1,16,0.92)]"
      />
      {/* Merchandise Artwork Doodles */}
      <MerchandiseDoodleBackground />

      {/* Mobile Top Navigation Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-card border-b border-border sticky top-0 z-40 w-full shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-lg font-black text-primary"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            GEEK CREATIONS
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-foreground hover:bg-muted rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Left Fixed Desktop Sidebar (Pinned fixed left-4 top-4 bottom-4) */}
      <aside className="hidden md:flex flex-col fixed left-4 top-4 bottom-4 w-72 z-30 rounded-3xl border border-border/70 bg-card/75 backdrop-blur-md shadow-xl overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar - Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Body */}
          <aside className="relative flex flex-col w-80 max-w-[85vw] h-full bg-card border-r border-border shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area wrapped in Coss UI ScrollArea */}
      <ScrollArea className="flex-1 min-h-screen md:h-screen md:ml-80 relative z-10 w-full">
        <div className="flex flex-col min-h-full p-4 md:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {/* Floating Desktop Topbar Header */}
          <header className="hidden md:flex items-center justify-between px-6 py-3 rounded-2xl bg-card/75 backdrop-blur-md border border-border/70 shadow-md mb-6 relative z-20 shrink-0">
            {/* Left Title Context */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                Dashboard
              </span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs font-extrabold text-foreground">
                {currentPageTitle}
              </span>
            </div>

            {/* Right Actions: Currency, Language, Theme, Notifications & Account Pill */}
            <div className="flex items-center gap-2 sm:gap-3">
              <CurrencySwitcher variant="minimal" />
              <LanguageSwitcher variant="minimal" />
              <ThemeToggle variant="minimal" />

              <div className="h-4 w-px bg-border/60 mx-0.5" />

              {/* Notifications Trigger */}
              <button
                className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </button>

              {/* User Account Avatar Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-border/60">
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-black text-[11px] flex items-center justify-center shadow-xs">
                  {userInitials}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-foreground truncate max-w-[110px]">
                    {displayName}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Content Body */}
          <main className="flex-1 w-full pb-8">{children}</main>
        </div>
      </ScrollArea>
    </div>
  );
}
