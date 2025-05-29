'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Search, Star, TrendingUp, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import WaterTank from './WaterTank';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredInvestor, setHoveredInvestor] = useState<Investor | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    bubbles.forEach(({ investor, x, y, radius }) => {
      const isHovered = hoveredInvestor?.id === investor.id;
      const currentRadius = radius * (isHovered ? 1.1 : 1);

      // Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 8;

      // Gradient background
      const gradient = ctx.createRadialGradient(
        x - currentRadius * 0.3, y - currentRadius * 0.3, 0,
        x, y, currentRadius
      );
      gradient.addColorStop(0, getTierColor(investor.tier) + '20');
      gradient.addColorStop(0.7, getTierColor(investor.tier) + 'AA');
      gradient.addColorStop(1, getTierColor(investor.tier));

      // Draw bubble
      ctx.beginPath();
      ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Border
      ctx.strokeStyle = isHovered ? '#ffffff' : getTierColor(investor.tier);
      ctx.lineWidth = isHovered ? 4 : 2;
      ctx.stroke();

      // Company initials
      ctx.fillStyle = 'white';
      ctx.font = `bold ${Math.max(currentRadius * 0.25, 16)}px Inter, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(getInitials(investor), x, y - currentRadius * 0.15);

      // Percentage
      ctx.fillStyle = '#fbbf24';
      ctx.font = `bold ${Math.max(currentRadius * 0.18, 14)}px Inter, Arial, sans-serif`;
      ctx.fillText(`${investor.percentage}%`, x, y + currentRadius * 0.15);

      // Tier indicator
      if (investor.tier === 'platinum') {
        ctx.fillStyle = '#fbbf24';
        ctx.font = `${Math.max(currentRadius * 0.12, 10)}px Inter, Arial, sans-serif`;
        ctx.fillText('★ PLATINUM', x, y + currentRadius * 0.35);
      }
    });

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      setMousePos({ x: event.clientX, y: event.clientY });

      const hoveredBubble = bubbles.find(({ x, y, radius }) => {
        const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
        return distance <= radius;
      });

      setHoveredInvestor(hoveredBubble?.investor || null);
    };

    const handleMouseLeave = () => {
      setHoveredInvestor(null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [topInvestors, hoveredInvestor, formatCurrency]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full h-[600px] cursor-pointer"
        style={{ display: 'block' }}
      />
      
      {/* Tooltip */}
      {hoveredInvestor && (
        <div 
          className="fixed bg-white text-gray-900 p-4 rounded-xl shadow-2xl border border-gray-200 min-w-[320px] z-50 pointer-events-none"
          style={{
            left: mousePos.x - 160,
            top: mousePos.y - 140,
          }}
        >
          <div className="flex items-center mb-3">
            <div 
              className="w-5 h-5 rounded-full mr-3"
              style={{ backgroundColor: getTierColor(hoveredInvestor.tier) }}
            ></div>
            <div>
              <div className="font-bold text-lg">{hoveredInvestor.shortName || hoveredInvestor.name}</div>
              {hoveredInvestor.stockCode && (
                <div className="text-sm text-gray-500">Mã CK: {hoveredInvestor.stockCode}</div>
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tên đầy đủ:</span>
              <span className="font-medium text-right max-w-[180px] break-words">{hoveredInvestor.name}</span>
            </div>
            {hoveredInvestor.sector && (
              <div className="flex justify-between">
                <span className="text-gray-600">Ngành:</span>
                <span className="font-medium text-blue-600">{hoveredInvestor.sector}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Tier:</span>
              <span className="font-semibold capitalize text-yellow-600">{hoveredInvestor.tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Đóng góp hàng ngày:</span>
              <span className="font-semibold text-green-600">{formatCurrency(hoveredInvestor.dailyContribution)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tỉ lệ tổng pool:</span>
              <span className="font-semibold text-blue-600">{hoveredInvestor.percentage}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component danh sách cho các Nhà Tài Trợ còn lại
const InvestorList: React.FC<{
  investors: Investor[];
  formatCurrency: (amount: number) => string;
}> = ({ investors, formatCurrency }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredInvestors = useMemo(() => {
    return investors.filter(investor =>
      investor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [investors, searchTerm]);

  // Reset về trang 1 khi search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <Building2 className="w-6 h-6 mr-2 text-blue-600" />
          Các Nhà Tài Trợ Khác
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({filteredInvestors.length} Nhà Tài Trợ)
          </span>
        </h3>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm Nhà Tài Trợ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 text-black"
          />
        </div>
      </div>

      {/* Hiển thị thông tin phân trang */}
      {filteredInvestors.length > 0 && (
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
          <div>
            Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredInvestors.length)} trong tổng số {filteredInvestors.length} Nhà Tài Trợ
          </div>
          <div>
            Trang {currentPage} / {totalPages}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
        {currentInvestors.map((investor) => (
          <div
            key={investor.id}
            className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3"
                  style={{ backgroundColor: getTierColor(investor.tier) }}
                >
                  {getInitials(investor)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{investor.shortName || investor.name}</h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {investor.stockCode && <span>({investor.stockCode})</span>}
                    {investor.sector && <span>• {investor.sector}</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{investor.percentage}%</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <div className="flex justify-between mb-1">
                <span>Đóng góp/ngày:</span>
                <span className="font-semibold">{formatCurrency(investor.dailyContribution)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Trước
          </button>

          {/* Hiển thị số trang */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Hiển thị trang đầu, cuối và các trang xung quanh trang hiện tại
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return (
                  <span key={page} className="px-2 py-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

      {filteredInvestors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Không tìm thấy Nhà Tài Trợ nào phù hợp</p>
        </div>
      )}
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

      {/* Top 10 Investors Bubbles */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-8 overflow-hidden">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 mr-3 text-yellow-400" />
            Top 10 Nhà Tài Trợ Hàng Đầu
          </h2>
          <p className="text-gray-300 text-lg">
            Kích thước bong bóng tương ứng với tỉ lệ đóng góp vào quỹ tài trợ
          </p>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm">
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

        <TopInvestorBubbles topInvestors={topInvestors} formatCurrency={formatCurrency} />
         
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