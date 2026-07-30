"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Package, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  user: SupabaseUser | null;
  onLogout?: () => void;
  className?: string;
}

export function UserDropdown({ user, onLogout, className }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const emailDisplay = user.email ? user.email.split("@")[0] : "Account";

  const accountMenu = [
    {
      name: "My Orders",
      href: "/account/orders",
      icon: <Package className="w-4 h-4 text-primary" />,
    },
    {
      name: "Addresses",
      href: "/account/addresses",
      icon: <MapPin className="w-4 h-4 text-primary" />,
    },
  ];

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-btn text-sm font-semibold",
          "transition-all hover:bg-secondary/20",
          "border border-border/50 hover:border-border",
          "backdrop-blur-sm"
        )}
        aria-label="User Account Menu"
      >
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
          <User className="w-3.5 h-3.5" />
        </div>
        <span className="hidden sm:inline text-xs font-semibold max-w-[90px] truncate">
          {emailDisplay}
        </span>
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform text-muted-foreground",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute right-0 top-full mt-2 z-50",
                "w-56 p-2 rounded-card shadow-card-elevated",
                "bg-card/95 backdrop-blur-md border border-border"
              )}
            >
              {/* User Email Info Header */}
              <div className="px-3 py-2 mb-1 border-b border-border/40 rounded-t-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Signed in as
                </p>
                <p className="text-xs font-semibold text-foreground truncate mt-0.5">
                  {user.email}
                </p>
              </div>

              {/* Menu Links */}
              <div className="space-y-0.5">
                {accountMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-btn text-xs sm:text-sm font-medium",
                      "text-card-foreground hover:bg-secondary/20 transition-all"
                    )}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Logout Button */}
                <Link
                  href="/account/logout"
                  onClick={() => {
                    setIsOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-btn text-xs sm:text-sm font-medium",
                    "text-destructive hover:bg-destructive/10 transition-all border-t border-border/30 mt-1"
                  )}
                >
                  <LogOut className="w-4 h-4 text-destructive" />
                  <span>Logout</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
