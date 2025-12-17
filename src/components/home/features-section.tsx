"use client";

import { motion } from "framer-motion";
import { Package, Truck, Shield, Zap } from "lucide-react";

interface Feature {
  icon: any;
  title: string;
  description: string;
}

export const FeaturesSection = () => {
  const features: Feature[] = [
    {
      icon: Package,
      title: "Zero Inventory",
      description: "No upfront costs, no storage needed. We handle everything."
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Nigerian and international delivery with live tracking."
    },
    {
      icon: Shield,
      title: "Premium Quality",
      description: "High-quality prints on premium materials guaranteed."
    },
    {
      icon: Zap,
      title: "Automated Fulfillment",
      description: "Orders process automatically from design to delivery."
    },
  ];

  return (
    <section className="py-20" style={{ backgroundColor: '#f8f6f0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: '#401268' }}>
            Why Choose Us
          </h2>
          <p className="text-xl" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
            Everything you need to succeed, built for creators
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#401268' }}
              >
                <feature.icon className="w-10 h-10" style={{ color: '#ffffff' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#401268' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
