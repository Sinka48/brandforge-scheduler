import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Neural Content Creation",
    description: "AI-driven content that adapts to your brand's unique voice.",
  },
  {
    title: "Quantum Analytics",
    description: "Real-time insights powered by advanced data processing.",
  },
  {
    title: "Smart Automation",
    description: "Next-gen scheduling with predictive optimization.",
  },
  {
    title: "Unified Dashboard",
    description: "Seamless control across all social platforms.",
  },
  {
    title: "AI Brand Evolution",
    description: "Dynamic brand growth through machine learning.",
  }
];

export function FeaturesAnimation() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
      setDisplayText("");
      setIsTyping(true);
    }, 10000); // Changed to 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isTyping) return;

    const text = features[currentFeature].description;
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentFeature, isTyping]);

  return (
    <motion.div 
      key={currentFeature}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-2xl text-left space-y-4 relative z-10"
    >
      <motion.h2 
        className="text-3xl font-bold text-white truncate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {features[currentFeature].title}
      </motion.h2>
      <p className="text-sm font-normal text-white/80 whitespace-nowrap overflow-hidden">
        <motion.span 
          className="bg-blue-500/30 rounded px-1 truncate inline-flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {displayText}
          <span className="animate-[blink_0.7s_infinite] ml-0.5">|</span>
        </motion.span>
      </p>
    </motion.div>
  );
}