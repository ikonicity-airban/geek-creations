"use client";

import Link from "next/link";
import { useState } from "react";
import { Moon, ShoppingCart, Sun, User, Search, ChevronDown } from "lucide-react";
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
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { cart } = useCart();
  const theme = useTheme();

  const resolvedDarkMode = theme.darkMode;
  const resolvedToggle = theme.toggleDarkMode;

  const shopItems = [
    { name: "All Designs", link: "/designs" },
    { name: "T-Shirts", link: "/collections/t-shirts" },
    { name: "Hoodies", link: "/collections/hoodies" },
    { name: "Mugs", link: "/collections/mugs" },
    { name: "Phone Cases", link: "/collections/phone-cases" },
  ];

  const accountItems = [
    { name: "My Orders", link: "/account/orders" },
    { name: "Addresses", link: "/account/addresses" },
    { name: "Login / Register", link: "/account" },
    { name: "Logout", link: "/account/logout" },
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

        <div className="hidden md:flex items-center gap-4">
          {/* Shop Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsShopOpen(true)}
            onMouseLeave={() => setIsShopOpen(false)}
          >
            <button className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              Shop <ChevronDown className="w-4 h-4" />
            </button>
            {isShopOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-2">
                {shopItems.map((item) => (
                  <Link
                    key={item.link}
                    href={item.link}
                    className="block rounded-md px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* About */}
          <Link
            href="/pages/about"
            className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:text-[#401268] dark:hover:text-[#c5a3ff]"
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Search placeholder */}
          <button
            type="button"
            className="relative z-20 p-2 rounded-full backdrop-blur-lg border transition-all"
            style={{
              backgroundColor: resolvedDarkMode
                ? "rgba(197, 163, 255, 0.1)"
                : "rgba(64, 18, 104, 0.1)",
              borderColor: resolvedDarkMode ? "#c5a3ff" : "#401268",
            }}
            aria-label="Search (coming soon)"
          >
            <Search className="w-5 h-5" />
          </button>

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

          {/* Account dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
          >
            <button
              type="button"
              className="relative z-20 p-2 rounded-full backdrop-blur-lg border transition-all"
              style={{
                backgroundColor: resolvedDarkMode
                  ? "rgba(197, 163, 255, 0.1)"
                  : "rgba(64, 18, 104, 0.1)",
                borderColor: resolvedDarkMode ? "#c5a3ff" : "#401268",
              }}
              aria-label="Account menu"
            >
              <User className="w-5 h-5" />
            </button>
            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-2">
                {accountItems.map((item) => (
                  <Link
                    key={item.link}
                    href={item.link}
                    className="block rounded-md px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
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

            <button
              type="button"
              className="relative p-2 rounded-full backdrop-blur-lg border transition-all"
              style={{
                backgroundColor: resolvedDarkMode
                  ? "rgba(197, 163, 255, 0.1)"
                  : "rgba(64, 18, 104, 0.1)",
                borderColor: resolvedDarkMode ? "#c5a3ff" : "#401268",
              }}
              aria-label="Search (coming soon)"
            >
              <Search className="w-5 h-5" />
            </button>

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
            {/* Shop dropdown links (flattened for mobile) */}
            <a
              href="/collections/all"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative rounded-md px-2 py-2 text-neutral-700 dark:text-neutral-200"
            >
              Shop
            </a>
            {shopItems.map((item, idx) => (
              <a
                key={`mobile-shop-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative rounded-md px-2 py-2 text-neutral-600 dark:text-neutral-300 text-sm"
              >
                {item.name}
              </a>
            ))}

            <a
              href="/pages/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative rounded-md px-2 py-2 text-neutral-700 dark:text-neutral-200"
            >
              About
            </a>

            <a
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative rounded-md px-2 py-2 text-neutral-700 dark:text-neutral-200"
            >
              Cart
            </a>

            <a
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative rounded-md px-2 py-2 text-neutral-700 dark:text-neutral-200"
            >
              Account
            </a>
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
