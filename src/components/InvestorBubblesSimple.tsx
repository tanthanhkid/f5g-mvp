'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Investor {
  id: number;
  name: string;
  logo: string;
  dailyContribution: number;
  percentage: number;
  tier: string;
  color: string;
}

interface InvestorBubblesSimpleProps {
  investors: Investor[];
  formatCurrency: (amount: number) => string;
}

// Lấy màu theo tier
const getTierColor = (tier: string) => {
  switch (tier) {
    case 'platinum': return '#8b5cf6';
    case 'gold': return '#f59e0b';
    case 'silver': return '#3b82f6';
    case 'bronze': return '#10b981';
    default: return '#6b7280';
  }
};

// Tạo tên viết tắt từ tên công ty
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 3)
    .toUpperCase();
};

const InvestorBubblesSimple: React.FC<InvestorBubblesSimpleProps> = ({ investors, formatCurrency }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  console.log('InvestorBubblesSimple rendered with', investors.length, 'investors');

  useEffect(() => {
    setIsClient(true);
    console.log('Client side mounted');
  }, []);

  useEffect(() => {
    console.log('Drawing effect triggered:', {
      hasCanvas: !!canvasRef.current,
      isClient,
      investorsCount: investors.length
    });

    if (!canvasRef.current || !isClient) {
      console.log('Early return: canvas or client not ready');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('No canvas context');
      return;
    }

    // Get actual container size
    const container = canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      console.log('Canvas size set to:', canvas.width, 'x', canvas.height);
    } else {
      // Fallback
      canvas.width = 800;
      canvas.height = 500;
    }

    console.log('Drawing simple bubbles for', investors.length, 'investors');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background for testing
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (investors.length === 0) {
      // Draw placeholder text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Đang tải dữ liệu Nhà Tài Trợ...', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Draw static bubbles
    investors.forEach((investor, index) => {
      const minRadius = 30;
      const maxRadius = 120;
      const radius = minRadius + (investor.percentage / 25) * (maxRadius - minRadius);
      
      // Simple positioning - adjust for canvas size
      const cols = Math.floor(canvas.width / 200);
      const x = 100 + (index % cols) * (canvas.width / cols);
      const y = 100 + Math.floor(index / cols) * 150;

      console.log(`Drawing ${investor.name} at (${x}, ${y}) with radius ${radius}`);

      // Draw bubble
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = getTierColor(investor.tier);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(getInitials(investor.name), x, y - 10);
      
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`${investor.percentage}%`, x, y + 10);
    });

  }, [investors, isClient]);

  return (
    <div className="w-full bg-gray-900 rounded-2xl p-6 overflow-hidden">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
          🫧 Bong Bóng Nhà Tài Trợ (Simple)
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Phiên bản đơn giản để test. Kích thước bong bóng tương ứng với tỉ lệ đóng góp.
        </p>
        <p className="text-gray-400 text-xs">
          Debug: {investors.length} investors, isClient: {isClient.toString()}
        </p>
      </div>

      <div className="w-full h-[500px] bg-gray-800 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ 
            display: 'block',
            width: '100%',
            height: '100%',
            backgroundColor: '#1f2937'
          }}
        />
      </div>
    </div>
  );
};

export default InvestorBubblesSimple; 