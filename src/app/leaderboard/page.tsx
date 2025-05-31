'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { School, User } from '@/types';
import { Trophy, Medal, ArrowLeft, Users, Crown, TrendingUp, GraduationCap } from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';

interface LeaderboardResponse {
  success: boolean;
  leaderboard: School[] | User[];
}

export default function Leaderboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'schools' | 'users'>('schools');
  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchLeaderboardData();
  }, [user, router, activeTab]);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/leaderboard?type=${activeTab}&limit=50`);
      const data: LeaderboardResponse = await response.json();

      if (data.success) {
        if (activeTab === 'schools') {
          setSchools(data.leaderboard as School[]);
        } else {
          setUsers(data.leaderboard as User[]);
        }
      } else {
        setError('Không thể tải dữ liệu xếp hạng');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="font-bold text-gray-600">#{rank}</span>;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200';
    return 'bg-white border-gray-200';
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <LoadingOverlay isVisible={isLoading} message="Đang tải xếp hạng..." />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Quay lại Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Bảng Xếp Hạng</h1>
              <div className="w-32"></div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Cuộc Thi TUTE Points</h2>
                <p className="text-blue-100 mb-4">
                  Cạnh tranh giữa các trường đại học trên toàn quốc
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Tổng: {schools.length} trường</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Cập nhật: Real-time</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex space-x-4">
                <div className="text-center">
                  <p className="text-blue-100 text-sm">Điểm cá nhân</p>
                  <p className="text-2xl font-bold">{user.tute_points}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
            <button
              onClick={() => setActiveTab('schools')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'schools'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Xếp hạng trường</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Xếp hạng cá nhân</span>
              </div>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800">{error}</p>
              <button 
                onClick={fetchLeaderboardData}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Schools Leaderboard */}
          {activeTab === 'schools' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Xếp hạng các trường đại học
              </h3>
              {schools.map((school, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={school.id}
                    className={`${getRankStyle(rank)} rounded-xl p-6 border-2 transition-all hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          {getRankIcon(rank)}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={school.logo} 
                              alt={school.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{school.name}</h4>
                            <p className="text-gray-600">{school.short_name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {school.total_tute_points.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">điểm TUTE</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Users Leaderboard */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Xếp hạng cá nhân
              </h3>
              {users.map((userItem, index) => {
                const rank = index + 1;
                const isCurrentUser = userItem.id === user.id;
                return (
                  <div
                    key={userItem.id}
                    className={`${getRankStyle(rank)} rounded-xl p-6 border-2 transition-all hover:shadow-md ${
                      isCurrentUser ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                          {getRankIcon(rank)}
                        </div>
                        <div>
                          <h4 className={`text-lg font-semibold ${isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>
                            {userItem.name} {isCurrentUser && '(Bạn)'}
                          </h4>
                          <p className="text-gray-600">ID: {userItem.school_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>
                          {userItem.tute_points.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">điểm TUTE</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 