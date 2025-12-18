"use client";

import { motion } from "framer-motion";
import { AnimatedTestimonials } from "@/components/ui/animated-carousel";

export const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "Made ₦500k in my first month! The platform is so easy to use and the print quality is absolutely top-notch. My customers love the designs.",
      name: "Chidi Okonkwo",
      designation: "Anime Merch Store Owner",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Finally, a Nigerian POD platform that actually works! Fast shipping, great customer support, and the designs print beautifully on every product.",
      name: "Amina Bello",
      designation: "Graphic Designer",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Perfect for our company swag. High quality prints and reasonable prices. The automated fulfillment saves us so much time. Highly recommend!",
      name: "Tunde Adeyemi",
      designation: "Tech Startup Founder",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The zero inventory model is a game-changer. I can focus on creating amazing designs while they handle production and shipping seamlessly.",
      name: "Kemi Adebayo",
      designation: "Creative Entrepreneur",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Outstanding quality and customer service. The platform's flexibility lets me experiment with different products without any risk. Love it!",
      name: "David Okafor",
      designation: "E-commerce Store Owner",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <section className="py-32" style={{ backgroundColor: "#f8f6f0" }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span
            className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4"
            style={{
              backgroundColor: "rgba(197, 163, 255, 0.2)",
              color: "#401268",
            }}
          >
            SUCCESS STORIES
          </span>
          <h2
            className="text-5xl md:text-6xl font-black mb-6"
            style={{ color: "#401268" }}
          >
            Loved by Creators
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "rgba(64, 18, 104, 0.8)" }}
          >
            See what our community of designers and entrepreneurs are saying
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
    </section>
  );
};
