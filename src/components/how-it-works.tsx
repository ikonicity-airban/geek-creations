"use client";

import { motion } from "framer-motion";
import { Palette, Package, Rocket, TrendingUp } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Design",
      description:
        "Use our intuitive design studio or upload your artwork. AI suggestions included.",
      icon: Palette,
    },
    {
      number: "02",
      title: "Choose Products",
      description:
        "Select from 200+ premium products. Set your prices and profit margins.",
      icon: Package,
    },
    {
      number: "03",
      title: "Start Selling",
      description:
        "Share your store link. We handle production, shipping, and customer service.",
      icon: Rocket,
    },
    {
      number: "04",
      title: "Get Paid",
      description:
        "Receive payouts weekly. Track everything in real-time analytics.",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="py-32 bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-semibold text-sm mb-4">
            HOW IT WORKS
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
                <span className="text-6xl font-black text-purple-200 dark:text-purple-900/50">
                  {step.number}
                </span>
                <div className="my-6 p-4 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl inline-block">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-linear-to-r from-purple-500 to-pink-500" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
