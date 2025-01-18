import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const features = [
  {
    title: "AI-Powered Content Engine",
    description: "Generate engaging posts with our next-gen AI that understands your brand voice.",
  },
  {
    title: "Smart Schedule Optimization",
    description: "Leverage predictive analytics to post at peak engagement times.",
  },
  {
    title: "Cross-Platform Synergy",
    description: "Seamlessly manage your digital presence across all social networks.",
  },
  {
    title: "Real-Time Analytics",
    description: "Track performance metrics with instant insights and predictions.",
  },
  {
    title: "Dynamic Brand Evolution",
    description: "Adapt your brand identity with AI-driven style recommendations.",
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
    }, 5000);
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
      className="max-w-2xl text-left space-y-6 relative z-10"
    >
      <motion.h2 
        className="text-3xl font-bold text-white truncate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {features[currentFeature].title}
      </motion.h2>
      <p className="text-xl text-white/80 whitespace-nowrap overflow-hidden">
        <motion.span 
          className="bg-blue-500/30 rounded px-1 inline-block truncate max-w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {displayText}
        </motion.span>
        <span className="ml-1 animate-[blink_1s_infinite]">|</span>
      </p>
    </motion.div>
  );
}