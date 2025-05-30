'use client';

import { useState, useEffect } from 'react';
import { Bot, Zap, Target, BarChart3, DollarSign, Clock, Eye, MousePointer, TrendingUp, Settings, Play, Pause, RefreshCw } from 'lucide-react';
import adsData from '../../../data/ads.json';

export default function AdManagementPage() {
  const [selectedSponsor, setSelectedSponsor] = useState('VCB');
  const [autoOptimization, setAutoOptimization] = useState(adsData.adSettings.autoOptimization);
  const [realTimeBidding, setRealTimeBidding] = useState(adsData.adSettings.realTimeBidding);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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

  const currentSponsorData = adsData.adSettings.budgetAllocation[selectedSponsor as keyof typeof adsData.adSettings.budgetAllocation];
  const sponsorAds = adsData.currentAds.filter(ad => ad.sponsor === selectedSponsor);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            🤖 Programmatic Advertising
          </h1>
          <p className="text-black">
            Quản lý quảng cáo tự động với AI optimization và real-time bidding
          </p>
        </div>

        {/* Quick Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-black">Nhà tài trợ:</label>
              <select 
                value={selectedSponsor}
                onChange={(e) => setSelectedSponsor(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="VCB">Vietcombank</option>
                <option value="FPT">FPT Corporation</option>
                <option value="VNM">Vinamilk</option>
              </select>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <label className="text-sm font-medium text-black">AI Optimization:</label>
                <button
                  onClick={() => setAutoOptimization(!autoOptimization)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoOptimization ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoOptimization ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <label className="text-sm font-medium text-black">Real-time Bidding:</label>
                <button
                  onClick={() => setRealTimeBidding(!realTimeBidding)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    realTimeBidding ? 'bg-orange-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    realTimeBidding ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Bid Volume</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(adsData.realTimeMetrics.currentBidVolume)}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-blue-600 mt-2">Real-time</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Average CPM</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(adsData.realTimeMetrics.averageCPM)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-xs text-green-600 mt-2">+5% từ hôm qua</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(adsData.realTimeMetrics.currentWinRate[selectedSponsor as keyof typeof adsData.realTimeMetrics.currentWinRate])}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xs text-purple-600 mt-2">vs competitors</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black">Top Format</p>
                <p className="text-lg font-bold text-gray-900">{adsData.realTimeMetrics.topPerformingFormat}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-xs text-orange-600 mt-2">Best performing</p>
          </div>
        </div>

        {/* Campaign Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Budget Management */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              Quản lý ngân sách {selectedSponsor}
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-black font-medium">Daily Budget</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(currentSponsorData.dailyBudget)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-black font-medium">Max CPC</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(currentSponsorData.maxCPC)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-black font-medium">Target CTR</span>
                <span className="text-xl font-bold text-gray-900">{formatPercentage(currentSponsorData.targetCTR)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-black font-medium">Priority Level</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  currentSponsorData.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentSponsorData.priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* AI Optimization Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-600" />
              AI Optimization Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <span className="text-black font-medium">CTR Prediction</span>
                  <p className="text-sm text-black">Model accuracy</p>
                </div>
                <span className="text-xl font-bold text-blue-600">{formatPercentage(adsData.aiOptimization.models.ctrPrediction.accuracy)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <span className="text-black font-medium">Performance Improvement</span>
                  <p className="text-sm text-black">vs manual bidding</p>
                </div>
                <span className="text-xl font-bold text-green-600">+{formatPercentage(adsData.aiOptimization.models.bidOptimization.performanceImprovement)}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <div>
                  <span className="text-black font-medium">Audience Segments</span>
                  <p className="text-sm text-black">Active segments</p>
                </div>
                <span className="text-xl font-bold text-purple-600">{adsData.aiOptimization.models.audienceSegmentation.segments}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div>
                  <span className="text-black font-medium">Precision Score</span>
                  <p className="text-sm text-black">Targeting accuracy</p>
                </div>
                <span className="text-xl font-bold text-orange-600">{formatPercentage(adsData.aiOptimization.models.audienceSegmentation.precision)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Inventory */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            📦 Inventory quảng cáo có sẵn
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {adsData.adFormats.map((format) => (
              <div key={format.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">{format.type.toUpperCase()}</h4>
                <p className="text-sm text-black mb-2">{format.size}</p>
                <p className="text-xs text-black mb-3">{format.placement}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPM:</span>
                    <span className="font-bold">{formatCurrency(format.cpm)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Available:</span>
                    <span className="font-bold text-green-600">{adsData.realTimeMetrics.inventoryAvailable[format.id as keyof typeof adsData.realTimeMetrics.inventoryAvailable]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Viewability:</span>
                    <span className="font-bold">{formatPercentage(format.viewabilityRate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            🚀 Chiến dịch quảng cáo đang chạy
          </h3>
          
          <div className="space-y-4">
            {sponsorAds.map((ad) => (
              <div key={ad.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={ad.imageUrl} alt={ad.sponsor} className="w-12 h-12 object-contain rounded" />
                      <div>
                        <h4 className="font-bold text-gray-900">{ad.title}</h4>
                        <p className="text-sm text-black">{ad.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-black">Format</p>
                        <p className="font-semibold text-gray-900">{ad.format}</p>
                      </div>
                      <div>
                        <p className="text-xs text-black">Bid Amount</p>
                        <p className="font-semibold text-gray-900">{formatCurrency(ad.bidAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-black">CTR</p>
                        <p className="font-semibold text-green-600">{formatPercentage(ad.performance.ctr)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-black">Conversions</p>
                        <p className="font-semibold text-blue-600">{formatNumber(ad.performance.conversions)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-black">
                      <span>📊 {formatNumber(ad.performance.impressions)} impressions</span>
                      <span>🖱️ {formatNumber(ad.performance.clicks)} clicks</span>
                      <span>🎯 {formatPercentage(ad.performance.conversionRate)} conversion rate</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      {ad.status.toUpperCase()}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Pause className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Auction Data */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Lịch sử đấu giá real-time
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-900">Thời gian</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Ad Slot</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Winner</th>
                  <th className="text-right py-3 font-semibold text-gray-900">Final Price</th>
                  <th className="text-left py-3 font-semibold text-gray-900">User Profile</th>
                  <th className="text-left py-3 font-semibold text-gray-900">Competitors</th>
                </tr>
              </thead>
              <tbody>
                {adsData.auctionData.map((auction, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-black">
                      {new Date(auction.timestamp).toLocaleTimeString('vi-VN')}
                    </td>
                    <td className="py-3 font-medium text-gray-900">{auction.adSlot}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        {auction.winner}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-gray-900">{formatCurrency(auction.finalPrice)}</td>
                    <td className="py-3 text-black">
                      {auction.user.age} tuổi, {auction.user.major}, {auction.user.university}
                    </td>
                    <td className="py-3 text-black">
                      {auction.bidders.length} bidders
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
