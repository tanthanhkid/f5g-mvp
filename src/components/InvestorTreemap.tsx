import React from 'react';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface Investor {
  id: number;
  name: string;
  logo: string;
  dailyContribution: number;
  percentage: number;
  tier: string;
  color: string;
}

interface InvestorTreemapProps {
  investors: Investor[];
  formatCurrency: (amount: number) => string;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  investor: Investor;
}

const InvestorTreemap: React.FC<InvestorTreemapProps> = ({ investors, formatCurrency }) => {
  // Lấy màu nền dựa trên tier
  const getBackgroundColor = (tier: string, isPositive: boolean) => {
    if (tier === 'platinum') {
      return isPositive ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-red-500 to-red-600';
    }
    if (tier === 'gold') {
      return isPositive ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' : 'bg-gradient-to-br from-red-400 to-red-500';
    }
    if (tier === 'silver') {
      return isPositive ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-red-400 to-red-500';
    }
    return isPositive ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-500';
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

  // Thuật toán treemap đơn giản - chia đệ quy
  const createTreemap = (investors: Investor[], x: number, y: number, width: number, height: number): Rectangle[] => {
    if (investors.length === 0) return [];
    if (investors.length === 1) {
      return [{
        x,
        y,
        width,
        height,
        investor: investors[0]
      }];
    }

    // Sắp xếp theo tỉ lệ giảm dần
    const sorted = [...investors].sort((a, b) => b.percentage - a.percentage);
    
    // Tính tổng tỉ lệ
    const totalPercentage = sorted.reduce((sum, inv) => sum + inv.percentage, 0);
    
    // Chia thành 2 nhóm
    let leftSum = 0;
    let splitIndex = 0;
    const halfTotal = totalPercentage / 2;
    
    for (let i = 0; i < sorted.length; i++) {
      if (leftSum + sorted[i].percentage > halfTotal && i > 0) {
        break;
      }
      leftSum += sorted[i].percentage;
      splitIndex = i + 1;
    }

    const leftGroup = sorted.slice(0, splitIndex);
    const rightGroup = sorted.slice(splitIndex);

    const leftPercentage = leftSum / totalPercentage;
    const rightPercentage = 1 - leftPercentage;

    let leftRects: Rectangle[] = [];
    let rightRects: Rectangle[] = [];

    // Chia theo chiều ngang hoặc dọc tùy thuộc vào tỉ lệ khung hình
    if (width > height) {
      // Chia theo chiều ngang
      const leftWidth = width * leftPercentage;
      const rightWidth = width * rightPercentage;
      
      if (leftGroup.length > 0) {
        leftRects = createTreemap(leftGroup, x, y, leftWidth, height);
      }
      if (rightGroup.length > 0) {
        rightRects = createTreemap(rightGroup, x + leftWidth, y, rightWidth, height);
      }
    } else {
      // Chia theo chiều dọc
      const leftHeight = height * leftPercentage;
      const rightHeight = height * rightPercentage;
      
      if (leftGroup.length > 0) {
        leftRects = createTreemap(leftGroup, x, y, width, leftHeight);
      }
      if (rightGroup.length > 0) {
        rightRects = createTreemap(rightGroup, x, y + leftHeight, width, rightHeight);
      }
    }

    return [...leftRects, ...rightRects];
  };

  // Tạo layout treemap
  const rectangles = createTreemap(investors, 0, 0, 100, 60); // 100x60 units

  return (
    <div className="w-full bg-gray-900 rounded-2xl p-6 overflow-hidden">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Star className="w-6 h-6 text-yellow-400 mr-2" />
          Bản Đồ Nhà Tài Trợ
        </h3>
        <p className="text-gray-300 text-sm">Kích thước ô tương ứng với tỉ lệ đóng góp</p>
      </div>

      <div className="relative w-full bg-gray-800 rounded-xl overflow-hidden" style={{ height: '480px' }}>
        {rectangles.map((rect) => {
          const isPositive = Math.random() > 0.3;
          const changePercent = (Math.random() * 10 - 2).toFixed(2);
          
          return (
            <div
              key={rect.investor.id}
              className={`absolute ${getBackgroundColor(rect.investor.tier, isPositive)} 
                         text-white border border-gray-700 hover:border-white transition-all duration-300 
                         hover:scale-[1.02] hover:z-10 cursor-pointer group`}
              style={{
                left: `${rect.x}%`,
                top: `${rect.y}%`,
                width: `${rect.width}%`,
                height: `${rect.height}%`,
              }}
            >
              <div className="p-3 h-full flex flex-col justify-between relative overflow-hidden">
                {/* Header với logo và tier */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {rect.investor.logo ? (
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1 flex-shrink-0">
                        <img 
                          src={rect.investor.logo} 
                          alt={rect.investor.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">
                          {getInitials(rect.investor.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Tier icon */}
                  <div className="flex-shrink-0">
                    {rect.investor.tier === 'platinum' && <Star className="w-4 h-4 text-yellow-300" />}
                    {rect.investor.tier === 'gold' && <Star className="w-4 h-4 text-yellow-400" />}
                    {rect.investor.tier === 'silver' && <Star className="w-4 h-4 text-gray-300" />}
                    {rect.investor.tier === 'bronze' && <Star className="w-4 h-4 text-orange-300" />}
                  </div>
                </div>

                {/* Tên công ty */}
                <div className="flex-1 flex items-center">
                  <h4 className="font-bold text-sm leading-tight">
                    {rect.investor.name}
                  </h4>
                </div>

                {/* Thông tin số tiền */}
                <div className="mt-auto">
                  <div className="text-lg font-bold leading-tight mb-1">
                    {formatCurrency(rect.investor.dailyContribution)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      {rect.investor.percentage}%
                    </span>
                    
                    {/* Trend indicator */}
                    <div className={`flex items-center text-sm ${
                      parseFloat(changePercent) >= 0 ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {parseFloat(changePercent) >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {changePercent}%
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-lg font-bold">{rect.investor.name}</div>
                    <div className="text-sm mt-1">
                      {formatCurrency(rect.investor.dailyContribution)}/ngày
                    </div>
                    <div className="text-sm">
                      {rect.investor.percentage}% tổng pool
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-300">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
          <span>Platinum (25%+)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
          <span>Gold (15-20%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Silver (10%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span>Bronze (2-5%)</span>
        </div>
      </div>
    </div>
  );
};

export default InvestorTreemap; 