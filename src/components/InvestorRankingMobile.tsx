'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Crown, Medal, Award, Trophy, Sparkles, Target, Zap, Flame, Search } from 'lucide-react';
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

interface InvestorRankingMobileProps {
  investors: Investor[];
  formatCurrency: (amount: number) => string;
  totalPool: number;
  dailyPool: number;
}

const InvestorRankingMobile: React.FC<InvestorRankingMobileProps> = ({ 
  investors, 
  formatCurrency, 
  totalPool, 
  dailyPool 
}) => {
  const [visibleItems, setVisibleItems] = useState(3);
  const [animationDelay, setAnimationDelay] = useState(0);
  const router = useRouter();

  const sortedInvestors = [...investors].sort((a, b) => b.percentage - a.percentage);
  const topInvestors = sortedInvestors.slice(0, 10);

  // Animation setup
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDelay(100);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return {
          label: 'PLATINUM',
          gradient: 'from-purple-600 via-pink-600 to-purple-800',
          bgGradient: 'from-purple-50 to-pink-50',
          borderColor: 'border-purple-300',
          icon: '💎',
          textColor: 'text-purple-900',
          badgeBg: 'bg-purple-600',
          glowColor: 'shadow-purple-200'
        };
      case 'gold':
        return {
          label: 'GOLD',
          gradient: 'from-yellow-500 via-amber-500 to-yellow-600',
          bgGradient: 'from-yellow-50 to-amber-50',
          borderColor: 'border-yellow-300',
          icon: '🏆',
          textColor: 'text-yellow-900',
          badgeBg: 'bg-yellow-500',
          glowColor: 'shadow-yellow-200'
        };
      case 'silver':
        return {
          label: 'SILVER',
          gradient: 'from-gray-400 via-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-slate-50',
          borderColor: 'border-gray-300',
          icon: '🥈',
          textColor: 'text-gray-900',
          badgeBg: 'bg-gray-500',
          glowColor: 'shadow-gray-200'
        };
      case 'bronze':
        return {
          label: 'BRONZE',
          gradient: 'from-orange-400 via-amber-500 to-orange-600',
          bgGradient: 'from-orange-50 to-amber-50',
          borderColor: 'border-orange-300',
          icon: '🥉',
          textColor: 'text-orange-900',
          badgeBg: 'bg-orange-500',
          glowColor: 'shadow-orange-200'
        };
      default:
        return {
          label: 'MEMBER',
          gradient: 'from-blue-500 to-indigo-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-300',
          icon: '⭐',
          textColor: 'text-blue-900',
          badgeBg: 'bg-blue-500',
          glowColor: 'shadow-blue-200'
        };
    }
  };

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return { icon: <Crown className="w-6 h-6" />, bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', text: 'text-yellow-900' };
      case 2:
        return { icon: <Medal className="w-6 h-6" />, bg: 'bg-gradient-to-r from-gray-300 to-gray-500', text: 'text-gray-900' };
      case 3:
        return { icon: <Award className="w-6 h-6" />, bg: 'bg-gradient-to-r from-orange-400 to-orange-600', text: 'text-orange-900' };
      default:
        return { icon: <span className="text-sm font-bold">{rank}</span>, bg: 'bg-gradient-to-r from-slate-400 to-slate-600', text: 'text-slate-900' };
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5" />;
      case 2:
        return <Medal className="w-5 h-5" />;
      case 3:
        return <Award className="w-5 h-5" />;
      default:
        return <span className="text-sm font-bold">{rank}</span>;
    }
  };

  const getInitials = (investor: Investor) => {
    const name = investor.shortName || investor.name;
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const showMoreItems = () => {
    setVisibleItems(prev => Math.min(prev + 3, topInvestors.length));
  };

  const totalContributed = investors.reduce((sum, inv) => sum + inv.dailyContribution, 0);
  const remainingPool = totalPool - (totalContributed * 365); // Yearly calculation
  const remainingPercentage = ((totalPool - totalContributed) / totalPool) * 100;

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg hover:shadow-xl transition-shadow">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Top 10 Nhà Tài Trợ Hàng Đầu
        </h1>
        <p className="text-gray-600 text-sm">
          Bảng xếp hạng các nhà tài trợ hàng đầu
        </p>
        <div className="mt-4 h-1 w-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">{topInvestors.length}</div>
              <div className="text-xs text-blue-700">Nhà tài trợ</div>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-green-900">{formatCurrency(totalContributed)}</div>
              <div className="text-xs text-green-700">Tổng đóng góp/ngày</div>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-center text-gray-900 mb-6">
          🏆 Top 3 Hàng Đầu
        </h3>
        
        <div className="flex justify-center items-end space-x-3 mb-6">
          {/* 2nd Place */}
          {topInvestors[1] && (
            <div className="text-center flex-1 max-w-[100px]">
              <div 
                className="bg-white rounded-2xl p-3 shadow-lg border-2 border-gray-300 transform hover:scale-105 transition-all duration-300 relative cursor-pointer"
                onClick={() => router.push(`/investors/${topInvestors[1].id}`)}
              >
                {/* Rank Badge */}
                <div className="absolute -top-3 -right-2 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md border-2 border-gray-300"
                  style={{ backgroundColor: '#C0C0C0' }}
                >
                  {topInvestors[1].logo ? (
                    <img 
                      src={topInvestors[1].logo} 
                      alt={topInvestors[1].name}
                      className="w-8 h-8 rounded-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const nextSibling = target.nextElementSibling as HTMLElement;
                        if (nextSibling) nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span className={`text-white text-xs font-bold ${topInvestors[1].logo ? 'hidden' : 'block'}`}>
                    {getInitials(topInvestors[1])}
                  </span>
                </div>
                
                <h4 className="font-bold text-xs text-gray-900 mb-1 truncate">{topInvestors[1].stockCode}</h4>
                <div className="bg-gray-100 rounded-lg p-2">
                  <p className="text-lg font-bold text-gray-900">{topInvestors[1].percentage}%</p>
                  <p className="text-xs text-gray-600">Silver</p>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place - Taller */}
          {topInvestors[0] && (
            <div className="text-center flex-1 max-w-[120px]">
              <div 
                className="bg-white rounded-2xl p-4 shadow-xl border-2 border-yellow-400 transform hover:scale-105 transition-all duration-300 relative cursor-pointer"
                onClick={() => router.push(`/investors/${topInvestors[0].id}`)}
              >
                {/* Crown */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="mt-3">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border-3 border-yellow-300"
                    style={{ backgroundColor: '#FFD700' }}
                  >
                    {topInvestors[0].logo ? (
                      <img 
                        src={topInvestors[0].logo} 
                        alt={topInvestors[0].name}
                        className="w-10 h-10 rounded-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const nextSibling = target.nextElementSibling as HTMLElement;
                          if (nextSibling) nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span className={`text-white text-sm font-bold ${topInvestors[0].logo ? 'hidden' : 'block'}`}>
                      {getInitials(topInvestors[0])}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-sm text-gray-900 mb-2">{topInvestors[0].stockCode}</h4>
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-900">{topInvestors[0].percentage}%</p>
                    <p className="text-xs text-yellow-700">🏆 Champion</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {topInvestors[2] && (
            <div className="text-center flex-1 max-w-[100px]">
              <div 
                className="bg-white rounded-2xl p-3 shadow-lg border-2 border-orange-300 transform hover:scale-105 transition-all duration-300 relative cursor-pointer"
                onClick={() => router.push(`/investors/${topInvestors[2].id}`)}
              >
                {/* Rank Badge */}
                <div className="absolute -top-3 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md border-2 border-orange-300"
                  style={{ backgroundColor: '#CD7F32' }}
                >
                  {topInvestors[2].logo ? (
                    <img 
                      src={topInvestors[2].logo} 
                      alt={topInvestors[2].name}
                      className="w-8 h-8 rounded-full object-contain"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const nextSibling = target.nextElementSibling as HTMLElement;
                        if (nextSibling) nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span className={`text-white text-xs font-bold ${topInvestors[2].logo ? 'hidden' : 'block'}`}>
                    {getInitials(topInvestors[2])}
                  </span>
                </div>
                
                <h4 className="font-bold text-xs text-gray-900 mb-1 truncate">{topInvestors[2].stockCode}</h4>
                <div className="bg-orange-50 rounded-lg p-2 border border-orange-200">
                  <p className="text-lg font-bold text-orange-900">{topInvestors[2].percentage}%</p>
                  <p className="text-xs text-orange-700">Bronze</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Ranking List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Flame className="w-5 h-5 mr-2" />
            Bảng Xếp Hạng Đầy Đủ
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          <div className="space-y-3">
            {topInvestors.slice(0, visibleItems).map((investor, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              const tierConfig = getTierConfig(investor.tier);
              const animationDelay = index * 100 + 200;

              return (
                <div
                  key={investor.id}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer
                    ${isTopThree ? `${tierConfig.bgGradient} ${tierConfig.borderColor} shadow-md ${tierConfig.glowColor}` : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}
                    animate-slide-up`}
                  style={{ animationDelay: `${animationDelay}ms` }}
                  onClick={() => router.push(`/investors/${investor.id}`)}
                >
                  {/* Gradient overlay cho top 3 */}
                  {isTopThree && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${tierConfig.gradient} opacity-5`}></div>
                  )}
                  
                  <div className="relative p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        {/* Rank Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                          ${isTopThree ? `bg-gradient-to-r ${tierConfig.gradient} text-white shadow-lg` : 'bg-gray-100 text-gray-600'}`}>
                          {isTopThree ? getRankIcon(rank) : rank}
                        </div>

                        {/* Company Logo/Avatar */}
                        <div className="relative">
                          <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 shadow-md
                              ${isTopThree ? 'border-white' : 'border-gray-300'}`}
                            style={{ backgroundColor: tierConfig.badgeBg }}
                          >
                            {investor.logo ? (
                              <img 
                                src={investor.logo} 
                                alt={investor.name}
                                className="w-8 h-8 rounded-full object-contain bg-white p-1"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const nextSibling = target.nextElementSibling as HTMLElement;
                                  if (nextSibling) nextSibling.style.display = 'block';
                                }}
                              />
                            ) : null}
                            <span className={`text-white text-xs font-bold ${investor.logo ? 'hidden' : 'block'}`}>
                              {getInitials(investor)}
                            </span>
                          </div>
                          
                          {/* Tier Badge */}
                          {isTopThree && (
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${tierConfig.badgeBg} rounded-full flex items-center justify-center shadow-lg`}>
                              <span className="text-xs">{tierConfig.icon}</span>
                            </div>
                          )}
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold text-base leading-tight truncate 
                            ${isTopThree ? tierConfig.textColor : 'text-gray-900'}`}>
                            {investor.shortName || investor.name}
                          </h3>
                          
                          <div className="flex items-center space-x-2 mt-1">
                            {investor.stockCode && (
                              <span className={`text-xs px-2 py-0.5 rounded font-mono
                                ${isTopThree ? 'bg-white/50 text-gray-700' : 'bg-gray-100 text-gray-600'}`}>
                                {investor.stockCode}
                              </span>
                            )}
                            
                            {!isTopThree && (
                              <span className={`text-xs px-2 py-0.5 rounded font-bold text-white ${tierConfig.badgeBg}`}>
                                {tierConfig.icon} {tierConfig.label}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Percentage & Contribution */}
                      <div className="flex-shrink-0 text-right ml-3">
                        <div className={`text-2xl font-bold leading-none
                          ${isTopThree ? tierConfig.textColor : 'text-blue-600'}`}>
                          {investor.percentage}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {formatCurrency(investor.dailyContribution)}/ngày
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${isTopThree ? `bg-gradient-to-r ${tierConfig.gradient}` : 'bg-gradient-to-r from-gray-400 to-gray-600'} transition-all duration-1000 ease-out`}
                          style={{ 
                            width: `${Math.min(investor.percentage * 4, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Show More Button */}
        {visibleItems < topInvestors.length && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={showMoreItems}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Xem thêm {Math.min(3, topInvestors.length - visibleItems)} nhà tài trợ</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Pool Status */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Trạng thái Pool
          </h4>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {remainingPercentage.toFixed(1)}% còn lại
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Đã tài trợ:</span>
            <span className="font-bold">{formatCurrency(totalContributed)}/ngày</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-1000 ease-out"
              style={{ width: `${100 - remainingPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* View All Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => router.push('/investors')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Xem tất cả nhà tài trợ</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default InvestorRankingMobile; 