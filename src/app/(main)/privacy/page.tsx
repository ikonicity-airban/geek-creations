"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal Information: When you create an account or place an order, we collect information such as your name, email address, shipping address, phone number, and payment information.",
        "Usage Data: We collect information about how you interact with our website, including pages visited, products viewed, and time spent on the site.",
        "Device Information: We may collect information about your device, including IP address, browser type, and operating system.",
        "Cookies: We use cookies and similar tracking technologies to enhance your experience and analyze website traffic.",
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "To process and fulfill your orders",
        "To communicate with you about your orders, account, and our services",
        "To improve our website and customer experience",
        "To send you marketing communications (with your consent)",
        "To prevent fraud and ensure security",
        "To comply with legal obligations",
      ],
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your personal information, including SSL encryption for data transmission.",
        "Payment information is processed securely through trusted third-party payment processors (Paystack, etc.) and is not stored on our servers.",
        "While we strive to protect your data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.",
      ],
    },
    {
      icon: FileText,
      title: "Your Rights",
      content: [
        "Access: You have the right to access the personal information we hold about you.",
        "Correction: You can update your account information at any time through your account settings.",
        "Deletion: You can request deletion of your account and personal information, subject to legal and operational requirements.",
        "Opt-out: You can opt-out of marketing communications at any time by clicking the unsubscribe link in our emails.",
        "Data Portability: You can request a copy of your data in a portable format.",
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="pt-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Shield className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-6" />
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-200/70 dark:border-gray-700/70">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            At Geek Creations, we are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website and use our services.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            By using our website, you agree to the collection and use of
            information in accordance with this policy. If you do not agree with
            our policies and practices, please do not use our services.
          </p>
        </div>
      </motion.div>

      <div className="space-y-8">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-3 text-gray-600 dark:text-gray-400"
                  >
                    <span className="text-indigo-600 dark:text-indigo-400 mt-1.5">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 space-y-6"
      >
        <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-200/70 dark:border-gray-700/70">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            Third-Party Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We may use third-party services for payment processing, analytics,
            and fulfillment. These services have their own privacy policies
            governing the use of your information:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• Payment processors (Paystack, etc.)</li>
            <li>• Fulfillment providers (Printful, Printify, Ikonshop)</li>
            <li>• Analytics services (Google Analytics)</li>
            <li>• Email service providers</li>
          </ul>
        </div>

        <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-200/70 dark:border-gray-700/70">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            Cookies and Tracking
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We use cookies to enhance your browsing experience, analyze site
            traffic, and personalize content. You can control cookies through
            your browser settings, but disabling cookies may affect website
            functionality.
          </p>
        </div>

        <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-200/70 dark:border-gray-700/70">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            Children's Privacy
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Our services are not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13. If you believe we have collected information from a child under
            13, please contact us immediately.
          </p>
        </div>

        <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-200/70 dark:border-gray-700/70">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            Changes to This Policy
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new policy on this page and
            updating the "Last updated" date. You are advised to review this
            policy periodically for any changes.
          </p>
        </div>

        <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-200/70 dark:border-gray-700/70">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you have any questions about this Privacy Policy or our data
            practices, please contact us:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• Email: privacy@geekcreations.com</li>
            <li>• Phone: +234 800 000 0000</li>
            <li>• Address: 123 Innovation Street, Lagos, Nigeria</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
