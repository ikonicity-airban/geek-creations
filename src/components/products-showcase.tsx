"use client";

import { motion } from "framer-motion";
import { Shirt, Coffee, Smartphone } from "lucide-react";

export const ProductsShowcase = () => {
  const products = [
    {
      name: "T-Shirts",
      icon: Shirt,
      count: "50+ styles",
      color: "bg-blue-500",
    },
    {
      name: "Hoodies",
      icon: Shirt,
      count: "30+ designs",
      color: "bg-purple-500",
    },
    {
      name: "Mugs",
      icon: Coffee,
      count: "20+ variants",
      color: "bg-orange-500",
    },
    {
      name: "Phone Cases",
      icon: Smartphone,
      count: "100+ models",
      color: "bg-pink-500",
    },
  ];

  return (
    <section className="py-32 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full font-semibold text-sm mb-4">
            PRODUCT CATALOG
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            200+ Premium Products
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            From apparel to home decor, we've got you covered
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className={`${product.color} rounded-2xl p-8 text-white cursor-pointer relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
              <div className="relative z-10">
                <product.icon className="w-16 h-16 mb-4" />
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-white/80">{product.count}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
