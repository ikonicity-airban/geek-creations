"use client";

import { Instagram, X } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-20 px-6 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-3xl font-black mb-4">
              GEEKS
              <br />
              CREATION
            </h3>
            <p className="text-gray-400 mb-6">
              Made by nerds. Worn by legends.
            </p>
            <div className="flex gap-4">
              <Instagram className="w-6 h-6 hover:text-purple-400 cursor-pointer transition" />
              <X className="w-6 h-6 hover:text-purple-400 cursor-pointer transition" />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition">
                Start Selling
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Products
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Pricing
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Features
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition">
                Documentation
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Design Guide
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Blog
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Support
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition">
                About Us
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Contact
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Terms
              </li>
              <li className="hover:text-white cursor-pointer transition">
                Privacy
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            © 2025 Geeks Creation. All rights reserved. Powered by CodeOven 🔥
          </p>
        </div>
      </div>
    </footer>
  );
};
