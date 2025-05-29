'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { School } from '@/types';
import { BookOpen, Trophy, Users, Play, LogOut, Award, Calendar, TrendingUp, GraduationCap } from 'lucide-react';
import schoolsData from '../../../data/schools.json';
import usersData from '../../../data/users.json';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userSchool, setUserSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

    // Tìm thông tin trường của user
    const school = schoolsData.find(s => s.id === user.schoolId);
    setUserSchool(school || null);

    // Tính toán thứ hạng người chơi
    const calculateUserRankings = () => {
      // Giả lập điểm số hàng ngày và hàng tháng
      const allUsers = usersData.map(u => ({
        ...u,
        dailyPoints: Math.floor(Math.random() * 100) + u.tutePoints * 0.1,
        monthlyPoints: Math.floor(Math.random() * 500) + u.tutePoints * 0.3
      }));

      // Sắp xếp theo điểm hàng ngày
      const dailySorted = [...allUsers].sort((a, b) => b.dailyPoints - a.dailyPoints);
      const dailyRank = dailySorted.findIndex(u => u.id === user.id) + 1;

      // Sắp xếp theo điểm hàng tháng  
      const monthlySorted = [...allUsers].sort((a, b) => b.monthlyPoints - a.monthlyPoints);
      const monthlyRank = monthlySorted.findIndex(u => u.id === user.id) + 1;

      setUserRankings({
        dailyRank,
        monthlyRank,
        totalUsers: allUsers.length
      });
    };

    calculateUserRankings();
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

  return (
    <>
      <LoadingOverlay isVisible={isLoading} message="Đang tải..." />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="/17164524823262_logo-web-con-voi.png" 
                  alt="Freedom Training Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Freedom Training</h1>
                <p className="text-sm text-gray-600">Nền tảng học tập trực tuyến</p>
              </div>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{userSchool.shortName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

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
                  <span className="font-semibold">{user.tutePoints} điểm TUTE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Trường: {userSchool.totalTutePoints} điểm</span>
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
                <p className="text-3xl font-bold text-gray-900">{user.tutePoints}</p>
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
                <p className="text-3xl font-bold text-gray-900">{userSchool.totalTutePoints}</p>
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
                <p className="text-3xl font-bold text-gray-900">
                  #{schoolsData
                    .sort((a, b) => b.totalTutePoints - a.totalTutePoints)
                    .findIndex(s => s.id === userSchool.id) + 1}
                </p>
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
              <p className="text-gray-600">Mã trường: {userSchool.shortName}</p>
              <p className="text-sm text-gray-500">Tổng điểm TUTE: {userSchool.totalTutePoints}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 