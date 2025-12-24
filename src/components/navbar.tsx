"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Grid3x3,
  Wand2,
  MessageCircle,
  Info,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "@/lib/cart-context";
import {
  MobileNav,
  NavBody,
  NavbarLogo,
  Navbar as ResizableNavbar,
  useNavbarVisibility,
} from "@/components/ui/resizable-navbar";
import { cn } from "@/lib/utils";
import { Logo } from "./ui/logo";
import { Button } from "./ui/button";
import { IconUserShield } from "@tabler/icons-react";
import { CurrencySwitcher, LanguageSwitcher } from "@/components/locale";
import { SearchTrigger } from "@/components/search";
import { ThemeToggle } from "@/components/theme";

/* === REUSABLE NAV ITEM WITH HOVER PILL === */
const NavItem = ({
  href,
  children,
  icon,
  hoverKey,
  currentHover,
  onMouseEnter,
  onMouseLeave,
  isCondensed,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  hoverKey: string;
  currentHover: string | null;
  onMouseEnter: (key: string) => void;
  onMouseLeave: () => void;
  isCondensed?: boolean;
}) => {
  return !isCondensed ? (
    <Link
      href={href}
      onMouseEnter={() => onMouseEnter(hoverKey)}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-foreground transition-smooth"
      )}
    >
      {currentHover === hoverKey && (
        <motion.span
          layoutId="nav-hover-pill"
          className="absolute inset-0 rounded-full bg-secondary/30 dark:bg-primary/30"
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
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
  ) : null;
};

/* === DESKTOP NAVBAR CONTENT === */
const DesktopNavbarContent = () => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isDesignsOpen, setIsDesignsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const { cart } = useCart();
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
      <NavbarLogo />

      {/* Main Navigation */}
      <div className="hidden md:flex items-center gap-1 lg:gap-2">
        <div className="flex items-center">
          <NavItem
            href="/"
            hoverKey="home"
            currentHover={hoveredKey}
            onMouseEnter={setHoveredKey}
            onMouseLeave={() => setHoveredKey(null)}
            icon={<Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
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
            <button className="relative px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5 sm:gap-2 transition-smooth">
              {hoveredKey === "designs" && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 rounded-full bg-secondary/30 dark:bg-primary/30"
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                />
              )}
              <Grid3x3
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-opacity ${
                  hoveredKey === "designs" ? "opacity-100" : "opacity-0"
                }`}
              />
              <span className="relative z-10">Designs</span>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {isDesignsOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 sm:w-56 rounded-btn border-hairline border-border bg-card shadow-card-elevated p-2 z-50">
                {designsMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-md px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-card-foreground hover:bg-accent hover:text-accent-foreground transition-smooth"
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
            isCondensed={isCondensed}
            icon={<Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          >
            Editor
          </NavItem>

          <div className="max-xl:hidden flex">
            <NavItem
              href="/contact"
              hoverKey="contact"
              currentHover={hoveredKey}
              onMouseEnter={setHoveredKey}
              onMouseLeave={() => setHoveredKey(null)}
              isCondensed={isCondensed}
              icon={<MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            >
              Contact us
            </NavItem>
          </div>

          <div className="max-xl:hidden flex">
            <NavItem
              href="/about"
              hoverKey="about"
              currentHover={hoveredKey}
              onMouseEnter={setHoveredKey}
              onMouseLeave={() => setHoveredKey(null)}
              isCondensed={isCondensed}
              icon={<Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            >
              About
            </NavItem>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Search */}
          <SearchTrigger variant="minimal" />

          {/* Currency Switcher */}
          <CurrencySwitcher variant="minimal" />

          {/* Language Switcher */}
          <LanguageSwitcher variant="minimal" />

          {/* Theme Toggle */}
          <ThemeToggle variant="minimal" />

          {/* Cart */}
          <Link href="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-muted text-foreground shadow-card hover:shadow-card-hover transition-smooth active:scale-95 hover:border border-accent"
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              {cart?.item_count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold text-primary-foreground dark:text-accent bg-destructive border border-background">
                  {cart.item_count}
                </span>
              )}
            </Button>
          </Link>

          {/* Account Dropdown */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
          >
            <Button
              variant={"ghost"}
              size={"icon"}
              className=" rounded-full bg-muted shadow-card hover:shadow-card-hover transition-smooth active:scale-95 hover:border border-accent"
              aria-label="Account"
            >
              <IconUserShield className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </Button>
            {isAccountOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 sm:w-52 rounded-btn border-hairline border-border bg-card shadow-card-elevated p-2 z-50">
                {accountMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-md px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-card-foreground hover:bg-accent transition-smooth"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* === MOBILE NAVBAR CONTENT === */
interface MobileLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const MobileNavbarContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();

  const links: MobileLink[] = [
    { name: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    {
      name: "Designs",
      href: "/designs",
      icon: <Grid3x3 className="w-5 h-5" />,
    },
    { name: "Editor", href: "/editor", icon: <Wand2 className="w-5 h-5" /> },
    {
      name: "Collections",
      href: "/collections",
      icon: <Grid3x3 className="w-5 h-5" />,
    },
    {
      name: "Contact us",
      href: "/contact",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    { name: "About", href: "/about", icon: <Info className="w-5 h-5" /> },
    { name: "Account", href: "/account", icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden flex items-center justify-between w-full px-4 sm:px-6 py-3 border-border">
      <Link href="/" className="flex items-center">
        <Logo />
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <SearchTrigger variant="icon-only" />

        <Link href="/cart" className="relative">
          <button
            className="p-2 rounded-full bg-muted text-foreground shadow-card active:scale-95 transition-smooth"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart?.item_count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-primary-foreground bg-destructive border border-background">
                {cart.item_count}
              </span>
            )}
          </button>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full bg-muted text-foreground shadow-card active:scale-95 transition-smooth"
          aria-label="Menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="fixed h-[95dvh] inset-0 bg-background z-50 flex flex-col rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
              <Logo />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-muted text-foreground hover:bg-accent transition-smooth"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-btn text-base font-medium text-foreground hover:bg-accent transition-smooth active:scale-[0.98]"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>

              {/* Locale & Theme Controls */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="px-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Preferences
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Search
                      </span>
                      <SearchTrigger variant="icon-only" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Currency
                      </span>
                      <CurrencySwitcher variant="minimal" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Language
                      </span>
                      <LanguageSwitcher variant="minimal" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Theme
                      </span>
                      <ThemeToggle variant="minimal" />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info / Login */}
              <div className="mt-4 p-4 rounded-btn bg-muted">
                <p className="text-sm text-muted-foreground mb-2">
                  Not logged in
                </p>
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="inline-block px-4 py-2 rounded-btn bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-smooth"
                >
                  Sign In / Register
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* === FINAL NAVBAR COMPONENT === */
export const Navbar = () => {
  return (
    <ResizableNavbar>
      <NavBody>
        <DesktopNavbarContent />
      </NavBody>
      <MobileNav>
        <MobileNavbarContent />
      </MobileNav>
    </ResizableNavbar>
  );
};
