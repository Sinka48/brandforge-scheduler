import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const features = [
  {
    title: "Social Media Calendar",
    description: "Plan and schedule your content across multiple platforms with our intuitive calendar interface.",
  },
  {
    title: "Brand Identity Management",
    description: "Create and maintain consistent brand guidelines, color schemes, and visual assets.",
  },
  {
    title: "Campaign Analytics",
    description: "Track performance metrics and engagement rates for all your social media campaigns.",
  },
  {
    title: "AI-Powered Content",
    description: "Generate engaging content ideas and captions with our AI assistant.",
  },
  {
    title: "Multi-Platform Support",
    description: "Manage content for all major social media platforms in one place.",
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
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentFeature, isTyping]);

  return (
    <motion.div 
      key={currentFeature}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl text-left space-y-6 relative z-10"
    >
      <h2 className="text-3xl font-bold text-white">{features[currentFeature].title}</h2>
      <p className="text-xl text-white/80">
        <span className="bg-blue-500/30 rounded px-1">{displayText}</span>
        <span className="ml-1 animate-[blink_1s_infinite]">|</span>
      </p>
    </motion.div>
  );
}