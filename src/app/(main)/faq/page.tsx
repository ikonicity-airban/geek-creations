"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Shipping times vary depending on your location and the fulfillment provider. Typically, orders are processed within 2-3 business days, and shipping takes 5-10 business days for domestic orders and 10-20 business days for international orders. You'll receive a tracking number once your order ships.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes! We ship to most countries worldwide. International shipping times and costs vary by location. You can see shipping options and costs at checkout.",
        },
        {
          question: "What is your return policy?",
          answer:
            "We offer a 7-day return policy for unused items in their original packaging. If you're not satisfied with your purchase, please contact us within 7 days of delivery. Customized items may have different return policies.",
        },
        {
          question: "How can I track my order?",
          answer:
            "Once your order ships, you'll receive an email with a tracking number. You can also check your order status in your account dashboard.",
        },
        {
          question: "What if my order is damaged or incorrect?",
          answer:
            "If you receive a damaged or incorrect item, please contact us immediately with photos of the issue. We'll send a replacement at no cost to you.",
        },
      ],
    },
    {
      category: "Products & Customization",
      questions: [
        {
          question: "Can I customize products?",
          answer:
            "Yes! Many of our products can be customized using our design editor. You can upload your own designs, add text, and choose from our design library. Customization options vary by product type.",
        },
        {
          question: "What file formats do you accept for custom designs?",
          answer:
            "We accept PNG, JPG, and SVG files. For best results, use high-resolution images (at least 300 DPI) with transparent backgrounds when possible.",
        },
        {
          question: "How do I know if a product will fit?",
          answer:
            "Each product page includes a size guide with detailed measurements. We recommend checking the size guide before ordering, especially for apparel items.",
        },
        {
          question: "What materials are used?",
          answer:
            "We use high-quality materials from trusted suppliers. Product descriptions include material information. Common materials include 100% cotton for t-shirts, polyester blends for performance wear, and ceramic for mugs.",
        },
        {
          question: "Are your products eco-friendly?",
          answer:
            "We're committed to sustainability. Many of our products use eco-friendly materials and printing processes. Look for the eco-friendly badge on product pages.",
        },
      ],
    },
    {
      category: "Payment & Pricing",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept credit/debit cards (via Paystack), bank transfers, and cryptocurrency (USDC and SOL on Solana). All payments are processed securely.",
        },
        {
          question: "When will I be charged?",
          answer:
            "You'll be charged when you place your order. For card payments, the charge is immediate. For bank transfers and crypto, payment must be completed before your order is processed.",
        },
        {
          question: "Do you offer free shipping?",
          answer:
            "Yes! We offer free shipping on orders over ₦50,000. For orders below this amount, standard shipping is ₦2,500.",
        },
        {
          question: "Are there any hidden fees?",
          answer:
            "No hidden fees! The price you see is the price you pay, plus applicable taxes and shipping (if under the free shipping threshold). All costs are clearly displayed at checkout.",
        },
        {
          question: "Can I use discount codes?",
          answer:
            "Yes! You can apply discount codes at checkout. Follow us on social media and subscribe to our newsletter to receive exclusive discount codes.",
        },
      ],
    },
    {
      category: "Account & Support",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "You can create an account during checkout or by visiting the signup page. Having an account allows you to track orders, save designs, and access exclusive features.",
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer:
            "Click 'Forgot Password' on the login page and enter your email address. You'll receive instructions to reset your password.",
        },
        {
          question: "How do I contact customer support?",
          answer:
            "You can reach us via email at support@geekcreations.com, use our contact form, or call us at +234 800 000 0000. We typically respond within 24 hours.",
        },
        {
          question: "Do you have a mobile app?",
          answer:
            "Currently, we don't have a mobile app, but our website is fully optimized for mobile devices. You can access all features through your mobile browser.",
        },
        {
          question: "Can I save my designs?",
          answer:
            "Yes! If you're logged in, you can save your custom designs to your account and reuse them for future orders.",
        },
      ],
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="pt-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <HelpCircle className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-6" />
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Find answers to common questions about our products, orders, and
          services.
        </p>
      </motion.div>

      <div className="space-y-8">
        {faqs.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
          >
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, index) => {
                const globalIndex = categoryIndex * 100 + index;
                const isOpen = openIndex === globalIndex;

                return (
                  <div
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0"
                  >
                    <button
                      onClick={() => toggleQuestion(globalIndex)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0 transition-transform ${
                          isOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-600 dark:text-gray-400 mt-3 pr-8">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-8 border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {
              "Can't find the answer you're looking for? Please reach out to our friendly support team."
            }
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Contact Us
          </a>
        </div>
      </motion.div>
    </div>
  );
}
