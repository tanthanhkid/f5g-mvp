'use client';

import { useState, useEffect } from 'react';
import { Users, Star, TrendingUp, DollarSign, Eye, Heart, Share, MessageCircle, Award, Calendar, Target, Zap } from 'lucide-react';
import influencersData from '../../../data/influencers.json';

export default function InfluencerProgramPage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedTier, setSelectedTier] = useState('all');
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'nano': return 'bg-green-100 text-green-800';
      case 'micro': return 'bg-blue-100 text-blue-800';
      case 'macro': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInfluencers = selectedTier === 'all' 
    ? influencersData.activeInfluencers 
    : influencersData.activeInfluencers.filter(inf => inf.tier === selectedTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            🌟 Creator Partnership Program
          </h1>
          <p className="text-gray-600">
            Quản lý chương trình đối tác influencer và content creator
          </p>
        </div>

        {/* Program Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{influencersData.program.partnersCount}</h3>
              <p className="text-gray-600">Active Partners</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatNumber(influencersData.program.totalReach)}</h3>
              <p className="text-gray-600">Total Reach</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatNumber(influencersData.program.totalEngagement)}</h3>
              <p className="text-gray-600">Total Engagement</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(influencersData.program.currentSpent)}</h3>
              <p className="text-gray-600">Total Paid</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
                { id: 'influencers', label: 'Influencers', icon: Users },
                { id: 'campaigns', label: 'Campaigns', icon: Target },
                { id: 'content', label: 'Content', icon: Star }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Tier Performance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Hiệu quả theo tier</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {influencersData.tiers.map((tier) => (
                  <div key={tier.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">{tier.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(tier.id)}`}>
                        {tier.followerRange}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Commission:</span>
                        <span className="font-bold">{formatPercentage(tier.commissionRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bonus/Quiz:</span>
                        <span className="font-bold">{formatCurrency(tier.bonusPerQuiz)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Partners:</span>
                        <span className="font-bold">
                          {influencersData.activeInfluencers.filter(inf => inf.tier === tier.id).length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Benefits:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tier.benefits.slice(0, 2).map((benefit, index) => (
                          <li key={index}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">🏆 Top Performers (Tháng này)</h3>
                <div className="space-y-4">
                  {influencersData.leaderboard.monthly.map((leader) => {
                    const influencer = influencersData.activeInfluencers.find(inf => inf.id === leader.influencer);
                    return (
                      <div key={leader.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            leader.rank === 1 ? 'bg-yellow-500' : 
                            leader.rank === 2 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {leader.rank}
                          </div>
                          <div className="flex items-center gap-3">
                            <img 
                              src={influencer?.avatar} 
                              alt={influencer?.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{influencer?.name}</p>
                              <p className="text-sm text-gray-600">{influencer?.username}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatCurrency(leader.earnings)}</p>
                          <p className="text-sm text-gray-600">{formatNumber(leader.referrals)} refs</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Analytics Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <span className="text-gray-700 font-medium">Avg Conversion Rate</span>
                      <p className="text-sm text-gray-500">Cross all influencers</p>
                    </div>
                    <span className="text-xl font-bold text-blue-600">{formatPercentage(influencersData.analytics.avgConversionRate)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <span className="text-gray-700 font-medium">Avg Engagement Rate</span>
                      <p className="text-sm text-gray-500">All platforms</p>
                    </div>
                    <span className="text-xl font-bold text-green-600">{formatPercentage(influencersData.analytics.avgEngagementRate)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <div>
                      <span className="text-gray-700 font-medium">Top Platform</span>
                      <p className="text-sm text-gray-500">Best performing</p>
                    </div>
                    <span className="text-xl font-bold text-purple-600 capitalize">{influencersData.analytics.topPerformingPlatform}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                    <div>
                      <span className="text-gray-700 font-medium">Best Content Type</span>
                      <p className="text-sm text-gray-500">Most engaging</p>
                    </div>
                    <span className="text-xl font-bold text-orange-600 capitalize">{influencersData.analytics.bestContentType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Influencers Tab */}
        {selectedTab === 'influencers' && (
          <div className="space-y-8">
            {/* Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Filter by tier:</label>
                <select 
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="nano">Nano (1K-10K)</option>
                  <option value="micro">Micro (10K-100K)</option>
                  <option value="macro">Macro (100K-1M)</option>
                </select>
              </div>
            </div>

            {/* Influencers List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredInfluencers.map((influencer) => (
                <div key={influencer.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={influencer.avatar} 
                        alt={influencer.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{influencer.name}</h4>
                        <p className="text-blue-600">{influencer.username}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(influencer.tier)}`}>
                            {influencer.tier.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">{formatNumber(influencer.followers)} followers</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Engagement Rate</p>
                      <p className="text-xl font-bold text-green-600">{formatPercentage(influencer.engagementRate)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Earnings</p>
                      <p className="font-bold text-gray-900">{formatCurrency(influencer.performance.totalEarnings)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Referrals</p>
                      <p className="font-bold text-gray-900">{formatNumber(influencer.performance.totalReferrals)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversion Rate</p>
                      <p className="font-bold text-blue-600">{formatPercentage(influencer.performance.conversionRate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Viral Quizzes</p>
                      <p className="font-bold text-purple-600">{influencer.performance.viralQuizzes}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2">Platforms:</p>
                    <div className="flex gap-2">
                      {Object.entries(influencer.platforms).map(([platform, followers]) => (
                        <span key={platform} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {platform}: {formatNumber(followers as number)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Content Style:</p>
                    <p className="text-sm text-gray-800">{influencer.contentStyle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {selectedTab === 'campaigns' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {influencersData.campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{campaign.name}</h4>
                      <p className="text-gray-600">{campaign.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="font-bold text-gray-900">{formatCurrency(campaign.budget)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Spent</p>
                      <p className="font-bold text-red-600">{formatCurrency(campaign.spent)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reach</p>
                      <p className="font-bold text-blue-600">{formatNumber(campaign.actualReach)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ROI</p>
                      <p className="font-bold text-green-600">{campaign.roi}x</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Budget Usage</span>
                      <span className="text-sm font-medium">{((campaign.spent / campaign.budget) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{width: `${(campaign.spent / campaign.budget) * 100}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2">Participating Influencers:</p>
                    <div className="flex -space-x-2">
                      {campaign.participatingInfluencers.map((infId) => {
                        const inf = influencersData.activeInfluencers.find(i => i.id === infId);
                        return (
                          <img 
                            key={infId}
                            src={inf?.avatar} 
                            alt={inf?.name}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            title={inf?.name}
                          />
                        );
                      })}
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-600">+{campaign.participatingInfluencers.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {selectedTab === 'content' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {influencersData.contentLibrary.map((content) => {
                const influencer = influencersData.activeInfluencers.find(inf => inf.id === content.influencer);
                return (
                  <div key={content.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img 
                        src={influencer?.avatar} 
                        alt={influencer?.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{content.title}</h4>
                        <p className="text-sm text-gray-600">{influencer?.name} • {content.platform}</p>
                        <p className="text-xs text-gray-500">{new Date(content.publishDate).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {content.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <Eye className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-900">{formatNumber(content.views)}</p>
                        <p className="text-xs text-gray-500">Views</p>
                      </div>
                      <div className="text-center">
                        <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-900">{formatNumber(content.likes)}</p>
                        <p className="text-xs text-gray-500">Likes</p>
                      </div>
                      <div className="text-center">
                        <Share className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-900">{formatNumber(content.shares)}</p>
                        <p className="text-xs text-gray-500">Shares</p>
                      </div>
                      <div className="text-center">
                        <MessageCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-900">{formatNumber(content.comments)}</p>
                        <p className="text-xs text-gray-500">Comments</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Referrals: <span className="font-bold text-blue-600">{formatNumber(content.referrals)}</span></p>
                        <p className="text-sm text-gray-600">Earnings: <span className="font-bold text-green-600">{formatCurrency(content.earnings)}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Engagement</p>
                        <p className="text-lg font-bold text-purple-600">{formatPercentage(content.engagement)}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex flex-wrap gap-2">
                        {content.hashtags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 