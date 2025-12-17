"use client";

import { Instagram, X } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-20 px-6" style={{ backgroundColor: '#f8f6f0', color: '#401268' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-3xl font-black mb-4" style={{ color: '#401268' }}>
              GEEKS
              <br />
              CREATION
            </h3>
            <p className="mb-6" style={{ color: 'rgba(64, 18, 104, 0.7)' }}>
              Made by nerds. Worn by legends.
            </p>
            <div className="flex gap-4">
              <Instagram
                className="w-6 h-6 cursor-pointer transition"
                style={{ color: '#401268' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c5a3ff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#401268'}
              />
              <X
                className="w-6 h-6 cursor-pointer transition"
                style={{ color: '#401268' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#c5a3ff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#401268'}
              />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: '#401268' }}>Platform</h4>
            <ul className="space-y-2">
              {['Start Selling', 'Products', 'Pricing', 'Features'].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition"
                  style={{ color: 'rgba(64, 18, 104, 0.7)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#e21b35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(64, 18, 104, 0.7)'}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: '#401268' }}>Resources</h4>
            <ul className="space-y-2">
              {['Documentation', 'Design Guide', 'Blog', 'Support'].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition"
                  style={{ color: 'rgba(64, 18, 104, 0.7)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#e21b35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(64, 18, 104, 0.7)'}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: '#401268' }}>Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'Terms', 'Privacy'].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition"
                  style={{ color: 'rgba(64, 18, 104, 0.7)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#e21b35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(64, 18, 104, 0.7)'}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-8 border-t text-center"
          style={{
            borderColor: 'rgba(64, 18, 104, 0.1)',
            color: 'rgba(64, 18, 104, 0.7)'
          }}
        >
          <p>
            © 2025 Geeks Creation. All rights reserved. Powered by CodeOven 🔥
          </p>
        </div>
      </div>
    </footer>
  );
};
