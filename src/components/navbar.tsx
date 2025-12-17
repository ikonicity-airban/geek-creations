"use client";

import Link from "next/link";
import { useState } from "react";
import { Moon, ShoppingCart, Sun } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  NavItems,
  Navbar as ResizableNavbar,
} from "@/components/ui/resizable-navbar";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const theme = useTheme();

  const resolvedDarkMode = theme.darkMode;
  const resolvedToggle = theme.toggleDarkMode;

  const navItems = [
    { name: "Shop", link: "/collections/all" },
    { name: "T-Shirts", link: "/collections/t-shirts" },
    { name: "Hoodies", link: "/collections/hoodies" },
    { name: "Mugs", link: "/collections/mugs" },
  ];

  return (
    <ResizableNavbar>
      {/* Desktop */}
      <NavBody className="px-6">
        <Link
          href="/"
          className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
        >
          <span
            className="text-lg md:text-xl font-black tracking-tight"
            style={{ color: resolvedDarkMode ? "#f8f6f0" : "#401268" }}
          >
            GEEKS CREATION
          </span>
        </Link>

        <NavItems items={navItems} />

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative z-20 p-2 rounded-full backdrop-blur-lg border transition-all"
            style={{
              backgroundColor: resolvedDarkMode
                ? "rgba(197, 163, 255, 0.1)"
                : "rgba(64, 18, 104, 0.1)",
              borderColor: resolvedDarkMode ? "#c5a3ff" : "#401268",
            }}
            onClick={resolvedToggle}
            aria-label={
              resolvedDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {resolvedDarkMode ? (
              <Sun className="w-5 h-5" style={{ color: "#e2ae3d" }} />
            ) : (
              <Moon className="w-5 h-5" style={{ color: "#401268" }} />
            )}
          </button>

          <Link href="/cart" className="relative z-20">
            <button
              type="button"
              className="relative p-2 rounded-lg transition-all"
              style={{ color: resolvedDarkMode ? "#f8f6f0" : "#401268" }}
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {!!cart?.item_count && cart.item_count > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: "#e21b35", color: "#ffffff" }}
                >
                  {cart.item_count}
                </span>
              )}
            </button>
          </Link>
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav className="max-w-[1024px] px-6">
        <MobileNavHeader>
          <Link
            href="/"
            className="mr-2 flex items-center px-2 py-1 text-sm font-normal"
          >
            <span
              className="text-lg font-black tracking-tight"
              style={{ color: resolvedDarkMode ? "#f8f6f0" : "#401268" }}
            >
              GEEKS CREATION
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative">
              <button
                type="button"
                className="relative p-2 rounded-lg transition-all"
                style={{ color: resolvedDarkMode ? "#f8f6f0" : "#401268" }}
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {!!cart?.item_count && cart.item_count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: "#e21b35", color: "#ffffff" }}
                  >
                    {cart.item_count}
                  </span>
                )}
              </button>
            </Link>

            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex w-full flex-col gap-2">
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative rounded-md px-2 py-2 text-neutral-700 dark:text-neutral-200"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
          </div>

          <button
            type="button"
            className="mt-2 w-full rounded-md border px-4 py-2 text-sm font-bold"
            style={{
              backgroundColor: resolvedDarkMode
                ? "rgba(197, 163, 255, 0.1)"
                : "rgba(64, 18, 104, 0.08)",
              borderColor: resolvedDarkMode
                ? "rgba(197, 163, 255, 0.25)"
                : "#401268",
              color: resolvedDarkMode ? "#f8f6f0" : "#401268",
            }}
            onClick={() => {
              resolvedToggle();
              setIsMobileMenuOpen(false);
            }}
          >
            {resolvedDarkMode ? "Light mode" : "Dark mode"}
          </button>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
};
