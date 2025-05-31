'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { School } from '@/types';
import { BookOpen, Trophy, Users, Play, LogOut, Award, Calendar, TrendingUp, GraduationCap } from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';

interface LeaderboardResponse {
  success: boolean;
  leaderboard: School[];
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userSchool, setUserSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [userRankings, setUserRankings] = useState({
    dailyRank: 0,
    monthlyRank: 0,
    totalUsers: 0
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch schools data từ database
    const fetchSchoolsData = async () => {
      try {
        const response = await fetch('/api/leaderboard?type=schools');
        const data: LeaderboardResponse = await response.json();
        
        if (data.success) {
          setSchools(data.leaderboard);
          
          // Tìm thông tin trường của user
          const school = data.leaderboard.find(s => s.id === user.school_id);
          setUserSchool(school || null);
        }
      } catch (error) {
        console.error('Error fetching schools data:', error);
      }
    };

    // Fetch user leaderboard data để tính ranking
    const fetchUserRankings = async () => {
      try {
        const response = await fetch('/api/leaderboard?type=users&limit=100');
        const data = await response.json();
        
        if (data.success) {
          // Tính toán thứ hạng người chơi (simplified)
          const userIndex = data.leaderboard.findIndex((u: any) => u.id === user.id);
          
          setUserRankings({
            dailyRank: userIndex >= 0 ? userIndex + 1 : 0,
            monthlyRank: userIndex >= 0 ? userIndex + 1 : 0,
            totalUsers: data.leaderboard.length
          });
        }
      } catch (error) {
        console.error('Error fetching user rankings:', error);
      }
    };

    fetchSchoolsData();
    fetchUserRankings();
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleStartQuiz = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/quiz-topics');
  };

  const handleViewLeaderboard = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/leaderboard');
  };

  if (!user || !userSchool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Tính school ranking từ schools data
  const schoolRank = schools
    .sort((a, b) => b.total_tute_points - a.total_tute_points)
    .findIndex(s => s.id === userSchool.id) + 1;

  return (
    <>
      <LoadingOverlay isVisible={isLoading} message="Đang tải..." />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden">
                <img 
                  src="/17164524823262_logo-web-con-voi.png" 
                  alt="Freedom Training Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Freedom Training</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Nền tảng học tập trực tuyến</p>
              </div>
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-24 sm:max-w-none">{user.name}</p>
                <p className="text-xs text-gray-600">{userSchool.short_name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Chào mừng, {user.name}!</h2>
              <p className="text-blue-100 mb-4">
                Bạn đang đại diện cho <span className="font-semibold">{userSchool.name}</span>
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">{user.tute_points} điểm TUTE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Trường: {userSchool.total_tute_points} điểm</span>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <button
                onClick={handleStartQuiz}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Thường thức cuộc sống</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Điểm TUTE cá nhân</p>
                <p className="text-3xl font-bold text-gray-900">{user.tute_points}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Điểm trường</p>
                <p className="text-3xl font-bold text-gray-900">{userSchool.total_tute_points}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Xếp hạng trường</p>
                <p className="text-3xl font-bold text-gray-900">#{schoolRank}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hạng hôm nay</p>
                <p className="text-3xl font-bold text-gray-900">#{userRankings.dailyRank}</p>
                <p className="text-xs text-gray-500">/{userRankings.totalUsers} người</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hạng tháng này</p>
                <p className="text-3xl font-bold text-gray-900">#{userRankings.monthlyRank}</p>
                <p className="text-xs text-gray-500">/{userRankings.totalUsers} người</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thường thức cuộc sống</h3>
                <p className="text-gray-600 mb-4">
                  Học các kỹ năng sống thiết yếu như an toàn nước, sơ cứu, giao thông và làm quiz kiểm tra
                </p>
                <button
                  onClick={handleStartQuiz}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Bắt đầu ngay
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bảng xếp hạng</h3>
                <p className="text-gray-600 mb-4">
                  Xem thứ hạng của trường bạn và cạnh tranh với các trường khác trên toàn quốc
                </p>
                <button
                  onClick={handleViewLeaderboard}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Xem bảng xếp hạng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* School Info */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Thông tin trường</h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{userSchool.name}</h4>
              <p className="text-gray-600">Mã trường: {userSchool.short_name}</p>
              <p className="text-sm text-gray-500">Tổng điểm TUTE: {userSchool.total_tute_points}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 