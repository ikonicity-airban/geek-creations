"use client";

import { motion } from "framer-motion";
import { Package, ShieldCheck, Shirt, Truck } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    { icon: Package, value: "50+", label: "Unique designs" },
    { icon: Shirt, value: "8", label: "Product types" },
    { icon: ShieldCheck, value: "4.8★", label: "Customer rating" },
    { icon: Truck, value: "48hrs", label: "Avg. production time" },
  ];

  return (
    <section className="py-20" style={{ backgroundColor: '#f8f6f0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4" style={{ color: '#401268' }} />
              <motion.h3
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                className="text-5xl font-black mb-2"
                style={{ color: '#401268' }}
              >
                {stat.value}
              </motion.h3>
              <p className="font-medium" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
