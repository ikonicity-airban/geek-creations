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
    <section className="py-16" style={{ backgroundColor: '#f8f6f0' }}>
      <div className="max-w-[1024px] mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: '#401268' }}>
            Why Choose Us
          </h2>
          <p className="text-base md:text-lg" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
            Everything you need to succeed, built for creators
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="text-center"
            >
              <div
                className="w-16 h-16 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#401268' }}
              >
                <feature.icon className="w-8 h-8" style={{ color: '#ffffff' }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#401268' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
