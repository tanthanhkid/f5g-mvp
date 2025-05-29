'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { VideoBlock as VideoBlockType } from '@/types';
import { Play, Pause, Volume2, VolumeX, Maximize, Clock } from 'lucide-react';

// YouTube API type declaration
declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: Record<string, unknown>) => unknown;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
  }
}

interface VideoBlockProps {
  block: VideoBlockType;
  onComplete?: () => void;
  onProgress?: (watchedTime: number, totalTime: number) => void;
  isActive?: boolean;
  minimumWatchPercentage?: number;
}

export default function VideoBlock({ 
  block, 
  onComplete, 
  onProgress, 
  isActive = false,
  minimumWatchPercentage = 80 
}: VideoBlockProps) {
  const [currentTime] = useState(0);
  const [duration] = useState(block.duration || 0);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // YouTube iframe API integration
  useEffect(() => {
    // Load YouTube iframe API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Track video progress
  useEffect(() => {
    if (duration > 0) {
      const percentage = (currentTime / duration) * 100;
      setWatchedPercentage(percentage);
      
      if (percentage >= minimumWatchPercentage && !canComplete) {
        setCanComplete(true);
      }
      
      if (onProgress) {
        onProgress(currentTime, duration);
      }
    }
  }, [currentTime, duration, minimumWatchPercentage, canComplete]);

  const handleComplete = useCallback(() => {
    if (canComplete && onComplete) {
      onComplete();
    }
  }, [canComplete, onComplete]);

  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all duration-300 ${
      isActive ? 'ring-2 ring-blue-500 shadow-md' : ''
    }`}>
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Play className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">{block.title}</h3>
          </div>
          {duration > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>
        {block.description && (
          <p className="mt-2 text-gray-600 text-sm">{block.description}</p>
        )}
      </div>

      <div className="p-6">
        {/* YouTube Video Embed */}
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${block.youtubeId}?enablejsapi=1&origin=${window.location.origin}`}
            title={block.title}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Tiến độ xem</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(watchedPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${watchedPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cần xem tối thiểu {minimumWatchPercentage}% để tiếp tục
          </p>
        </div>

        {/* Complete Button */}
        {onComplete && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={handleComplete}
              disabled={!canComplete}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                canComplete
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canComplete ? 'Tiếp tục' : `Xem thêm ${minimumWatchPercentage - Math.round(watchedPercentage)}%`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 