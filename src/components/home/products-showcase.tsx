"use client";

import { motion } from "framer-motion";
import { Shirt, Coffee, Smartphone, PenTool } from "lucide-react";

export const ProductsShowcase = () => {
  const products = [
    {
      name: "T-Shirts",
      icon: Shirt,
      count: "50+ styles",
    },
    {
      name: "Hoodies",
      icon: Shirt,
      count: "30+ designs",
    },
    {
      name: "Mugs",
      icon: Coffee,
      count: "20+ variants",
    },
    {
      name: "Phone Cases",
      icon: Smartphone,
      count: "100+ models",
    },
    {
      name: "Accessories",
      icon: PenTool,
      count: "Stickers, pins & more",
    },
  ];

  return (
    <section className="py-32 overflow-hidden" style={{ backgroundColor: '#f8f6f0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span 
            className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4"
            style={{ backgroundColor: '#e2ae3d', color: '#401268' }}
          >
            PRODUCT CATALOG
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: '#401268' }}>
            200+ Premium Products
          </h2>
          <p className="text-xl" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
            From apparel to home decor, we've got you covered
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => {
            const colors = ['#401268', '#c5a3ff', '#e2ae3d', '#401268'];
            const cardColor = colors[i % colors.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl p-8 cursor-pointer relative overflow-hidden group"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid #e0e0e0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(64,18,104,0.15)';
                  e.currentTarget.style.borderColor = '#c5a3ff';
                  e.currentTarget.style.borderWidth = '2px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.borderWidth = '1px';
                }}
              >
                <div className="relative z-10">
                  <div 
                    className="inline-flex p-4 rounded-xl mb-4"
                    style={{ backgroundColor: cardColor }}
                  >
                    <product.icon className="w-8 h-8" style={{ color: '#ffffff' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#401268' }}>{product.name}</h3>
                  <p style={{ color: 'rgba(64, 18, 104, 0.6)' }}>{product.count}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
