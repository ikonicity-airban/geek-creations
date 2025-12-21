"use client";

import { motion } from "framer-motion";
import {
  Target,
  Users,
  Sparkles,
  Heart,
  Award,
  Globe,
  Zap,
  Shield,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To empower creators and geeks worldwide by providing high-quality, customizable products that express their unique style and passions.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description:
        "We're constantly pushing the boundaries of print-on-demand technology to bring you the latest designs and products.",
    },
    {
      icon: Heart,
      title: "Passion",
      description:
        "We're geeks ourselves, and we understand what it means to be passionate about what you love. That's why we care deeply about every product we create.",
    },
    {
      icon: Shield,
      title: "Quality",
      description:
        "We partner with the best print-on-demand providers to ensure every product meets our high standards for quality and durability.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "50K+", label: "Products Sold" },
    { number: "100+", label: "Designs Available" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="pt-10" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
          About Geek Creations
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          We're a passionate team of designers, developers, and geeks dedicated
          to bringing your creative visions to life through high-quality
          print-on-demand products.
        </p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-200/70 dark:border-gray-700/70 text-center"
          >
            <div className="text-3xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-2">
              {stat.number}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Story Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-8 md:p-12 shadow-sm border border-gray-200/70 dark:border-gray-700/70">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
            Our Story
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Geek Creations was born from a simple idea: everyone deserves to
              express their unique interests and passions through high-quality
              products. What started as a small project has grown into a
              thriving platform that serves thousands of customers worldwide.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We specialize in print-on-demand products, allowing you to
              customize everything from t-shirts and hoodies to mugs and
              posters. Whether you're a gaming enthusiast, anime lover, tech
              geek, or have your own unique interests, we've got something for
              you.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Our team works tirelessly to curate the best designs, partner with
              reliable fulfillment providers, and ensure every order meets our
              quality standards. We're not just a store—we're a community of
              creators and enthusiasts.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
              >
                <Icon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-8 md:p-12 shadow-sm border border-gray-200/70 dark:border-gray-700/70">
          <Users className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            We're always looking for talented designers, developers, and
            passionate geeks to join our team. If you share our vision, we'd
            love to hear from you.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Get in Touch
          </a>
        </div>
      </motion.div>
    </div>
  );
}
