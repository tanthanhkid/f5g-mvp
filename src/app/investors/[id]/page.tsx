'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, TrendingUp, Target, Award, Globe, Calendar, DollarSign, ChevronLeft } from 'lucide-react';
import investorsData from '../../../../data/investors.json';

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

interface InvestorDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

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
        accentColor: '#8b5cf6'
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
        accentColor: '#f59e0b'
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
        accentColor: '#6b7280'
      };
    case 'bronze':
      return {
        label: 'BRONZE',
        gradient: 'from-orange-500 via-red-500 to-orange-600',
        bgGradient: 'from-orange-50 to-red-50',
        borderColor: 'border-orange-300',
        icon: '🥉',
        textColor: 'text-orange-900',
        badgeBg: 'bg-orange-500',
        accentColor: '#f97316'
      };
    default:
      return {
        label: 'STANDARD',
        gradient: 'from-gray-400 to-gray-600',
        bgGradient: 'from-gray-50 to-gray-100',
        borderColor: 'border-gray-300',
        icon: '🏢',
        textColor: 'text-gray-900',
        badgeBg: 'bg-gray-500',
        accentColor: '#6b7280'
      };
  }
};

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toString();
};

export default function InvestorDetailPage({ params }: InvestorDetailPageProps) {
  const router = useRouter();
  // Unwrap params Promise using React.use()
  const { id } = use(params);
  const investor = investorsData.investors.find(inv => inv.id === parseInt(id));

  if (!investor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm mx-auto">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Không tìm thấy nhà tài trợ</h1>
          <p className="text-gray-600 mb-6">Nhà tài trợ bạn tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
          <button
            onClick={() => router.back()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const tierConfig = getTierConfig(investor.tier);
  const rank = investorsData.investors
    .sort((a, b) => b.percentage - a.percentage)
    .findIndex(inv => inv.id === investor.id) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Mobile-Optimized Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/60">
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors touch-manipulation min-h-[44px] -ml-2 pl-2 pr-3 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="font-medium text-sm sm:text-base">Quay lại</span>
            </button>
            
            <div className="text-right">
              <div className="text-xs sm:text-sm text-gray-500">Hạng</div>
              <div className="text-lg sm:text-xl font-bold text-gray-900">#{rank}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Hero Section - Optimized for Mobile */}
        <div className={`bg-gradient-to-br ${tierConfig.gradient} rounded-2xl sm:rounded-3xl mx-0 mt-4 sm:mt-6 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            {/* Mobile Logo and Company Info */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/30">
                {investor.logo ? (
                  <img 
                    src={investor.logo} 
                    alt={investor.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const nextSibling = target.nextElementSibling as HTMLElement;
                      if (nextSibling) nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <span className={`text-lg sm:text-xl font-bold text-white ${investor.logo ? 'hidden' : 'block'}`}>
                  {investor.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
                  {investor.shortName || investor.name}
                </h1>
                
                {/* Mobile-friendly badges */}
                <div className="flex flex-wrap gap-2">
                  {investor.stockCode && (
                    <span className="bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-mono border border-white/30">
                      {investor.stockCode}
                    </span>
                  )}
                  <span className="bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-white/30">
                    {tierConfig.icon} {tierConfig.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Percentage Display */}
            <div className="text-center sm:text-left">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2 tracking-tight">
                {investor.percentage}%
              </div>
              <div className="text-white/90 text-sm sm:text-base font-medium">
                của tổng pool đầu tư
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Stats Cards */}
        <div className="grid gap-4 sm:gap-6 mt-6 sm:mt-8 mb-6 sm:mb-8">
          {/* Primary Stat - Larger on mobile */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Đóng góp hàng ngày</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Số tiền đầu tư mỗi ngày</p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                {formatCurrency(investor.dailyContribution)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {((investor.dailyContribution / investorsData.dailyPool) * 100).toFixed(2)}% tổng pool
              </div>
            </div>
          </div>

          {/* Secondary Stats - Grid layout for mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/60">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Tỉ lệ sở hữu</h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                {investor.percentage}%
              </div>
              <div className="text-xs text-gray-600">
                Vị trí #{rank}/{investorsData.investors.length}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200/60">
              <div className="flex items-center mb-3">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Cấp độ</h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: tierConfig.accentColor }}>
                {tierConfig.icon}
              </div>
              <div className="text-xs text-gray-600">
                {tierConfig.label}
              </div>
            </div>
          </div>
        </div>

        {/* Company Information - Mobile Optimized */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/60 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-600" />
            Thông tin công ty
          </h2>
          
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="text-sm font-medium text-gray-600 block mb-1">Tên đầy đủ</label>
                <div className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">{investor.name}</div>
              </div>
              
              {investor.shortName && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="text-sm font-medium text-gray-600 block mb-1">Tên viết tắt</label>
                  <div className="text-base sm:text-lg font-semibold text-gray-900">{investor.shortName}</div>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {investor.stockCode && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-medium text-gray-600 block mb-1">Mã cổ phiếu</label>
                    <div className="text-base sm:text-lg font-mono font-bold text-gray-900">{investor.stockCode}</div>
                  </div>
                )}
                
                {investor.sector && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-medium text-gray-600 block mb-1">Lĩnh vực</label>
                    <div className="text-base sm:text-lg font-semibold text-gray-900">{investor.sector}</div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="text-sm font-medium text-gray-600 block mb-2">Cấp độ tài trợ</label>
                <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold text-white ${tierConfig.badgeBg} shadow-lg`}>
                  {tierConfig.icon} {tierConfig.label}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Details - Mobile Optimized */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/60 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-600" />
            Chi tiết đầu tư
          </h2>
          
          <div className="space-y-6">
            {/* Progress Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium text-sm sm:text-base">Đóng góp hàng ngày</span>
                <span className="text-xl sm:text-2xl font-bold text-green-600">
                  {investor.dailyContribution.toLocaleString('vi-VN')} đ
                </span>
              </div>
              
              <div className="w-full bg-white/80 rounded-full h-4 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${Math.min((investor.percentage / 25) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-3">
                <span>0%</span>
                <span className="font-medium">{investor.percentage}%</span>
                <span>25% (Max)</span>
              </div>
            </div>
            
            {/* Estimates Grid */}
            <div className="grid gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200/50">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-700 font-medium text-sm">Ước tính tháng</span>
                    <div className="text-xs text-gray-500">30 ngày</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg sm:text-xl text-blue-600">
                      {formatCurrency(investor.dailyContribution * 30)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {(investor.dailyContribution * 30).toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200/50">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-700 font-medium text-sm">Ước tính năm</span>
                    <div className="text-xs text-gray-500">365 ngày</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg sm:text-xl text-purple-600">
                      {formatCurrency(investor.dailyContribution * 365)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {(investor.dailyContribution * 365).toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="h-6 sm:h-8"></div>
      </div>
    </div>
  );
} 