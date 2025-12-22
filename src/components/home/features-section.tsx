"use client";

import { motion } from "framer-motion";
import { Package, Truck, Shield, Zap } from "lucide-react";

interface Feature {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export const FeaturesSection = () => {
  const features: Feature[] = [
    {
      icon: Package,
      title: "Zero Inventory",
      description: "No upfront costs, no storage needed. We handle everything.",
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Nigerian and international delivery with live tracking.",
    },
    {
      icon: Shield,
      title: "Premium Quality",
      description: "High-quality prints on premium materials guaranteed.",
    },
    {
      icon: Zap,
      title: "Automated Fulfillment",
      description: "Orders process automatically from design to delivery.",
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-lg container-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-foreground">
            Why Choose Us
          </h2>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4 text-muted-foreground">
            Everything you need to succeed, built for creators
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="text-center transition-smooth"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-btn mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-card bg-primary">
                <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-foreground">
                {feature.title}
              </h4>
              <p className="text-xs sm:text-sm md:text-base px-2 text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
