'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { School } from '@/types';
import { Trophy, Medal, Award, ArrowLeft, BookOpen, Users } from 'lucide-react';
import schoolsData from '../../../data/schools.json';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sortedSchools, setSortedSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Sắp xếp trường theo điểm TUTE
    const sorted = [...schoolsData].sort((a, b) => b.totalTutePoints - a.totalTutePoints);
    setSortedSchools(sorted);
  }, [user, router]);

  const handleBackToDashboard = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/dashboard');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600">{rank}</span>
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay isVisible={isLoading} message="Đang tải..." />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại Dashboard</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="/17164524823262_logo-web-con-voi.png" 
                  alt="Freedom Training Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Freedom Training</h1>
                <p className="text-sm text-gray-600">Bảng xếp hạng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Bảng Xếp Hạng Các Trường</h2>
          <p className="text-xl text-gray-600 mb-6">
            Thi đua điểm TUTE giữa các trường đại học
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600">Trường dẫn đầu</p>
              <p className="text-2xl font-bold text-gray-900">{sortedSchools[0]?.shortName}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Tổng số trường</p>
              <p className="text-2xl font-bold text-gray-900">{sortedSchools.length}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-600">Điểm cao nhất</p>
              <p className="text-2xl font-bold text-gray-900">{sortedSchools[0]?.totalTutePoints}</p>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Top 3 Trường Hàng Đầu</h3>
          <div className="flex justify-center items-end space-x-4 max-w-4xl mx-auto">
            {/* 2nd Place */}
            {sortedSchools[1] && (
              <div className="text-center">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 mb-4 transform hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-600" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{sortedSchools[1].shortName}</h4>
                  <p className="text-sm text-gray-600 mb-3">{sortedSchools[1].name}</p>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-2xl font-bold text-gray-900">{sortedSchools[1].totalTutePoints}</p>
                    <p className="text-sm text-gray-600">điểm TUTE</p>
                  </div>
                </div>
                <div className="w-20 h-16 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-lg flex items-center justify-center">
                  <Medal className="w-8 h-8 text-white" />
                </div>
              </div>
            )}

            {/* 1st Place */}
            {sortedSchools[0] && (
              <div className="text-center">
                <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-yellow-200 mb-4 transform hover:scale-105 transition-transform">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-yellow-600" />
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">{sortedSchools[0].shortName}</h4>
                  <p className="text-sm text-gray-600 mb-4">{sortedSchools[0].name}</p>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-3xl font-bold text-yellow-900">{sortedSchools[0].totalTutePoints}</p>
                    <p className="text-sm text-yellow-700">điểm TUTE</p>
                  </div>
                </div>
                <div className="w-24 h-20 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {sortedSchools[2] && (
              <div className="text-center">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-200 mb-4 transform hover:scale-105 transition-transform">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{sortedSchools[2].shortName}</h4>
                  <p className="text-sm text-gray-600 mb-3">{sortedSchools[2].name}</p>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-amber-900">{sortedSchools[2].totalTutePoints}</p>
                    <p className="text-sm text-amber-700">điểm TUTE</p>
                  </div>
                </div>
                <div className="w-20 h-12 bg-gradient-to-t from-amber-400 to-amber-500 rounded-t-lg flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Bảng Xếp Hạng Đầy Đủ</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {sortedSchools.map((school, index) => {
              const rank = index + 1;
              const isUserSchool = school.id === user?.schoolId;
              
              return (
                <div
                  key={school.id}
                  className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    isUserSchool ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(rank)}`}>
                      {rank <= 3 ? getRankIcon(rank) : <span className="font-bold">{rank}</span>}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-lg ${isUserSchool ? 'text-blue-900' : 'text-gray-900'}`}>
                          {school.shortName}
                          {isUserSchool && (
                            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Trường của bạn
                            </span>
                          )}
                        </h4>
                        <p className="text-gray-600">{school.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${isUserSchool ? 'text-blue-900' : 'text-gray-900'}`}>
                      {school.totalTutePoints}
                    </p>
                    <p className="text-sm text-gray-600">điểm TUTE</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User's School Highlight */}
        {user && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">Trường của bạn</h4>
                <p className="text-blue-700">
                  {sortedSchools.find(s => s.id === user.schoolId)?.name} đang xếp hạng thứ{' '}
                  <span className="font-bold">
                    #{sortedSchools.findIndex(s => s.id === user.schoolId) + 1}
                  </span>{' '}
                  với {sortedSchools.find(s => s.id === user.schoolId)?.totalTutePoints} điểm TUTE
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
} 