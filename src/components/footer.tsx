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
    <footer
      className="relative py-20 px-6 overflow-hidden"
      style={{ backgroundColor: "#f8f6f0" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(197, 163, 255, 0.3), transparent)",
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full"
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
        <div className="hidden md:grid md:grid-cols-12 gap-8 mb-16">
          {/* Brand + Newsletter Column */}
          <motion.div
            variants={itemVariants}
            className="col-span-12 lg:col-span-4"
          >
            <h3
              className="text-4xl font-black mb-4"
              style={{ color: "#401268" }}
            >
              GEEKS
              <br />
              CREATION
            </h3>
            <p
              className="mb-6 text-base"
              style={{ color: "rgba(64, 18, 104, 0.7)" }}
            >
              Made by nerds. Worn by legends. 🚀
            </p>

            {/* Newsletter */}
            <div className="mb-8">
              <h4
                className="font-bold mb-3 text-sm uppercase tracking-wide"
                style={{ color: "#401268" }}
              >
                Join the Squad
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 rounded-lg border-2 text-sm transition-all outline-none"
                  style={{
                    borderColor: "rgba(64, 18, 104, 0.2)",
                    backgroundColor: "white",
                    color: "#401268",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#c5a3ff";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(197, 163, 255, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(64, 18, 104, 0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 rounded-lg font-bold text-sm transition-all"
                  style={{
                    backgroundColor: "#401268",
                    color: "white",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2d0d4a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#401268")
                  }
                >
                  <Mail className="w-4 h-4" />
                </motion.button>
              </form>
            </div>

            {/* Social Icons - Glassmorphic */}
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram", color: "#e21b35" },
                { Icon: Twitter, label: "Twitter", color: "#c5a3ff" },
                { Icon: Facebook, label: "Facebook", color: "#e2ae3d" },
              ].map(({ Icon, label, color }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  variants={socialIconVariants}
                  initial="rest"
                  whileHover="hover"
                  className="relative w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all"
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${color}15`;
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.boxShadow = `0 8px 24px ${color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.4)";
                    e.currentTarget.style.borderColor =
                      "rgba(255, 255, 255, 0.6)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#401268" }} />
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
              <h4
                className="font-bold mb-4 text-sm uppercase tracking-wide"
                style={{ color: "#401268" }}
              >
                {section.title}
              </h4>
              <ul className="space-y-2.5">
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
                        className="text-sm transition-colors inline-block"
                        style={{ color: "rgba(64, 18, 104, 0.7)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#e21b35")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color =
                            "rgba(64, 18, 104, 0.7)")
                        }
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
            <h4
              className="font-bold mb-4 text-sm uppercase tracking-wide"
              style={{ color: "#401268" }}
            >
              We Accept
            </h4>
            <div className="flex flex-wrap gap-2">
              {["USDC", "SOL", "NGN"].map((method) => (
                <span
                  key={method}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm"
                  style={{
                    background: "rgba(197, 163, 255, 0.15)",
                    border: "1px solid rgba(197, 163, 255, 0.3)",
                    color: "#401268",
                  }}
                >
                  {method}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="md:hidden space-y-4 mb-12">
          {/* Brand Section - Always Visible */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3
              className="text-3xl font-black mb-3"
              style={{ color: "#401268" }}
            >
              GEEKS
              <br />
              CREATION
            </h3>
            <p
              className="mb-6 text-sm"
              style={{ color: "rgba(64, 18, 104, 0.7)" }}
            >
              Made by nerds. Worn by legends. 🚀
            </p>

            {/* Newsletter Mobile */}
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-lg border-2 text-sm"
                style={{
                  borderColor: "rgba(64, 18, 104, 0.2)",
                  backgroundColor: "white",
                  color: "#401268",
                }}
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg font-bold"
                style={{
                  backgroundColor: "#401268",
                  color: "white",
                }}
              >
                <Mail className="w-4 h-4" />
              </motion.button>
            </form>

            {/* Social Icons Mobile */}
            <div className="flex gap-3 mb-6">
              {[
                { Icon: IconBrandInstagram, color: "#e21b35" },
                { Icon: IconBrandX, color: "#c5a3ff" },
                { Icon: IconBrandFacebook, color: "#e2ae3d" },
              ].map(({ Icon, color }, idx) => (
                <motion.div
                  key={idx}
                  whileTap={{ scale: 0.9 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-sm"
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    color: color,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#401268" }} />
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
              className="rounded-xl backdrop-blur-sm overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
              }}
            >
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-4 py-3 flex items-center justify-between"
              >
                <span
                  className="font-bold text-sm"
                  style={{ color: "#401268" }}
                >
                  {section.title}
                </span>
                <motion.div
                  animate={{ rotate: openSection === section.title ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown
                    className="w-4 h-4"
                    style={{ color: "#401268" }}
                  />
                </motion.div>
              </button>
              <AnimatePresence>
                {openSection === section.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-3"
                  >
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <a
                            href="#"
                            className="text-sm block py-1"
                            style={{ color: "rgba(64, 18, 104, 0.7)" }}
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
            className="rounded-xl backdrop-blur-sm p-4"
            style={{
              background: "rgba(255, 255, 255, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <h4 className="font-bold mb-3 text-sm" style={{ color: "#401268" }}>
              WE ACCEPT
            </h4>
            <div className="flex flex-wrap gap-2">
              {["USDC", "SOL", "NGN"].map((method) => (
                <span
                  key={method}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{
                    background: "rgba(197, 163, 255, 0.2)",
                    color: "#401268",
                  }}
                >
                  {method}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(64, 18, 104, 0.1)" }}
        >
          <p
            className="text-sm text-center md:text-left"
            style={{ color: "rgba(64, 18, 104, 0.7)" }}
          >
            © 2025 Geeks Creation. All rights reserved. Powered by CodeOven 🔥
          </p>

          {/* Scroll to Top Button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{
              background: "rgba(197, 163, 255, 0.2)",
              border: "2px solid #c5a3ff",
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
            <ArrowUp className="w-5 h-5" style={{ color: "#401268" }} />
          </motion.button>
        </motion.div>
      </motion.div>
    </footer>
  );
};
