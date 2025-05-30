'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onRemove
}) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColors = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-rose-500',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-slate-500',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600'
        };
    }
  };

  // Giới hạn số lượng notifications hiển thị (tối đa 5)
  const visibleNotifications = notifications.slice(0, 5);

  return (
    <div className="fixed top-20 right-4 z-40 space-y-3 max-w-sm w-full sm:max-w-xs sm:right-6 md:max-w-sm md:right-4">
      <AnimatePresence>
        {visibleNotifications.map((notification) => {
          const colors = getColors(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              {/* Notification Card */}
              <div className={`bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border ${colors.border} overflow-hidden mx-2 sm:mx-0`}>
                {/* Colored Top Bar */}
                <div className={`h-1 ${colors.bg}`} />
                
                <div className="p-3 sm:p-4">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    {/* Icon */}
                    <div className={`${colors.icon} mt-0.5 flex-shrink-0`}>
                      {getIcon(notification.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold ${colors.text} text-xs sm:text-sm`}>
                        {notification.title}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      {/* Action Button */}
                      {notification.action && (
                        <button
                          onClick={notification.action.onClick}
                          className={`mt-2 sm:mt-3 text-xs font-medium ${colors.icon} hover:underline`}
                        >
                          {notification.action.label}
                        </button>
                      )}
                    </div>
                    
                    {/* Close Button */}
                    <button
                      onClick={() => onRemove(notification.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar for Auto-dismiss */}
              {notification.duration && (
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: notification.duration / 1000, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-0.5 ${colors.bg} mx-2 sm:mx-0`}
                  onAnimationComplete={() => onRemove(notification.id)}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Indicator for hidden notifications */}
      {notifications.length > 5 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mx-2 sm:mx-0"
        >
          <div className="bg-gray-800/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full">
            +{notifications.length - 5} thông báo khác
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Hook để quản lý notifications với anti-spam
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentMessages, setRecentMessages] = useState<Set<string>>(new Set());

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    // Anti-spam: kiểm tra nếu message giống nhau trong 3 giây gần đây
    const messageKey = `${notification.title}-${notification.message}`;
    if (recentMessages.has(messageKey)) {
      return; // Bỏ qua notification trùng lặp
    }

    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000
    };
    
    setNotifications(prev => {
      // Giới hạn tối đa 10 notifications trong queue
      const updated = [...prev, newNotification];
      return updated.slice(-10);
    });
    
    // Thêm vào recent messages để tránh spam
    setRecentMessages(prev => new Set(prev).add(messageKey));
    
    // Xóa khỏi recent messages sau 3 giây
    setTimeout(() => {
      setRecentMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageKey);
        return newSet;
      });
    }, 3000);
    
    // Auto remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setRecentMessages(new Set());
  };

  // Convenience methods
  const success = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'success', title, message, ...options });
  };

  const error = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'error', title, message, ...options });
  };

  const warning = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'warning', title, message, ...options });
  };

  const info = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'info', title, message, ...options });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };
};

export default NotificationSystem; 