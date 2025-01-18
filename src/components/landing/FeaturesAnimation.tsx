import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const features = [
  {
    title: "AI Content Creation",
    description: "Generate engaging posts in seconds with our AI engine.",
  },
  {
    title: "Smart Scheduling",
    description: "Post at optimal times with predictive analytics.",
  },
  {
    title: "Cross-Platform Management",
    description: "Manage all social networks from one dashboard.",
  },
  {
    title: "Live Analytics",
    description: "Track performance with real-time insights.",
  },
  {
    title: "Brand Evolution",
    description: "Adapt your brand with AI recommendations.",
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
    }, 5000); // Set to 5 seconds
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
      className="max-w-2xl text-left space-y-4"
    >
      <motion.h2 
        className="text-3xl font-bold text-white truncate"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {features[currentFeature].title}
      </motion.h2>
      <div className="overflow-hidden whitespace-nowrap">
        <motion.p 
          className="text-sm text-white/80 font-normal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <span className="bg-blue-500/30 rounded px-1 truncate max-w-full">
            {displayText}
          </span>
          <span className="ml-1 animate-[blink_1s_infinite]">|</span>
        </motion.p>
      </div>
    </motion.div>
  );
}