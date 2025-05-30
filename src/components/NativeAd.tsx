'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, X, Star, Clock, Users, Sparkles } from 'lucide-react';
import adsData from '../../data/ads.json';

interface NativeAdProps {
  placement: 'between_quiz' | 'pre_quiz' | 'post_quiz' | 'learning_break';
  onDismiss?: () => void;
  className?: string;
}

interface AdData {
  id: string;
  sponsor: string;
  title: string;
  description: string;
  imageUrl: string;
  clickUrl: string;
  format: string;
  bidAmount: number;
  targetAudience: any;
  performance: any;
  status: string;
}

export default function NativeAd({ placement, onDismiss, className = '' }: NativeAdProps) {
  const [currentAd, setCurrentAd] = useState<AdData | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate programmatic ad selection based on placement
    const selectOptimalAd = () => {
      const availableAds = adsData.currentAds.filter(ad => ad.status === 'active');
      
      // Simple targeting logic
      let selectedAd = availableAds[0]; // Default
      
      if (placement === 'learning_break' || placement === 'between_quiz') {
        // Prefer educational content during learning
        selectedAd = availableAds.find(ad => 
          ad.sponsor === 'FPT' || ad.title.toLowerCase().includes('học')
        ) || availableAds[0];
      } else if (placement === 'post_quiz') {
        // Higher engagement ads after completion
        selectedAd = availableAds.find(ad => 
          ad.performance.ctr > 0.06
        ) || availableAds[0];
      }
      
      setCurrentAd(selectedAd);
      setIsLoading(false);
    };

    const loadDelay = placement === 'between_quiz' ? 800 : 200; // Delay for between quiz
    setTimeout(selectOptimalAd, loadDelay);
  }, [placement]);

  const handleAdClick = () => {
    if (currentAd) {
      // Track click (in real app would send to analytics)
      console.log('Ad clicked:', currentAd.id);
      window.open(currentAd.clickUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible || !currentAd || isLoading) {
    return null;
  }

  // Different layouts based on placement
  if (placement === 'between_quiz') {
    return (
      <div className={`my-6 ${className}`}>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 relative group hover:shadow-md transition-all duration-300">
          {/* Sponsored label */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Được tài trợ
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 cursor-pointer" onClick={handleAdClick}>
            <img 
              src={currentAd.imageUrl} 
              alt={currentAd.sponsor}
              className="w-12 h-12 rounded-lg object-contain bg-white p-2"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                {currentAd.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {currentAd.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-600 font-medium">Tìm hiểu thêm</span>
                <ExternalLink className="w-3 h-3 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (placement === 'learning_break') {
    return (
      <div className={`my-8 ${className}`}>
        <div className="text-center mb-4">
          <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Nghỉ giải lao một chút 😊</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative group hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              💡 Có thể bạn quan tâm
            </span>
            <button
              onClick={handleDismiss}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 cursor-pointer" onClick={handleAdClick}>
            <img 
              src={currentAd.imageUrl} 
              alt={currentAd.sponsor}
              className="w-16 h-16 rounded-xl object-contain bg-gray-50 p-3"
            />
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-bold text-gray-900 text-lg mb-2">
                {currentAd.title}
              </h4>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {currentAd.description}
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                <span>Khám phá ngay</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (placement === 'pre_quiz') {
    return (
      <div className={`mb-6 ${className}`}>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 p-4">
          <div className="flex items-center gap-3">
            <img 
              src={currentAd.imageUrl} 
              alt={currentAd.sponsor}
              className="w-10 h-10 rounded-lg object-contain bg-white p-2"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-green-600 font-medium mb-1">
                🎯 Chuẩn bị sẵn sàng cho quiz?
              </p>
              <p className="text-sm text-gray-700 line-clamp-1">
                {currentAd.title} - {currentAd.description.substring(0, 40)}...
              </p>
            </div>
            <button
              onClick={handleAdClick}
              className="text-xs text-green-600 hover:text-green-700 font-medium whitespace-nowrap"
            >
              Xem thêm →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (placement === 'post_quiz') {
    return (
      <div className={`mt-6 ${className}`}>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center">
            <Star className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 text-lg mb-2">
              🎉 Chúc mừng bạn đã hoàn thành!
            </h4>
            <p className="text-gray-600 text-sm mb-4">
              Tiếp tục phát triển kỹ năng với {currentAd.title}
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <img 
                src={currentAd.imageUrl} 
                alt={currentAd.sponsor}
                className="w-12 h-12 rounded-lg object-contain bg-white p-2"
              />
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">
                  {currentAd.title}
                </p>
                <p className="text-xs text-gray-600">
                  {currentAd.description.substring(0, 50)}...
                </p>
              </div>
            </div>

            <button
              onClick={handleAdClick}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <span>Tìm hiểu ngay</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
} 