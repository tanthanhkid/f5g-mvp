'use client';

import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function LoadingOverlay({ isVisible, message = "Đang xử lý..." }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4 max-w-sm mx-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-blue-100"></div>
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin absolute inset-0" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Vui lòng đợi</h3>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
} 