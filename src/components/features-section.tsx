"use client";

import { motion } from "framer-motion";
import {
  Layers,
  Package,
  Rocket,
  CreditCard,
  BarChart3,
  Shield,
  ChevronRight,
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Layers,
      title: "Design Studio",
      description:
        "Professional design tools with AI-powered suggestions. Create stunning designs in minutes.",
      linear: "from-blue-500 to-cyan-500",
    },
    {
      icon: Package,
      title: "Quality Products",
      description:
        "Premium materials, eco-friendly printing. 200+ product types from T-shirts to home decor.",
      linear: "from-purple-500 to-pink-500",
    },
    {
      icon: Rocket,
      title: "Fast Fulfillment",
      description:
        "Lightning-fast production and delivery. Orders fulfilled within 3-5 business days.",
      linear: "from-orange-500 to-red-500",
    },
    {
      icon: CreditCard,
      title: "Flexible Payments",
      description:
        "Accept Naira, USDC, SOL. Multiple payment options for your customers.",
      linear: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Real-time sales tracking, profit margins, customer insights. Data-driven decisions.",
      linear: "from-yellow-500 to-orange-500",
    },
    {
      icon: Shield,
      title: "Zero Risk",
      description:
        "No upfront costs, no inventory. We handle production, shipping, and returns.",
      linear: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section className="py-32" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span 
            className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4"
            style={{ backgroundColor: '#c5a3ff', color: '#401268' }}
          >
            POWERFUL FEATURES
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: '#401268' }}>
            Everything You Need
            <br />
            <span style={{ color: '#c5a3ff' }}>
              To Succeed
            </span>
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
            Professional-grade tools designed for creators, by creators
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative rounded-2xl p-8 transition-all"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(64,18,104,0.15)';
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div
                className="inline-flex p-4 rounded-xl mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: '#401268' }}
              >
                <feature.icon className="w-8 h-8" style={{ color: '#ffffff' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#401268' }}>
                {feature.title}
              </h3>
              <p className="leading-relaxed" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
                {feature.description}
              </p>
              <ChevronRight 
                className="absolute bottom-8 right-8 w-6 h-6 group-hover:translate-x-2 transition-all" 
                style={{ color: '#c5a3ff' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
