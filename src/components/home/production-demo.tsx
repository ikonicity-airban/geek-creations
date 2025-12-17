"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { Package, Zap, Truck } from "lucide-react";

export const ProductionDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const controls = useAnimation();

  const steps = [
    { name: "Design", icon: "🎨", color: "#c5a3ff" },
    { name: "Product", icon: "👕", color: "#401268" },
    { name: "Production", icon: "🖨️", color: "#e2ae3d" },
    { name: "Package", icon: "📦", color: "#e21b35" },
  ];

  useEffect(() => {
    const sequence = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await controls.start({
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
          transition: { duration: 1 }
        });
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      // Reset and loop
      setCurrentStep(0);
      setTimeout(() => sequence(), 1000);
    };
    sequence();
  }, [controls, steps.length]);

  // Particle positions for zaps
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 12,
    distance: 60 + Math.random() * 40,
  }));

  return (
    <section className="py-32 relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6" style={{ color: '#401268' }}>
            See It Come to Life
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(64, 18, 104, 0.8)' }}>
            Watch your design transform from concept to shipped product
          </p>
        </motion.div>

        {/* Production Animation Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Animation Area */}
          <div
            className="relative h-96 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: '#f8f6f0',
              borderRadius: '16px',
              border: '2px solid rgba(197, 163, 255, 0.2)'
            }}
          >
            {/* Central Product Display */}
            <motion.div
              animate={controls}
              className="relative z-10"
            >
              <div
                className="w-48 h-48 rounded-xl flex flex-col items-center justify-center"
                style={{
                  backgroundColor: steps[currentStep].color,
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(64,18,104,0.2)'
                }}
              >
                <div className="text-6xl mb-2">{steps[currentStep].icon}</div>
                <div className="text-white font-bold text-lg">{steps[currentStep].name}</div>
              </div>
            </motion.div>

            {/* Particle Zaps Animation */}
            {currentStep === 0 && (
              <div className="absolute inset-0">
                {particles.map((particle) => {
                  const x = Math.cos((particle.angle * Math.PI) / 180) * particle.distance;
                  const y = Math.sin((particle.angle * Math.PI) / 180) * particle.distance;
                  
                  return (
                    <motion.div
                      key={particle.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: [0, x],
                        y: [0, y],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: particle.id * 0.1,
                        ease: "easeOut"
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: '#c5a3ff',
                        boxShadow: '0 0 10px #c5a3ff'
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Step Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: index === currentStep ? step.color : 'rgba(64, 18, 104, 0.2)',
                    scale: index === currentStep ? 1.5 : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* Step Labels */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className="w-16 h-16 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{
                    backgroundColor: index === currentStep ? step.color : 'rgba(197, 163, 255, 0.1)',
                    color: index === currentStep ? '#ffffff' : '#401268'
                  }}
                >
                  {index === 0 && <Package className="w-8 h-8" />}
                  {index === 1 && <Package className="w-8 h-8" />}
                  {index === 2 && <Zap className="w-8 h-8" />}
                  {index === 3 && <Truck className="w-8 h-8" />}
                </div>
                <h3 className="font-bold" style={{ color: '#401268' }}>{step.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Placeholder Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm" style={{ color: 'rgba(64, 18, 104, 0.6)' }}>
            * Enhanced animation with particle effects and production sequence coming soon
          </p>
        </motion.div>
      </div>
    </section>
  );
};

