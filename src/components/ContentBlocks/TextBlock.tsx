'use client';

import { TextBlock as TextBlockType } from '@/types';
import { BookOpen } from 'lucide-react';

interface TextBlockProps {
  block: TextBlockType;
  onComplete?: () => void;
  isActive?: boolean;
}

export default function TextBlock({ block, onComplete, isActive = false }: TextBlockProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all duration-300 ${
      isActive ? 'ring-2 ring-blue-500 shadow-md' : ''
    }`}>
      {block.title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{block.title}</h3>
          </div>
        </div>
      )}
      
      <div className="px-6 py-6">
        <div 
          className="text-gray-900 leading-relaxed space-y-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-gray-900 [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-medium [&>h3]:text-gray-900 [&>h3]:mb-2 [&>p]:text-gray-700 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-1 [&>li]:text-gray-700 [&>strong]:font-semibold [&>strong]:text-gray-900 [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
        
        {onComplete && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onComplete}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Tiếp tục
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 