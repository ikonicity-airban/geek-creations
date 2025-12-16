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
    <section className="py-32 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full font-semibold text-sm mb-4">
            POWERFUL FEATURES
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Everything You Need
            <br />
            <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              To Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <div
                className={`inline-flex p-4 rounded-xl bg-linear-to-br ${feature.linear} mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
              <ChevronRight className="absolute bottom-8 right-8 w-6 h-6 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-2 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
