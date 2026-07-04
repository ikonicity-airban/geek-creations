"use client";

import { motion } from "framer-motion";
import { AnimatedTestimonials } from "@/components/ui/animated-carousel";

export const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "The print quality is incredible — my hoodie still looks brand new after multiple washes. Exactly what I saw on the site.",
      name: "Chidi Okonkwo",
      designation: "Verified Buyer",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Ordered a custom mug for my brother's birthday. Fast delivery within Lagos and the design came out crisp.",
      name: "Amina Bello",
      designation: "Verified Buyer",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Got hoodies for my whole team with our own logo. Comfortable fabric, and support was responsive when I had sizing questions.",
      name: "Tunde Adeyemi",
      designation: "Verified Buyer",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Love the anime designs! The fabric is so soft and fits perfectly. Will definitely be buying more from here.",
      name: "Kemi Adebayo",
      designation: "Verified Buyer",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Got the Afro-geek t-shirts and they're a huge hit. Fast shipping to Abuja and premium packaging. 5 stars!",
      name: "David Okafor",
      designation: "Verified Buyer",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4 bg-secondary/20 text-accent">
            REVIEWS
          </span>
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-primary">
            Customer Reviews
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto ">
            See what our customers are saying about Geeks Creation
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </div>
    </section>
  );
};
