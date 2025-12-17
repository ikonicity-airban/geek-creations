"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Chidi Okonkwo",
      role: "Anime Merch Store Owner",
      content:
        "Made ₦500k in my first month! The platform is so easy to use and the quality is top-notch.",
      rating: 5,
      avatar: "CO",
    },
    {
      name: "Amina Bello",
      role: "Graphic Designer",
      content:
        "Finally, a Nigerian POD platform that actually works. Fast shipping and great customer support!",
      rating: 5,
      avatar: "AB",
    },
    {
      name: "Tunde Adeyemi",
      role: "Tech Startup Founder",
      content:
        "Perfect for our company swag. High quality prints and reasonable prices. Highly recommend!",
      rating: 5,
      avatar: "TA",
    },
  ];

  return (
    <section className="py-32" style={{ backgroundColor: '#f8f6f0' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span
            className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4"
            style={{ backgroundColor: 'rgba(197, 163, 255, 0.2)', color: '#401268' }}
          >
            SUCCESS STORIES
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: '#401268' }}>
            Loved by Creators
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl p-8 transition-all"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(64,18,104,0.15)';
                e.currentTarget.style.borderColor = '#c5a3ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5"
                    style={{ fill: '#e2ae3d', color: '#e2ae3d' }}
                  />
                ))}
              </div>
              <p className="mb-6 text-lg leading-relaxed" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: '#c5a3ff', color: '#401268' }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: '#401268' }}>{testimonial.name}</h4>
                  <p className="text-sm" style={{ color: 'rgba(64, 18, 104, 0.6)' }}>{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
