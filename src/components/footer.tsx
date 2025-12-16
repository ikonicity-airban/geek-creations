"use client";

import { Instagram, X } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-20 px-6" style={{ backgroundColor: '#401268', color: '#f8f6f0' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-3xl font-black mb-4" style={{ color: '#f8f6f0' }}>
              GEEKS
              <br />
              CREATION
            </h3>
            <p className="mb-6" style={{ color: 'rgba(248, 246, 240, 0.6)' }}>
              Made by nerds. Worn by legends.
            </p>
            <div className="flex gap-4">
              <Instagram 
                className="w-6 h-6 cursor-pointer transition" 
                style={{ color: '#c5a3ff' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#e2ae3d'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#c5a3ff'}
              />
              <X 
                className="w-6 h-6 cursor-pointer transition" 
                style={{ color: '#c5a3ff' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#e2ae3d'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#c5a3ff'}
              />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: '#f8f6f0' }}>Platform</h4>
            <ul className="space-y-2">
              {['Start Selling', 'Products', 'Pricing', 'Features'].map((item) => (
                <li 
                  key={item}
                  className="cursor-pointer transition"
                  style={{ color: 'rgba(248, 246, 240, 0.6)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#c5a3ff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 246, 240, 0.6)'}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: '#f8f6f0' }}>Resources</h4>
            <ul className="space-y-2">
              {['Documentation', 'Design Guide', 'Blog', 'Support'].map((item) => (
                <li 
                  key={item}
                  className="cursor-pointer transition"
                  style={{ color: 'rgba(248, 246, 240, 0.6)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#c5a3ff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 246, 240, 0.6)'}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4" style={{ color: '#f8f6f0' }}>Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'Terms', 'Privacy'].map((item) => (
                <li 
                  key={item}
                  className="cursor-pointer transition"
                  style={{ color: 'rgba(248, 246, 240, 0.6)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#c5a3ff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(248, 246, 240, 0.6)'}
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
            borderColor: 'rgba(197, 163, 255, 0.2)',
            color: 'rgba(248, 246, 240, 0.6)'
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
