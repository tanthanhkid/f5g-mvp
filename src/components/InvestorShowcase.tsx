'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Search, Star, TrendingUp, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import WaterTank from './WaterTank';
import { useRouter } from 'next/navigation';

interface Investor {
  id: number;
  name: string;
  shortName?: string;
  stockCode?: string;
  logo: string;
  dailyContribution: number;
  percentage: number;
  tier: string;
  color: string;
  sector?: string;
}

interface InvestorData {
  dailyPool: number;
  totalPool: number;
  investors: Investor[];
  minorSponsors?: string[];
}

interface InvestorShowcaseProps {
  investorData: InvestorData;
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

// Tạo tên viết tắt từ tên công ty hoặc mã chứng khoán
const getInitials = (investor: Investor) => {
  if (investor.stockCode) {
    return investor.stockCode;
  }
  return investor.shortName || investor.name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 3)
    .toUpperCase();
};

// Component bong bóng cho top 10
const TopInvestorBubbles: React.FC<{ 
  topInvestors: Investor[]; 
  formatCurrency: (amount: number) => string;
}> = ({ topInvestors, formatCurrency }) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredInvestor, setHoveredInvestor] = useState<Investor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || topInvestors.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const container = canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 600;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create bubble layout
    const bubbles = topInvestors.map((investor, index) => {
      const minRadius = 40;
      const maxRadius = 140;
      const radius = minRadius + (investor.percentage / 25) * (maxRadius - minRadius);
      
      // Positioning logic for attractive layout
      let x, y;
      if (index === 0) {
        // Largest bubble in center-left
        x = canvas.width * 0.25;
        y = canvas.height * 0.4;
      } else if (index === 1) {
        // Second largest in center-right
        x = canvas.width * 0.65;
        y = canvas.height * 0.35;
      } else if (index === 2) {
        // Third in top-right
        x = canvas.width * 0.8;
        y = canvas.height * 0.2;
      } else {
        // Others in a flowing pattern
        const angle = (index - 3) * (Math.PI * 2 / 7);
        const centerX = canvas.width * 0.5;
        const centerY = canvas.height * 0.7;
        const orbitRadius = 180;
        x = centerX + Math.cos(angle) * orbitRadius;
        y = centerY + Math.sin(angle) * orbitRadius * 0.6;
      }

      return { investor, x, y, radius };
    });

    // Draw bubbles
    bubbles.forEach((bubble) => {
      const isHovered = hoveredInvestor?.id === bubble.investor.id;
      const scale = isHovered ? 1.1 : 1;
      const currentRadius = bubble.radius * scale;

      // Create gradient
      const gradient = ctx.createRadialGradient(
        bubble.x, bubble.y, 0,
        bubble.x, bubble.y, currentRadius
      );
      gradient.addColorStop(0, getTierColor(bubble.investor.tier) + '40');
      gradient.addColorStop(0.7, getTierColor(bubble.investor.tier) + '80');
      gradient.addColorStop(1, getTierColor(bubble.investor.tier));

      // Draw bubble
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Border
      ctx.strokeStyle = getTierColor(bubble.investor.tier);
      ctx.lineWidth = isHovered ? 4 : 2;
      ctx.stroke();

      // Glow effect when hovered
      if (isHovered) {
        ctx.shadowColor = getTierColor(bubble.investor.tier);
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, currentRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Company text
      ctx.fillStyle = 'white';
      ctx.font = `bold ${Math.max(currentRadius * 0.2, 12)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        bubble.investor.shortName || bubble.investor.name.split(' ')[0],
        bubble.x,
        bubble.y - 10
      );

      // Percentage
      ctx.fillStyle = '#fbbf24';
      ctx.font = `bold ${Math.max(currentRadius * 0.15, 10)}px Arial`;
      ctx.fillText(
        `${bubble.investor.percentage}%`,
        bubble.x,
        bubble.y + 15
      );
    });

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const hoveredBubble = bubbles.find(bubble => {
        const dx = x - bubble.x;
        const dy = y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= bubble.radius;
      });

      setHoveredInvestor(hoveredBubble?.investor || null);
      
      // Change cursor style
      canvas.style.cursor = hoveredBubble ? 'pointer' : 'default';
    };

    const handleMouseLeave = () => {
      setHoveredInvestor(null);
      canvas.style.cursor = 'default';
    };

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clickedBubble = bubbles.find(bubble => {
        const dx = x - bubble.x;
        const dy = y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= bubble.radius;
      });

      if (clickedBubble) {
        router.push(`/investors/${clickedBubble.investor.id}`);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [topInvestors, hoveredInvestor, formatCurrency, router]);

  return (
    <div ref={containerRef} className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-[600px]"
        style={{ display: 'block' }}
      />
    </div>
  );
};

// Component danh sách cho các Nhà Tài Trợ còn lại
const InvestorList: React.FC<{
  investors: Investor[];
  formatCurrency: (amount: number) => string;
}> = ({ investors, formatCurrency }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Responsive items per page
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Update items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 640 ? 5 : 10);
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const filteredInvestors = useMemo(() => {
    return investors.filter(investor =>
      investor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [investors, searchTerm]);

  // Reset về trang 1 khi search hoặc thay đổi itemsPerPage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredInvestors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvestors = filteredInvestors.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
      {/* Header - Mobile First Design */}
      <div className="mb-4 sm:mb-6">
        {/* Title Section */}
        <div className="flex items-center mb-4">
          <Building2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
              Các Nhà Tài Trợ Khác
            </h3>
            <p className="text-xs sm:text-sm font-normal text-gray-500 mt-0.5">
              ({filteredInvestors.length} Nhà Tài Trợ) - Click để xem chi tiết
            </p>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm Nhà Tài Trợ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Hiển thị thông tin phân trang */}
      {filteredInvestors.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-0">
          <div>
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredInvestors.length)} trong tổng số {filteredInvestors.length} Nhà Tài Trợ
          </div>
          <div>
            Trang {currentPage} / {totalPages}
          </div>
        </div>
      )}

      {/* Investor Cards - Responsive Grid */}
      <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4 lg:gap-6">
        {currentInvestors.map((investor) => (
          <div
            key={investor.id}
            className="bg-gray-50 rounded-xl p-3 sm:p-4 hover:bg-gray-100 transition-colors border border-gray-200 sm:h-full cursor-pointer hover:shadow-md"
            onClick={() => router.push(`/investors/${investor.id}`)}
          >
            {/* Mobile Layout - Horizontal */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center flex-1 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3 flex-shrink-0"
                    style={{ backgroundColor: getTierColor(investor.tier) }}
                  >
                    {getInitials(investor)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{investor.shortName || investor.name}</h4>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      {investor.stockCode && <span>({investor.stockCode})</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-base font-bold text-blue-600">{investor.percentage}%</div>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Đóng góp/ngày:</span>
                  <span className="font-semibold text-xs">{formatCurrency(investor.dailyContribution)}</span>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Vertical Card */}
            <div className="hidden sm:block h-full">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3 flex-shrink-0"
                    style={{ backgroundColor: getTierColor(investor.tier) }}
                  >
                    {getInitials(investor)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-bold text-blue-600 mb-1">{investor.percentage}%</div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                    {investor.shortName || investor.name}
                  </h4>
                  
                  <div className="space-y-1 text-xs text-gray-500 mb-3">
                    {investor.stockCode && (
                      <div className="flex items-center">
                        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">
                          {investor.stockCode}
                        </span>
                      </div>
                    )}
                    {investor.sector && (
                      <div className="text-gray-600 truncate">{investor.sector}</div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    <div className="text-center">
                      <span className="text-gray-500 block mb-1">Đóng góp/ngày</span>
                      <span className="font-semibold text-green-600 text-sm">
                        {formatCurrency(investor.dailyContribution)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {filteredInvestors.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-4 sm:mt-6 space-y-3 sm:space-y-0 sm:space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Trước
          </button>

          {/* Hiển thị số trang - Mobile optimized */}
          <div className="flex items-center space-x-1 overflow-x-auto px-2 max-w-full">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Sau
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* Không có kết quả */}
      {filteredInvestors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">Không tìm thấy nhà tài trợ nào</p>
          <p className="text-sm">Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      )}
    </div>
  );
};

// Component leaderboard cho mobile (game-style)
const TopInvestorLeaderboard: React.FC<{ 
  topInvestors: Investor[]; 
  formatCurrency: (amount: number) => string;
}> = ({ topInvestors, formatCurrency }) => {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
          border: 'border-yellow-300',
          text: 'text-yellow-900',
          crown: '👑'
        };
      case 2:
        return {
          bg: 'bg-gradient-to-r from-gray-300 to-gray-500',
          border: 'border-gray-300',
          text: 'text-gray-900',
          crown: '🥈'
        };
      case 3:
        return {
          bg: 'bg-gradient-to-r from-orange-400 to-orange-600',
          border: 'border-orange-300',
          text: 'text-orange-900',
          crown: '🥉'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          border: 'border-blue-300',
          text: 'text-blue-900',
          crown: ''
        };
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum': return { label: 'PLATINUM', color: 'bg-purple-500', icon: '💎' };
      case 'gold': return { label: 'GOLD', color: 'bg-yellow-500', icon: '🏆' };
      case 'silver': return { label: 'SILVER', color: 'bg-blue-500', icon: '🥈' };
      case 'bronze': return { label: 'BRONZE', color: 'bg-green-500', icon: '🥉' };
      default: return { label: 'MEMBER', color: 'bg-gray-500', icon: '⭐' };
    }
  };

  return (
    <div className="space-y-3">
      {topInvestors.map((investor, index) => {
        const rank = index + 1;
        const rankStyle = getRankStyle(rank);
        const tierBadge = getTierBadge(investor.tier);
        const isTopThree = rank <= 3;
        
        return (
          <div
            key={investor.id}
            className={`relative bg-white rounded-xl shadow-lg border-2 ${rankStyle.border} overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInRight 0.6s ease-out forwards'
            }}
          >
            {/* Top 3 Special Background */}
            {isTopThree && (
              <div className={`absolute inset-0 ${rankStyle.bg} opacity-10`}></div>
            )}
            
            <div className="relative p-4">
              <div className="flex items-center space-x-4">
                {/* Rank Number */}
                <div className={`flex-shrink-0 w-12 h-12 ${rankStyle.bg} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className={`text-xl font-bold ${rankStyle.text}`}>
                    {rank <= 3 ? rankStyle.crown : rank}
                  </span>
                </div>
                
                {/* Company Logo/Avatar */}
                <div className="relative flex-shrink-0">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-3 border-white"
                    style={{ backgroundColor: getTierColor(investor.tier) }}
                  >
                    {investor.logo ? (
                      <img 
                        src={investor.logo} 
                        alt={investor.name}
                        className="w-full h-full rounded-full object-contain bg-white p-1"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const nextSibling = target.nextElementSibling as HTMLElement;
                          if (nextSibling) {
                            nextSibling.style.display = 'block';
                          }
                        }}
                      />
                    ) : null}
                    <span className={investor.logo ? "hidden" : "block"}>
                      {getInitials(investor)}
                    </span>
                  </div>
                  
                  {/* Tier Badge */}
                  <div className={`absolute -bottom-1 -right-1 ${tierBadge.color} rounded-full px-2 py-0.5 text-xs font-bold text-white shadow-lg flex items-center`}>
                    <span className="mr-1">{tierBadge.icon}</span>
                    <span className="hidden sm:inline">{tierBadge.label}</span>
                  </div>
                </div>
                
                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                      {investor.shortName || investor.name}
                    </h4>
                    {investor.stockCode && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-mono">
                        {investor.stockCode}
                      </span>
                    )}
                  </div>
                  
                  {investor.sector && (
                    <p className="text-sm text-gray-600 truncate">{investor.sector}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-1">Đóng góp:</span>
                      <span className="font-semibold text-green-600 text-sm">
                        {formatCurrency(investor.dailyContribution)}/ngày
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Percentage Score */}
                <div className="flex-shrink-0 text-right">
                  <div className={`text-2xl font-bold ${isTopThree ? rankStyle.text : 'text-blue-600'} mb-1`}>
                    {investor.percentage}%
                  </div>
                  <div className="text-xs text-gray-500">của pool</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isTopThree ? rankStyle.bg : 'bg-gradient-to-r from-blue-500 to-blue-600'} transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${Math.min(investor.percentage * 4, 100)}%`,
                      animationDelay: `${index * 200 + 600}ms`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Component chính
const InvestorShowcase: React.FC<InvestorShowcaseProps> = ({ investorData, formatCurrency }) => {
  const { dailyPool, totalPool, investors } = investorData;
  
  const sortedInvestors = useMemo(() => {
    return [...investors].sort((a, b) => b.percentage - a.percentage);
  }, [investors]);

  const topInvestors = sortedInvestors.slice(0, 10);
  const otherInvestors = sortedInvestors.slice(10);

  // Tính toán số tiền đã tài trợ và còn lại
  const totalContributed = investors.reduce((sum, inv) => sum + inv.dailyContribution, 0);
  const remainingPool = totalPool - totalContributed;
  const remainingPercentage = (remainingPool / totalPool) * 100;
  
  // Quy đổi sang điểm TUTE (1000 VND = 1 TUTE)
  const remainingTUTE = Math.floor(remainingPool / 1000);
  const totalTUTE = Math.floor(totalPool / 1000);

  return (
    <div className="w-full space-y-8">
      {/* Water Tank Visualization */}
      <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 rounded-2xl p-8 shadow-xl">
        <WaterTank
          totalPool={totalPool}
          remainingPool={remainingPool}
          dailyContributed={totalContributed}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Top 10 Investors - Responsive Display */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-4 sm:p-8 overflow-hidden">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-yellow-400" />
            Top 10 Nhà Tài Trợ Hàng Đầu
          </h2>
          <p className="text-gray-300 text-sm sm:text-lg">
            <span className="hidden sm:inline">Kích thước bong bóng tương ứng với tỉ lệ đóng góp vào quỹ tài trợ</span>
            <span className="sm:hidden">Bảng xếp hạng các nhà tài trợ hàng đầu</span>
          </p>
          
          {/* Legend - Only show on desktop */}
          <div className="hidden sm:flex flex-wrap justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-gray-300">Platinum (25%+)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-300">Gold (15-20%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-300">Silver (10%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-300">Bronze (2-5%)</span>
            </div>
          </div>
        </div>

        {/* Desktop: Bubble Chart */}
        <div className="hidden sm:block">
          <TopInvestorBubbles topInvestors={topInvestors} formatCurrency={formatCurrency} />
        </div>

        {/* Mobile: Leaderboard */}
        <div className="block sm:hidden">
          <TopInvestorLeaderboard topInvestors={topInvestors} formatCurrency={formatCurrency} />
        </div>
      </div>

      {/* Other Investors List */}
      {otherInvestors.length > 0 && (
        <InvestorList investors={otherInvestors} formatCurrency={formatCurrency} />
      )}

      {/* Statistics */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">{investors.length}</div>
            <div className="text-blue-100">Tổng số Nhà Tài Trợ</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">
              {formatCurrency(totalContributed)}
            </div>
            <div className="text-blue-100">Tổng đóng góp hàng ngày</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">{topInvestors.length}</div>
            <div className="text-blue-100">Top Nhà Tài Trợ</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">
              {remainingTUTE.toLocaleString()}
            </div>
            <div className="text-blue-100">TUTE còn lại</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">{remainingPercentage.toFixed(1)}%</div>
            <div className="text-blue-100">Pool còn lại</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorShowcase; 