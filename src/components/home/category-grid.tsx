"use client";

import { motion } from "framer-motion";
import { Shirt, Coffee, Smartphone, ShoppingBag, Package, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  icon: any;
  count: string;
  handle: string;
  size: "small" | "medium" | "large";
}

export const CategoryGrid = () => {
  const categories: Category[] = [
    {
      id: "1",
      name: "T-Shirts",
      icon: Shirt,
      count: "150+ designs",
      handle: "t-shirts",
      size: "large"
    },
    {
      id: "2",
      name: "Hoodies",
      icon: Shirt,
      count: "80+ designs",
      handle: "hoodies",
      size: "medium"
    },
    {
      id: "3",
      name: "Mugs",
      icon: Coffee,
      count: "60+ designs",
      handle: "mugs",
      size: "medium"
    },
    {
      id: "4",
      name: "Phone Cases",
      icon: Smartphone,
      count: "120+ designs",
      handle: "phone-cases",
      size: "small"
    },
    {
      id: "5",
      name: "Tote Bags",
      icon: ShoppingBag,
      count: "40+ designs",
      handle: "tote-bags",
      size: "small"
    },
    {
      id: "6",
      name: "Posters",
      icon: ImageIcon,
      count: "90+ designs",
      handle: "posters",
      size: "large"
    },
  ];

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "large":
        return "md:col-span-2 md:row-span-2";
      case "medium":
        return "md:col-span-1 md:row-span-2";
      case "small":
        return "md:col-span-1 md:row-span-1";
      default:
        return "";
    }
  };

  const getIconSize = (size: string) => {
    switch (size) {
      case "large":
        return "w-16 h-16";
      case "medium":
        return "w-12 h-12";
      case "small":
        return "w-10 h-10";
      default:
        return "w-10 h-10";
    }
  };

  return (
    <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-[1024px] mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-black mb-3" style={{ color: '#401268' }}>
            Shop by Category
          </h2>
          <p className="text-base md:text-lg" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
            Find your perfect product type
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-fr">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={getSizeClasses(category.size)}
            >
              <Link href={`/collections/${category.handle}`}>
                <div
                  className="h-full rounded-2xl p-4 md:p-6 cursor-pointer transition-all flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f8f6f0' : '#ffffff',
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
                  <div
                    className={`${getIconSize(category.size)} mb-3 rounded-xl flex items-center justify-center`}
                    style={{ backgroundColor: '#401268' }}
                  >
                    <category.icon className={getIconSize(category.size)} style={{ color: '#ffffff' }} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-center" style={{ color: '#401268' }}>
                    {category.name}
                  </h3>
                  <p className="text-xs md:text-sm text-center" style={{ color: 'rgba(64, 18, 104, 0.6)' }}>
                    {category.count}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

