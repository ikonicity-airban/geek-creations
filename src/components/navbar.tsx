"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Menu, X, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";

export const Navbar = ({
  darkMode,
  onToggleDarkMode,
}: {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const theme = useTheme();

  const resolvedDarkMode = darkMode ?? theme.darkMode;
  const resolvedToggle = onToggleDarkMode ?? theme.toggleDarkMode;

  const navLinks = [
    { href: "/collections/all", label: "Shop" },
    { href: "/collections/t-shirts", label: "T-Shirts" },
    { href: "/collections/hoodies", label: "Hoodies" },
    { href: "/collections/mugs", label: "Mugs" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-lg border-b transition-all"
      style={{
        backgroundColor: resolvedDarkMode
          ? 'rgba(15, 23, 42, 0.8)' 
          : 'rgba(64, 18, 104, 0.1)',
        borderColor: resolvedDarkMode
          ? 'rgba(197, 163, 255, 0.2)' 
          : '#401268'
      }}
    >
      <div className="max-w-[1024px] mx-auto px-8 md:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
            >
              <h1 
                className="text-xl md:text-2xl font-black"
                style={{ color: resolvedDarkMode ? '#f8f6f0' : '#401268' }}
              >
                GEEKS CREATION
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  className="font-semibold text-sm transition-colors"
                  style={{ 
                    color: resolvedDarkMode ? 'rgba(248, 246, 240, 0.8)' : 'rgba(64, 18, 104, 0.8)'
                  }}
                  whileHover={{ 
                    color: resolvedDarkMode ? '#c5a3ff' : '#c5a3ff'
                  }}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle (moved into header; no longer a fixed floating button) */}
            <motion.button
              type="button"
              className="p-2 rounded-full backdrop-blur-lg border transition-all"
              style={{
                backgroundColor: resolvedDarkMode
                  ? "rgba(197, 163, 255, 0.1)"
                  : "rgba(64, 18, 104, 0.1)",
                borderColor: resolvedDarkMode ? "#c5a3ff" : "#401268",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resolvedToggle}
              aria-label={resolvedDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {resolvedDarkMode ? (
                <Sun className="w-5 h-5" style={{ color: "#e2ae3d" }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: "#401268" }} />
              )}
            </motion.button>

            <Link href="/cart">
              <motion.button
                className="relative p-2 rounded-lg transition-all"
                style={{
                  color: resolvedDarkMode ? '#f8f6f0' : '#401268'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-5 h-5" />
                {cart?.item_count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: '#e21b35',
                      color: '#ffffff'
                    }}
                  >
                    {cart.item_count}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ color: resolvedDarkMode ? '#f8f6f0' : '#401268' }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t py-4"
            style={{
              borderColor: resolvedDarkMode
                ? 'rgba(197, 163, 255, 0.2)' 
                : 'rgba(64, 18, 104, 0.1)'
            }}
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  className="py-3 px-4 font-semibold text-sm"
                  style={{ 
                    color: resolvedDarkMode ? 'rgba(248, 246, 240, 0.8)' : 'rgba(64, 18, 104, 0.8)'
                  }}
                  whileHover={{ 
                    color: '#c5a3ff',
                    x: 4
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

