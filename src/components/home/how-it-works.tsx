"use client";

import { motion } from "framer-motion";
import { Palette, Package, Rocket, TrendingUp } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Pick a Product",
      description:
        "Choose from 1000+ products and set your retail price and margins.",
      icon: Palette,
    },
    {
      number: "02",
      title: "Design & Preview",
      description:
        "Upload art or design in the studio. Generate polished mockups instantly.",
      icon: Package,
    },
    {
      number: "03",
      title: "Publish & Sell",
      description:
        "Share your store link or connect your channel. Orders flow automatically.",
      icon: Rocket,
    },
    {
      number: "04",
      title: "We Fulfill",
      description:
        "We print, pack, and ship worldwide. You keep the profit—no inventory.",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-32" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span 
            className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4"
            style={{ backgroundColor: '#c5a3ff', color: '#401268' }}
          >
            HOW IT WORKS
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: '#401268' }}>
            Launch in 4 Simple Steps
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div 
                className="rounded-2xl p-8 transition-all"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(64,18,104,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(64,18,104,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(64,18,104,0.1)';
                }}
              >
                <span className="text-6xl font-black" style={{ color: 'rgba(197, 163, 255, 0.3)' }}>
                  {step.number}
                </span>
                <div 
                  className="my-6 p-4 rounded-xl inline-block"
                  style={{ backgroundColor: '#401268' }}
                >
                  <step.icon className="w-8 h-8" style={{ color: '#ffffff' }} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#401268' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div 
                  className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5"
                  style={{ backgroundColor: '#c5a3ff' }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
