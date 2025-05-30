'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import NotificationSystem, { useNotifications } from '../components/NotificationSystem';

interface NotificationContextType {
  success: (title: string, message: string, options?: any) => void;
  error: (title: string, message: string, options?: any) => void;
  warning: (title: string, message: string, options?: any) => void;
  info: (title: string, message: string, options?: any) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const {
    notifications,
    removeNotification,
    success,
    error,
    warning,
    info,
    clearAll
  } = useNotifications();

  const contextValue: NotificationContextType = {
    success,
    error,
    warning,
    info,
    clearAll
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {/* <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      /> */}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}; 