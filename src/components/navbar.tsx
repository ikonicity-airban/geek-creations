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
  Search,
  User,
  Moon,
  Sun,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCart } from "@/lib/cart-context";
import { useTheme } from "@/lib/theme-context";
import {
  MobileNav,
  NavBody,
  Navbar as ResizableNavbar,
  useNavbarVisibility,
} from "@/components/ui/resizable-navbar";
import { cn } from "@/lib/utils";
import { Logo } from "./ui/logo";
import { Button } from "./ui/button";
import { IconUserShield } from "@tabler/icons-react";

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
    className="relative px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-foreground transition-smooth"
  >
    {currentHover === hoverKey && (
      <motion.span
        layoutId="nav-hover-pill"
        className="absolute inset-0 rounded-full bg-secondary/20 dark:bg-secondary/30"
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
      <Link
        href="/"
        className="relative z-20 mr-2 sm:mr-4 md:mr-6 flex items-center"
      >
        <Logo />
      </Link>

      {/* Main Navigation */}
      <div className="hidden md:flex items-center gap-1 lg:gap-2">
        <div className="flex items-center">
          <NavItem
            href="/"
            hoverKey="home"
            currentHover={hoveredKey}
            onMouseEnter={setHoveredKey}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                  className="absolute inset-0 rounded-full bg-secondary/20 dark:bg-secondary/30"
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
                    className="block rounded-md px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-card-foreground hover:bg-accent transition-smooth"
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
            <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Contact us
            </NavItem>

            <NavItem
              href="/about"
              hoverKey="about"
              currentHover={hoveredKey}
              onMouseEnter={setHoveredKey}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              About
            </NavItem>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Search */}
          <div
            className={`relative transition-all duration-300 ${
              isCondensed ? "w-10" : "w-64"
            }`}
          >
            {!isCondensed && (
              <input
                type="text"
                placeholder="Search..."
                className="w-48 lg:w-64 rounded-full bg-muted px-3 py-1.5 sm:px-4 sm:py-2 pr-9 sm:pr-10 text-xs sm:text-sm border-hairline border-border focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                aria-label="Search"
              />
            )}
            <Button
              className="absolute right-0.5 top-1/2 cursor-pointer -translate-y-1/2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-primary-foreground shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] hover:shadow-card-hover transition-smooth"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>

          {/* Mobile Search Icon */}
          <Button
            className="sm:hidden p-1.5 sm:p-2 rounded-full bg-muted text-foreground shadow-card active:scale-95 transition-smooth"
            aria-label="Search"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full bg-muted shadow-card hover:shadow-card-hover transition-smooth active:scale-95 hover:border border-accent"
            aria-label={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            )}
          </Button>

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
  const { darkMode, toggleDarkMode } = useTheme();

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

              {/* Theme Toggle */}
              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-btn text-base font-medium text-foreground bg-muted hover:bg-accent transition-smooth"
                >
                  <span className="flex items-center gap-3">
                    {darkMode ? (
                      <>
                        <Sun className="w-5 h-5" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="w-5 h-5" />
                        Dark Mode
                      </>
                    )}
                  </span>
                  <div className="relative inline-flex items-center">
                    <div
                      className={`w-11 h-6 ${
                        darkMode ? "bg-primary" : "bg-muted-foreground/30"
                      } rounded-full transition-colors`}
                    >
                      <div
                        className={`absolute top-[2px] ${
                          darkMode ? "left-[22px]" : "left-[2px]"
                        } w-5 h-5 bg-background rounded-full transition-all shadow-sm`}
                      />
                    </div>
                  </div>
                </button>
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
