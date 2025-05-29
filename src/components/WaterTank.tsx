'use client';

import React, { useEffect, useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Droplets, TrendingDown, Coins, TrendingUp, Target } from 'lucide-react';

interface WaterTankProps {
  totalPool: number;
  remainingPool: number;
  dailyContributed: number;
  formatCurrency: (amount: number) => string;
}

const WaterTank: React.FC<WaterTankProps> = memo(({ 
  totalPool, 
  remainingPool, 
  dailyContributed, 
  formatCurrency 
}) => {
  const [currentDate, setCurrentDate] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  // Memoized calculations
  const calculations = useMemo(() => {
    const waterLevel = (remainingPool / totalPool) * 100;
    const usedPercentage = ((totalPool - remainingPool) / totalPool) * 100;
    const remainingTUTE = Math.floor(remainingPool / 1000);
    const totalTUTE = Math.floor(totalPool / 1000);
    
    // SVG circle calculations
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (waterLevel / 100) * circumference;
    
    return {
      waterLevel,
      usedPercentage,
      remainingTUTE,
      totalTUTE,
      radius,
      circumference,
      strokeDasharray,
      strokeDashoffset
    };
  }, [totalPool, remainingPool]);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getWaterColor = (level: number) => {
    if (level > 70) return 'from-blue-400 to-cyan-500';
    if (level > 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getStatusIcon = (level: number) => {
    if (level > 70) return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (level > 40) return <Target className="w-5 h-5 text-yellow-500" />;
    return <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = (level: number) => {
    if (level > 70) return { text: 'Còn nhiều', color: 'text-green-600' };
    if (level > 40) return { text: 'Sắp hết', color: 'text-yellow-600' };
    return { text: 'Cần bổ sung', color: 'text-red-600' };
  };

  const status = getStatusText(calculations.waterLevel);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-lg mx-auto my-8"
    >
      {/* Header Information */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -10 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-3">
          <Calendar className="w-5 h-5 text-orange-500 mr-2" />
          <p className="text-sm font-medium text-gray-600">{currentDate}</p>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Pool Tài Trợ
        </h3>
        <div className="flex items-center justify-center space-x-2">
          {getStatusIcon(calculations.waterLevel)}
          <span className={`text-sm font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>
      </motion.div>

      {/* Main Circle Progress */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: isVisible ? 1 : 0.8, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="relative flex items-center justify-center mb-10"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl scale-110" />
        
        <svg className="w-72 h-72 transform -rotate-90 relative z-10" viewBox="0 0 200 200">
          {/* Gradient definitions - moved to top */}
          <defs>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3f4f6" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          
          {/* Background circle with enhanced border */}
          <circle
            cx="100"
            cy="100"
            r={calculations.radius}
            stroke="url(#backgroundGradient)"
            strokeWidth="8"
            fill="none"
            className="opacity-50"
          />
          
          {/* Progress circle with gradient */}
          <motion.circle
            cx="100"
            cy="100"
            r={calculations.radius}
            stroke="url(#waterGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={calculations.strokeDasharray}
            initial={{ strokeDashoffset: calculations.circumference }}
            animate={{ strokeDashoffset: calculations.strokeDashoffset }}
            transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            className="drop-shadow-lg filter drop-shadow-md"
          />
        </svg>
        
        {/* Center content */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: isVisible ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2"
            >
              {calculations.waterLevel.toFixed(1)}%
            </motion.div>
            <div className="text-sm text-gray-600 font-medium">
              Pool còn lại
            </div>
            <div className="mt-2 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-xs text-blue-600 font-medium">
                {calculations.remainingTUTE.toLocaleString()} TUTE
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
 

      {/* Additional Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-6 text-center"
      >
    
      </motion.div>
    </motion.div>
  );
});

WaterTank.displayName = 'WaterTank';

export default WaterTank; 