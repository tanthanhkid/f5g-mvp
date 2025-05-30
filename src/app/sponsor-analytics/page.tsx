'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Target, Clock, Eye, MousePointer, Award, PieChart, Activity } from 'lucide-react';
import analyticsData from '../../../data/analytics.json';

interface SponsorAnalytics {
  impressions: number;
  clicks: number;
  clickThroughRate: number;
  brandAwareness: number;
  sponsoredQuizzes: number;
  userEngagement: number;
  roi: number;
  demographics: {
    age: Record<string, number>;
    universities: Record<string, number>;
    majors: Record<string, number>;
  };
  performanceMetrics: {
    brandRecall: number;
    brandConsideration: number;
    intentToPurchase: number;
    socialSharing: number;
  };
}

export default function SponsorAnalyticsPage() {
  const [selectedSponsor, setSelectedSponsor] = useState('VCB');
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const currentSponsorData = analyticsData.sponsorAnalytics[selectedSponsor as keyof typeof analyticsData.sponsorAnalytics] as SponsorAnalytics;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Theo dõi hiệu quả chiến dịch marketing và ROI real-time
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Nhà tài trợ:</label>
              <select 
                value={selectedSponsor}
                onChange={(e) => setSelectedSponsor(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="VCB">Vietcombank</option>
                <option value="FPT">FPT Corporation</option>
                <option value="VNM">Vinamilk</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Thời gian:</label>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">7 ngày qua</option>
                <option value="30d">30 ngày qua</option>
                <option value="90d">3 tháng qua</option>
                <option value="1y">1 năm qua</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online Users</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.realTimeMetrics.currentOnlineUsers)}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">+12% từ hôm qua</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quiz hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.realTimeMetrics.todayQuizzesTaken)}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-blue-600 mt-2">+8% từ hôm qua</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">TUTE kiếm được</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.realTimeMetrics.todayTuteEarned)}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xs text-purple-600 mt-2">+15% từ hôm qua</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pool còn lại</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(analyticsData.realTimeMetrics.currentPoolBalance)}</p>
              </div>
              <PieChart className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-xs text-orange-600 mt-2">54.4% pool ban đầu</p>
          </div>
        </div>

        {/* Sponsor Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Key Metrics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Chỉ số hiệu quả chính
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">Impressions</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{formatNumber(currentSponsorData.impressions)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MousePointer className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Clicks</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{formatNumber(currentSponsorData.clicks)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-700">CTR</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{formatPercentage(currentSponsorData.clickThroughRate)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-700">ROI</span>
                </div>
                <span className="text-xl font-bold text-green-600">{currentSponsorData.roi}x</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <span className="text-gray-700">Brand Awareness</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{formatPercentage(currentSponsorData.brandAwareness)}</span>
              </div>
            </div>
          </div>

          {/* Brand Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              🎯 Hiệu quả thương hiệu
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Brand Recall</span>
                  <span className="text-sm font-bold text-gray-900">{formatPercentage(currentSponsorData.performanceMetrics.brandRecall)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{width: `${currentSponsorData.performanceMetrics.brandRecall * 100}%`}}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Brand Consideration</span>
                  <span className="text-sm font-bold text-gray-900">{formatPercentage(currentSponsorData.performanceMetrics.brandConsideration)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{width: `${currentSponsorData.performanceMetrics.brandConsideration * 100}%`}}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Intent to Purchase</span>
                  <span className="text-sm font-bold text-gray-900">{formatPercentage(currentSponsorData.performanceMetrics.intentToPurchase)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{width: `${currentSponsorData.performanceMetrics.intentToPurchase * 100}%`}}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Social Sharing</span>
                  <span className="text-sm font-bold text-gray-900">{formatNumber(currentSponsorData.performanceMetrics.socialSharing)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                    style={{width: `${Math.min(currentSponsorData.performanceMetrics.socialSharing / 500, 1) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Age Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">👥 Phân bố độ tuổi</h3>
            <div className="space-y-3">
              {Object.entries(currentSponsorData.demographics.age).map(([age, percentage]) => (
                <div key={age}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{age} tuổi</span>
                    <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* University Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏫 Phân bố trường học</h3>
            <div className="space-y-3">
              {Object.entries(currentSponsorData.demographics.universities).map(([uni, percentage]) => (
                <div key={uni}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{uni}</span>
                    <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Major Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Phân bố ngành học</h3>
            <div className="space-y-3">
              {Object.entries(currentSponsorData.demographics.majors).map(([major, percentage]) => (
                <div key={major}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">{major}</span>
                    <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            🚀 Hiệu quả chiến dịch
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-900">Chiến dịch</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Thời gian</th>
                  <th className="text-right py-3 font-semibold text-gray-900">Ngân sách</th>
                  <th className="text-right py-3 font-semibold text-gray-900">Đã chi</th>
                  <th className="text-right py-3 font-semibold text-gray-900">Impressions</th>
                  <th className="text-right py-3 font-semibold text-gray-900">Clicks</th>
                  <th className="text-right py-3 font-semibold text-gray-900">ROI</th>
                  <th className="text-center py-3 font-semibold text-gray-900">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.campaignPerformance
                  .filter(campaign => campaign.sponsor === selectedSponsor)
                  .map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">{campaign.name}</td>
                    <td className="py-3 text-gray-600">{campaign.startDate} - {campaign.endDate}</td>
                    <td className="py-3 text-right text-gray-900">{formatCurrency(campaign.budget)}</td>
                    <td className="py-3 text-right text-gray-900">{formatCurrency(campaign.spent)}</td>
                    <td className="py-3 text-right text-gray-900">{formatNumber(campaign.impressions)}</td>
                    <td className="py-3 text-right text-gray-900">{formatNumber(campaign.clicks)}</td>
                    <td className="py-3 text-right font-bold text-green-600">{campaign.roi}x</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        campaign.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status === 'active' ? 'Đang chạy' : 'Hoàn thành'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 