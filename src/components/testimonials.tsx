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
    <section className="py-32 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full font-semibold text-sm mb-4">
            SUCCESS STORIES
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-6">
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
              className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-750 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
