'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, Trophy, Users } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Đang tải...", 
  isVisible 
}) => {
  if (!isVisible) return null;

  const iconVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingIcons = [
    { Icon: BookOpen, delay: 0, color: "text-blue-500" },
    { Icon: Trophy, delay: 0.5, color: "text-yellow-500" },
    { Icon: Users, delay: 1, color: "text-green-500" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-sm"
    >
      <div className="text-center">
        {/* Main Loading Animation */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-blue-200/30 border-t-blue-500 rounded-full mx-auto"
          />
          
          {/* Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              variants={iconVariants}
              animate="animate"
              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg"
            >
              <img 
                src="/17164524823262_logo-web-con-voi.png" 
                alt="Logo" 
                className="w-6 h-6 object-contain"
              />
            </motion.div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="flex justify-center space-x-8 mb-8">
          {floatingIcons.map(({ Icon, delay, color }, index) => (
            <motion.div
              key={index}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
              }}
              className={`w-12 h-12 ${color} bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm`}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
          ))}
        </div>

        {/* Loading Text */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white"
        >
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Freedom Training
          </h3>
          <p className="text-blue-200 text-lg">{message}</p>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-4">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                className="w-2 h-2 bg-blue-400 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Background Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay; 