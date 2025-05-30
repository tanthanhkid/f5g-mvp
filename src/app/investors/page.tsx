'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  X, 
  Crown, 
  Medal, 
  Award,
  ChevronDown,
  SortAsc,
  SortDesc,
  TrendingUp,
  Building2,
  Users,
  Target
} from 'lucide-react';
import investorsData from '../../../data/investors.json';

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

type SortField = 'percentage' | 'dailyContribution' | 'name' | 'tier';
type SortOrder = 'asc' | 'desc';

export default function AllInvestorsPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [sortField, setSortField] = useState<SortField>('percentage');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get unique sectors and tiers for filters
  const sectors = useMemo(() => {
    const uniqueSectors = [...new Set(investorsData.investors.map(inv => inv.sector).filter(Boolean))];
    return uniqueSectors.sort();
  }, []);

  const tiers = useMemo(() => {
    const uniqueTiers = [...new Set(investorsData.investors.map(inv => inv.tier))];
    return uniqueTiers.sort();
  }, []);

  // Filter and sort investors
  const filteredInvestors = useMemo(() => {
    let filtered = investorsData.investors.filter(investor => {
      const matchesSearch = 
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.shortName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.stockCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.sector?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = !selectedSector || investor.sector === selectedSector;
      const matchesTier = !selectedTier || investor.tier === selectedTier;

      return matchesSearch && matchesSector && matchesTier;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let valueA: any, valueB: any;
      
      switch (sortField) {
        case 'percentage':
          valueA = a.percentage;
          valueB = b.percentage;
          break;
        case 'dailyContribution':
          valueA = a.dailyContribution;
          valueB = b.dailyContribution;
          break;
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'tier':
          const tierOrder = { platinum: 4, gold: 3, silver: 2, bronze: 1 };
          valueA = tierOrder[a.tier as keyof typeof tierOrder] || 0;
          valueB = tierOrder[b.tier as keyof typeof tierOrder] || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, selectedSector, selectedTier, sortField, sortOrder]);

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return {
          label: 'PLATINUM',
          icon: '💎',
          color: 'border-purple-600 bg-purple-50 text-purple-700',
          iconBg: 'bg-purple-600',
          badgeBg: 'bg-purple-600',
          gradient: 'from-purple-600 via-pink-600 to-purple-800'
        };
      case 'gold':
        return {
          label: 'GOLD',
          icon: '🏆',
          color: 'border-yellow-600 bg-yellow-50 text-yellow-700',
          iconBg: 'bg-yellow-500',
          badgeBg: 'bg-yellow-500',
          gradient: 'from-yellow-500 via-amber-500 to-yellow-600'
        };
      case 'silver':
        return {
          label: 'SILVER',
          icon: '🥈',
          color: 'border-gray-600 bg-gray-50 text-gray-700',
          iconBg: 'bg-gray-500',
          badgeBg: 'bg-gray-500',
          gradient: 'from-gray-400 via-gray-500 to-gray-600'
        };
      case 'bronze':
        return {
          label: 'BRONZE',
          icon: '🥉',
          color: 'border-orange-600 bg-orange-50 text-orange-700',
          iconBg: 'bg-orange-500',
          badgeBg: 'bg-orange-500',
          gradient: 'from-orange-400 via-amber-500 to-orange-600'
        };
      default:
        return {
          label: 'MEMBER',
          icon: '⭐',
          color: 'border-blue-600 bg-blue-50 text-blue-700',
          iconBg: 'bg-blue-500',
          badgeBg: 'bg-blue-500',
          gradient: 'from-blue-500 to-indigo-600'
        };
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-4 h-4 text-yellow-600" />;
      case 1: return <Medal className="w-4 h-4 text-gray-500" />;
      case 2: return <Award className="w-4 h-4 text-orange-600" />;
      default: return <span className="text-sm font-bold text-gray-600">#{index + 1}</span>;
    }
  };

  const getInitials = (investor: Investor) => {
    const name = investor.shortName || investor.name;
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleBack = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    router.back();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSector('');
    setSelectedTier('');
    setSortField('percentage');
    setSortOrder('desc');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header với back button */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                title="Quay lại"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tất cả Nhà Tài Trợ</h1>
                <p className="text-sm text-gray-600">{filteredInvestors.length} kết quả</p>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                showFilters 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Bộ lọc</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã cổ phiếu, ngành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-500 shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-blue-600" />
                  Bộ lọc
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 text-sm hover:text-blue-700 transition-colors font-medium px-3 py-1 rounded-lg hover:bg-blue-50"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Sector Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Ngành nghề</label>
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 font-medium"
                  >
                    <option value="" className="text-gray-900">Tất cả ngành</option>
                    {sectors.map(sector => (
                      <option key={sector} value={sector} className="text-gray-900">{sector}</option>
                    ))}
                  </select>
                </div>

                {/* Tier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Cấp độ</label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 font-medium"
                  >
                    <option value="" className="text-gray-900">Tất cả cấp độ</option>
                    {tiers.map(tier => (
                      <option key={tier} value={tier} className="text-gray-900">
                        {tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Sắp xếp theo</label>
                  <div className="flex space-x-2">
                    <select
                      value={sortField}
                      onChange={(e) => setSortField(e.target.value as SortField)}
                      className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 font-medium"
                    >
                      <option value="percentage" className="text-gray-900">% Pool</option>
                      <option value="dailyContribution" className="text-gray-900">Đóng góp</option>
                      <option value="name" className="text-gray-900">Tên</option>
                      <option value="tier" className="text-gray-900">Cấp độ</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors border border-gray-300"
                      title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 text-gray-700" /> : <SortDesc className="w-4 h-4 text-gray-700" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchTerm || selectedSector || selectedTier) && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600 mr-2">Bộ lọc hiện tại:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                      Tìm kiếm: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="ml-2 hover:text-blue-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedSector && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                      Ngành: {selectedSector}
                      <button onClick={() => setSelectedSector('')} className="ml-2 hover:text-green-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedTier && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
                      Cấp độ: {selectedTier}
                      <button onClick={() => setSelectedTier('')} className="ml-2 hover:text-purple-600">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Investor List */}
          <div className="space-y-4">
            {/* Results Count & Stats */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700 font-medium">{filteredInvestors.length} nhà tài trợ</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700 font-medium">
                      {formatCurrency(filteredInvestors.reduce((sum, inv) => sum + inv.dailyContribution, 0))}/ngày
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Sắp xếp theo: <span className="font-medium">{
                    sortField === 'percentage' ? '% Pool' :
                    sortField === 'dailyContribution' ? 'Đóng góp' :
                    sortField === 'name' ? 'Tên' : 'Cấp độ'
                  }</span>
                </div>
              </div>
            </div>

            {/* Investor Cards */}
            {filteredInvestors.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredInvestors.map((investor, index) => (
                  <div 
                    key={investor.id}
                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'slideInUp 0.6s ease-out forwards'
                    }}
                  >
                    {/* Header với rank */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getRankIcon(index)}
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-md"
                          style={{ backgroundColor: getTierConfig(investor.tier).badgeBg }}
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
                      </div>

                      {/* Percentage Badge */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{investor.percentage}%</div>
                        <div className="text-xs text-gray-500">của pool</div>
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          {investor.shortName || investor.name}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {investor.stockCode && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                              {investor.stockCode}
                            </span>
                          )}
                          
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getTierConfig(investor.tier).badgeBg} text-white`}>
                            {getTierConfig(investor.tier).icon} {getTierConfig(investor.tier).label}
                          </span>
                        </div>
                      </div>

                      {investor.sector && (
                        <p className="text-sm text-gray-600">{investor.sector}</p>
                      )}

                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Đóng góp hàng ngày:</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(investor.dailyContribution)}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Mức đóng góp</span>
                          <span>{investor.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ease-out ${getTierConfig(investor.tier).gradient.includes('from-') ? `bg-gradient-to-r ${getTierConfig(investor.tier).gradient}` : getTierConfig(investor.tier).badgeBg}`}
                            style={{ 
                              width: `${Math.min(investor.percentage * 3, 100)}%`,
                              animationDelay: `${index * 100 + 500}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-600 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 