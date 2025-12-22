"use client";

import React, { useState } from "react";
import {
  Instagram,
  Twitter,
  Facebook,
  Mail,
  ArrowUp,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
} from "@tabler/icons-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [openSection, setOpenSection] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const socialIconVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
      },
    },
  };

  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Start Selling", href: "#" },
        { name: "Products", href: "/collections/all" },
        { name: "Pricing", href: "#" },
        { name: "Features", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Design Guide", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Support", href: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Privacy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none">
        <div
          className="absolute top-10 left-5 sm:top-20 sm:left-10 w-32 h-32 sm:w-64 sm:h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(197, 163, 255, 0.3), transparent)",
          }}
        />
        <div
          className="absolute bottom-10 right-5 sm:bottom-20 sm:right-10 w-48 h-48 sm:w-80 sm:h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(226, 174, 61, 0.2), transparent)",
          }}
        />
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 mb-12 md:mb-16">
          {/* Brand + Newsletter Column */}
          <motion.div
            variants={itemVariants}
            className="col-span-12 lg:col-span-4"
          >
            <h4 className="text-3xl lg:text-4xl font-black mb-3 md:mb-4 text-primary">
              GEEKS
              <br />
              CREATION
            </h4>
            <p className="mb-4 md:mb-6 text-sm md:text-base text-muted-foreground">
              Design it . Build it . Wear it.
            </p>

            {/* Newsletter */}
            <h4 className="font-bold mb-2 md:mb-3 md:text-sm uppercase tracking-wide text-primary">
              Join the Squad
            </h4>
            <div className="mb-6 md:mb-8">
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 rounded-btn border-hairline md:border-2 text-xs md:text-sm transition-smooth outline-none border-border bg-card text-primary"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 md:px-6 py-2 md:py-2.5 rounded-btn font-bold text-xs md:text-sm transition-smooth shadow-card bg-primary text-primary-foreground hover:opacity-90"
                >
                  <Mail className="w-4 h-4" />
                </motion.button>
              </form>
            </div>

            {/* Social Icons - Glassmorphic */}
            <div className="flex gap-2 md:gap-3">
              {[
                {
                  Icon: IconBrandInstagram,
                  label: "Instagram",
                  color: "#e21b35",
                },
                { Icon: IconBrandX, label: "Twitter", color: "#c5a3ff" },
                {
                  Icon: IconBrandFacebook,
                  label: "Facebook",
                  color: "#e2ae3d",
                },
              ].map(({ Icon, label, color }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  variants={socialIconVariants}
                  initial="rest"
                  whileHover="hover"
                  className="relative w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center backdrop-blur-sm transition-smooth"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links Columns */}
          {footerSections.map((section) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="col-span-6 lg:col-span-2"
            >
              <h4 className="font-bold mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wide text-primary">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => {
                  const linkName = typeof link === "string" ? link : link.name;
                  const linkHref = typeof link === "string" ? "#" : link.href;
                  return (
                    <motion.li
                      key={linkName}
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <a
                        href={linkHref}
                        className="text-xs md:text-sm transition-smooth inline-block text-muted-foreground hover:text-destructive"
                      >
                        {linkName}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}

          {/* Payment Methods */}
          <motion.div
            variants={itemVariants}
            className="col-span-12 lg:col-span-2"
          >
            <h4 className="font-bold mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wide text-primary">
              We Accept
            </h4>
            <div className="flex flex-wrap gap-2">
              {["USDC", "SOL", "NGN"].map((method) => (
                <span
                  key={method}
                  className="px-2.5 md:px-3 py-1 md:py-1.5 rounded-btn text-xs font-bold backdrop-blur-sm border-hairline bg-secondary/15 border-secondary/30 text-primary"
                >
                  {method}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="md:hidden space-y-3 sm:space-y-4 mb-10 sm:mb-12">
          {/* Brand Section - Always Visible */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h4 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-3 text-primary">
              GEEKS
              <br />
              CREATION
            </h4>
            <p className="mb-4 sm:mb-6 text-xs sm:text-sm">
              Made by nerds. Worn by legends. 🚀
            </p>

            {/* Newsletter Mobile */}
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex gap-2 mb-4 sm:mb-6 p-2 "
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-btn border-hairline text-xs sm:text-sm transition-smooth"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 py-2 rounded-btn font-bold shadow-card"
                style={{
                  backgroundColor: "#401268",
                  color: "white",
                }}
              >
                <Mail className="w-4 h-4" />
              </motion.button>
            </form>

            {/* Social Icons Mobile */}
            <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
              {[
                { Icon: IconBrandInstagram, color: "#e21b35" },
                { Icon: IconBrandX, color: "#c5a3ff" },
                { Icon: IconBrandFacebook, color: "#e2ae3d" },
              ].map(({ Icon, color }, idx) => (
                <motion.div
                  key={idx}
                  whileTap={{ scale: 0.9 }}
                  className={buttonVariants({
                    variant: "outline",
                    className: cn(`transition-colors border-accent`),
                  })}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Accordion Sections */}
          {footerSections.map((section) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-card backdrop-blur-sm overflow-hidden border-hairline bg-secondary/20"
            >
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between transition-smooth active:bg-white/20"
              >
                <span
                  className={cn("font-bold text-xs sm:text-sm ", {
                    "text-primary": openSection === section.title,
                  })}
                >
                  {section.title}
                </span>
                <motion.div
                  animate={{ rotate: openSection === section.title ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openSection === section.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-3 sm:px-4 pb-3"
                  >
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <a
                            href={link.href}
                            className="text-xs sm:text-sm block py-1 transition-smooth active:text-destructive text-muted-foreground hover:text-destructive"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Payment Methods Mobile */}
          <motion.div
            variants={itemVariants}
            className="rounded-card backdrop-blur-sm p-3 sm:p-4 border-hairline bg-card"
          >
            <h4 className="font-bold mb-2 sm:mb-3 text-xs sm:text-sm">
              WE ACCEPT
            </h4>
            <div className="flex flex-wrap gap-2">
              {["USDC", "SOL", "NGN"].map((method) => (
                <Badge
                  key={method}
                  className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-btn text-xs font-bold bg-secondary/20"
                >
                  {method}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="pt-6 sm:pt-8 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4"
          style={{ borderColor: "rgba(64, 18, 104, 0.1)" }}
        >
          <p className="text-xs sm:text-sm text-center md:text-left text-muted-foreground">
            © 2025 Geeks Creation. All rights reserved. Powered by CodeOven 🔥
          </p>

          {/* Scroll to Top Button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{
              border: "1px solid #c5a3ff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#c5a3ff";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(197, 163, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(197, 163, 255, 0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <ArrowUp className="w-5 h-5 text-primary" />
          </motion.button>
        </motion.div>
      </motion.div>
    </footer>
  );
};
