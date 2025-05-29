'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Star } from 'lucide-react';

interface Investor {
  id: number;
  name: string;
  logo: string;
  dailyContribution: number;
  percentage: number;
  tier: string;
  color: string;
}

interface InvestorBubblesProps {
  investors: Investor[];
  formatCurrency: (amount: number) => string;
}

interface Bubble {
  id: number;
  investor: Investor;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
}

// Tạo tên viết tắt từ tên công ty
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 3)
    .toUpperCase();
};

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

const InvestorBubbles: React.FC<InvestorBubblesProps> = ({ investors, formatCurrency }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [hoveredBubble, setHoveredBubble] = useState<Bubble | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const animationRef = useRef<number>(0);
  const currentBubblesRef = useRef<Bubble[]>([]);

  // Đảm bảo chỉ chạy trên client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Khởi tạo bubbles
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !isClient) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = 500;

    console.log('Initializing bubbles for investors:', investors.length);
    console.log('Canvas size:', canvas.width, 'x', canvas.height);

    const newBubbles: Bubble[] = investors.map((investor) => {
      // Tính kích thước bubble dựa trên tỉ lệ đóng góp
      const minRadius = 30;
      const maxRadius = 120;
      const radius = minRadius + (investor.percentage / 25) * (maxRadius - minRadius);

      // Vị trí ban đầu ngẫu nhiên
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;

      console.log(`Bubble for ${investor.name}: radius=${radius}, position=(${x}, ${y})`);

      return {
        id: investor.id,
        investor,
        x,
        y,
        radius,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        targetX: x,
        targetY: y,
      };
    });

    setBubbles(newBubbles);
    currentBubblesRef.current = newBubbles;
    console.log('Bubbles initialized:', newBubbles.length);
  }, [investors, isClient]);

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || bubbles.length === 0 || !isClient) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('Starting animation loop with', currentBubblesRef.current.length, 'bubbles');

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cập nhật vị trí bubbles
      currentBubblesRef.current = currentBubblesRef.current.map(bubble => {
        let { x, y, vx, vy } = bubble;

        // Physics - di chuyển nhẹ nhàng
        vx *= 0.99; // Friction
        vy *= 0.99;

        // Thêm chút random movement
        vx += (Math.random() - 0.5) * 0.1;
        vy += (Math.random() - 0.5) * 0.1;

        x += vx;
        y += vy;

        // Bounce off walls
        if (x - bubble.radius < 0 || x + bubble.radius > canvas.width) {
          vx *= -0.8;
          x = Math.max(bubble.radius, Math.min(canvas.width - bubble.radius, x));
        }
        if (y - bubble.radius < 0 || y + bubble.radius > canvas.height) {
          vy *= -0.8;
          y = Math.max(bubble.radius, Math.min(canvas.height - bubble.radius, y));
        }

        return { ...bubble, x, y, vx, vy };
      });

      // Collision detection và separation
      for (let i = 0; i < currentBubblesRef.current.length; i++) {
        for (let j = i + 1; j < currentBubblesRef.current.length; j++) {
          const bubble1 = currentBubblesRef.current[i];
          const bubble2 = currentBubblesRef.current[j];
          
          const dx = bubble2.x - bubble1.x;
          const dy = bubble2.y - bubble1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = bubble1.radius + bubble2.radius;

          if (distance < minDistance) {
            // Separate bubbles
            const overlap = minDistance - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;

            bubble1.x -= separationX;
            bubble1.y -= separationY;
            bubble2.x += separationX;
            bubble2.y += separationY;

            // Bounce effect
            const bounce = 0.3;
            bubble1.vx -= separationX * bounce;
            bubble1.vy -= separationY * bounce;
            bubble2.vx += separationX * bounce;
            bubble2.vy += separationY * bounce;
          }
        }
      }

      // Vẽ bubbles
      currentBubblesRef.current.forEach((bubble, index) => {
        const isHovered = hoveredBubble?.id === bubble.id;
        const scale = isHovered ? 1.1 : 1;
        const currentRadius = bubble.radius * scale;

        // Debug log cho bubble đầu tiên
        if (index === 0) {
          console.log(`Drawing bubble ${bubble.investor.name} at (${bubble.x}, ${bubble.y}) with radius ${currentRadius}`);
        }

        // Gradient background
        const gradient = ctx.createRadialGradient(
          bubble.x, bubble.y, 0,
          bubble.x, bubble.y, currentRadius
        );
        gradient.addColorStop(0, getTierColor(bubble.investor.tier) + '40');
        gradient.addColorStop(0.7, getTierColor(bubble.investor.tier) + '80');
        gradient.addColorStop(1, getTierColor(bubble.investor.tier));

        // Vẽ bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Border
        ctx.strokeStyle = getTierColor(bubble.investor.tier);
        ctx.lineWidth = isHovered ? 4 : 2;
        ctx.stroke();

        // Glow effect khi hover
        if (isHovered) {
          ctx.shadowColor = getTierColor(bubble.investor.tier);
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, currentRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Logo hoặc initials
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.max(currentRadius * 0.3, 12)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          getInitials(bubble.investor.name),
          bubble.x,
          bubble.y - 5
        );

        // Percentage text
        ctx.fillStyle = '#fbbf24';
        ctx.font = `bold ${Math.max(currentRadius * 0.2, 10)}px Arial`;
        ctx.fillText(
          `${bubble.investor.percentage}%`,
          bubble.x,
          bubble.y + currentRadius * 0.3
        );
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bubbles.length, hoveredBubble, isClient]);

  // Handle mouse events - sử dụng currentBubblesRef
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setMousePos({ x: event.clientX, y: event.clientY });

    // Check hover - sử dụng currentBubblesRef
    const hoveredBubble = currentBubblesRef.current.find(bubble => {
      const dx = x - bubble.x;
      const dy = y - bubble.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= bubble.radius;
    });

    setHoveredBubble(hoveredBubble || null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredBubble(null);
  }, []);

  return (
    <div className="w-full bg-gray-900 rounded-2xl p-6 overflow-hidden">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
          🫧 Bong Bóng Nhà Tài Trợ
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Kích thước bong bóng tương ứng với tỉ lệ đóng góp. Hover để xem chi tiết.
        </p>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-300 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span>Platinum (25%+)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Gold (15-20%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Silver (10%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Bronze (2-5%)</span>
          </div>
        </div>
      </div>

      {/* Canvas container */}
      <div 
        ref={containerRef}
        className="relative w-full h-[500px] bg-gray-800 rounded-xl overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* Tooltip */}
        {hoveredBubble && (
          <div 
            className="absolute bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-700 min-w-[250px] z-10 pointer-events-none"
            style={{
              left: mousePos.x - 125,
              top: mousePos.y - 120,
            }}
          >
            <div className="flex items-center mb-2">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: getTierColor(hoveredBubble.investor.tier) }}
              ></div>
              <div className="font-bold text-lg">{hoveredBubble.investor.name}</div>
            </div>
            <div className="text-sm text-gray-300 mb-1">
              Tier: <span className="capitalize text-yellow-400">{hoveredBubble.investor.tier}</span>
            </div>
            <div className="text-sm text-gray-300 mb-1">
              Đóng góp: <span className="text-green-400">{formatCurrency(hoveredBubble.investor.dailyContribution)}/ngày</span>
            </div>
            <div className="text-sm text-gray-300 mb-1">
              Tỉ lệ: <span className="text-blue-400">{hoveredBubble.investor.percentage}% tổng pool</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Kích thước bong bóng: {Math.round(hoveredBubble.radius)}px
            </div>
          </div>
        )}
      </div>
 
    </div>
  );
};

export default InvestorBubbles; 