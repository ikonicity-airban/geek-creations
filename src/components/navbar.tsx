"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useState } from "react";
import {
  Home,
  Grid3x3,
  Wand2,
  MessageCircle,
  Info,
  ShoppingCart,
  Search,
  User,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  Navbar as ResizableNavbar,
  useNavbarVisibility,
} from "@/components/ui/resizable-navbar";
import { cn } from "@/lib/utils";
import { Logo } from "./ui/logo";

/* === BRAND COLORS (from client palette) === */
const COLORS = {
  primary: "#401268", // indigo-ink
  accent: "#c5a3ffff", // mauve
  light: "#f8f6f0", // porcelain
  bronze: "#e2ae3dff", // honey-bronze
  danger: "#e21b35", // scarlet-rush
  darkBg: "rgba(18, 18, 28, 0.9)",
  lightBg: "rgba(248, 246, 240, 0.95)",
};

/* === REUSABLE NAV ITEM WITH HOVER PILL === */
const NavItem = ({
  href,
  children,
  icon,
  hoverKey,
  currentHover,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  hoverKey: string;
  currentHover: string | null;
  onMouseEnter: (key: string) => void;
  onMouseLeave: () => void;
}) => (
  <Link
    href={href}
    onMouseEnter={() => onMouseEnter(hoverKey)}
    onMouseLeave={onMouseLeave}
    className="relative px-3 py-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200"
  >
    {currentHover === hoverKey && (
      <motion.span
        layoutId="nav-hover-pill"
        className="absolute inset-0 rounded-full bg-neutral-100 drop-shadow-2xl drop-shadow-mauve dark:bg-neutral-800"
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      {icon && (
        <span
          className={`transition-opacity duration-150 ${
            currentHover === hoverKey ? "opacity-100" : "opacity-0"
          }`}
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  </Link>
);

/* === DESKTOP NAVBAR CONTENT === */
const DesktopNavbarContent = () => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isDesignsOpen, setIsDesignsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const { cart } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();
  const isCondensed = useNavbarVisibility();

  const designsMenu = [
    { name: "Start designing now", href: "/editor" },
    { name: "All designs", href: "/designs" },
    { name: "T-Shirts", href: "/collections/t-shirts" },
    { name: "Hoodies", href: "/collections/hoodies" },
    { name: "Mugs", href: "/collections/mugs" },
    { name: "Phone Cases", href: "/collections/phone-cases" },
  ];

  const accountMenu = [
    { name: "My Orders", href: "/account/orders" },
    { name: "Addresses", href: "/account/addresses" },
    { name: "Login / Register", href: "/account" },
    { name: "Logout", href: "/account/logout" },
  ];

  return (
    <>
      {/* Logo */}
      <Link href="/" className="relative z-20 mr-6 flex items-center">
        <Logo />
      </Link>

      {/* Main Navigation */}
      <div className="hidden md:flex items-center gap-2">
        <NavItem
          href="/"
          hoverKey="home"
          currentHover={hoveredKey}
          onMouseEnter={setHoveredKey}
          onMouseLeave={() => setHoveredKey(null)}
        >
          <Home className="w-4 h-4" />
          Home
        </NavItem>

        {/* Designs Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => {
            setIsDesignsOpen(true);
            setHoveredKey("designs");
          }}
          onMouseLeave={() => {
            setIsDesignsOpen(false);
            setHoveredKey(null);
          }}
        >
          <button className="relative px-3 py-1.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-2">
            {hoveredKey === "designs" && (
              <motion.span
                layoutId="nav-hover-pill"
                className="absolute inset-0 rounded-full bg-neutral-100 dark:bg-neutral-800"
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              />
            )}
            <Grid3x3
              className={`w-4 h-4 transition-opacity ${
                hoveredKey === "designs" ? "opacity-100" : "opacity-0"
              }`}
            />
            <span className="relative z-10">Designs</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {isDesignsOpen && (
            <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-2">
              {designsMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <NavItem
          href="/editor"
          hoverKey="editor"
          currentHover={hoveredKey}
          onMouseEnter={setHoveredKey}
          onMouseLeave={() => setHoveredKey(null)}
        >
          <Wand2 className="w-4 h-4" />
          Editor
        </NavItem>

        <div
          className={cn(
            "flex items-center gap-2",
            isCondensed ? "hidden" : "flex"
          )}
        >
          <NavItem
            href="/contact"
            hoverKey="contact"
            currentHover={hoveredKey}
            onMouseEnter={setHoveredKey}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <MessageCircle className="w-4 h-4" />
            Contact us
          </NavItem>

          <NavItem
            href="/pages/about"
            hoverKey="about"
            currentHover={hoveredKey}
            onMouseEnter={setHoveredKey}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <Info className="w-4 h-4" />
            About
          </NavItem>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className={`relative transition-all duration-300 ${
            isCondensed ? "w-10" : "w-64"
          }`}
        >
          {!isCondensed && (
            <input
              type="text"
              placeholder="Search designs, products..."
              className="w-full rounded-full bg-white/90 dark:bg-neutral-900/90 px-4 py-2 pr-10 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-mauve"
              aria-label="Search"
            />
          )}
          <button
            className="absolute right-1 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-porcelain dark:bg-neutral-900 shadow-md"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full shadow-md"
          style={{ backgroundColor: darkMode ? COLORS.darkBg : COLORS.lightBg }}
          aria-label={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" style={{ color: COLORS.bronze }} />
          ) : (
            <Moon className="w-5 h-5" style={{ color: COLORS.primary }} />
          )}
        </button>

        {/* Cart */}
        <Link href="/cart" className="relative">
          <button
            className="p-2 rounded-full shadow-md"
            style={{ color: darkMode ? COLORS.light : COLORS.primary }}
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart?.item_count > 0 && (
              <span
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: COLORS.danger }}
              >
                {cart.item_count}
              </span>
            )}
          </button>
        </Link>

        {/* Account Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsAccountOpen(true)}
          onMouseLeave={() => setIsAccountOpen(false)}
        >
          <button
            className="p-2 rounded-full shadow-md"
            style={{
              backgroundColor: darkMode ? COLORS.darkBg : COLORS.lightBg,
            }}
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </button>
          {isAccountOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-2">
              {accountMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* === MOBILE NAVBAR CONTENT === */
const MobileNavbarContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const { darkMode, toggleDarkMode } = useTheme();

  const links = [
    { name: "Home", href: "/" },
    { name: "Designs", href: "/designs" },
    { name: "Editor", href: "/editor" },
    { name: "Contact us", href: "/contact" },
    { name: "About", href: "/pages/about" },
    { name: "Account", href: "/account" },
  ];

  const scaleMain = (open: boolean) => {
    const main = document.getElementById("main-content");
    if (!main) return;
    main.style.transition = "transform 0.3s ease, filter 0.3s ease";
    main.style.transform = open ? "scale(0.95)" : "scale(1)";
    main.style.filter = open ? "brightness(0.95)" : "brightness(1)";
  };

  const toggle = () => {
    setIsOpen((prev) => {
      scaleMain(!prev);
      return !prev;
    });
  };

  return (
    <MobileNav className="max-w-[1024px] px-6">
      <MobileNavHeader>
        <Link
          href="/"
          className="flex items-center text-lg font-black tracking-tight"
          style={{ color: darkMode ? COLORS.light : COLORS.primary }}
        >
          GEEKS CREATION
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative">
            <button
              className="p-2 rounded-full shadow-md"
              style={{ color: darkMode ? COLORS.light : COLORS.primary }}
            >
              <ShoppingCart className="w-5 h-5" />
              {cart?.item_count > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: COLORS.danger }}
                >
                  {cart.item_count}
                </span>
              )}
            </button>
          </Link>

          <button className="p-2 rounded-full shadow-md" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>

          <MobileNavToggle isOpen={isOpen} onClick={toggle} />
        </div>
      </MobileNavHeader>

      <MobileNavMenu
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          scaleMain(false);
        }}
      >
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                setIsOpen(false);
                scaleMain(false);
              }}
              className="rounded-md px-4 py-3 text-lg text-neutral-700 dark:text-neutral-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <button
          onClick={toggleDarkMode}
          className="mt-6 w-full rounded-md border py-3 text-sm font-bold"
          style={{
            backgroundColor: darkMode
              ? "rgba(197,163,255,0.1)"
              : "rgba(64,18,104,0.08)",
            borderColor: darkMode ? "rgba(197,163,255,0.25)" : COLORS.primary,
            color: darkMode ? COLORS.light : COLORS.primary,
          }}
        >
          {darkMode ? "Light mode" : "Dark mode"}
        </button>
      </MobileNavMenu>
    </MobileNav>
  );
};

/* === FINAL NAVBAR COMPONENT === */
export const Navbar = () => (
  <ResizableNavbar>
    <NavBody className="px-6">
      <DesktopNavbarContent />
    </NavBody>
    <MobileNavbarContent />
  </ResizableNavbar>
);
