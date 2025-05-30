'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, Trophy, Users, ArrowRight, Sparkles, Target, Award, TrendingUp, Bell, Gift, Coins } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import investorsData from '../../data/investors.json';
import InvestorShowcase from '../components/InvestorShowcase';
import InvestorRankingMobile from '../components/InvestorRankingMobile';

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

interface InvestorData {
  dailyPool: number;
  totalPool: number;
  investors: Investor[];
  minorSponsors?: string[];
}

export default function HomePage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const hasShownWelcome = useRef(false);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    
    // Animation delay
    setTimeout(() => setIsLoaded(true), 100);

    // Welcome notification - chỉ hiển thị 1 lần
    // if (!hasShownWelcome.current) {
    //   hasShownWelcome.current = true;
    //   setTimeout(() => {
    //     notifications.success(
    //       'Chào mừng đến với Freedom Training!',
    //       'Khám phá nền tảng học tập thông minh với phần thưởng TUTE thực tế',
    //       { duration: 6000 }
    //     );
    //   }, 2000);
    // }
  }, []); // Bỏ notifications khỏi dependency array

  const handleLearnToEarn = () => {
    // notifications.info(
    //   'Đang chuyển hướng...',
    //   'Bạn sẽ được chuyển đến trang đăng nhập để bắt đầu hành trình học tập',
    //   { duration: 3000 }
    // );
    
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  const handleDemoNotifications = () => {
    // const demos = [
    //   () => notifications.success('Hoàn thành bài quiz!', 'Bạn đã kiếm được 50 TUTE từ bài quiz Toán học'),
    //   () => notifications.warning('Pool sắp hết!', 'Chỉ còn 42.3% pool tài trợ, hãy nhanh tay tham gia'),
    //   () => notifications.info('Thông báo mới', 'Có 5 bài quiz mới được thêm vào hệ thống')
    // ];
    
    // demos.forEach((demo, index) => {
    //   setTimeout(demo, index * 1500);
    // });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className={`flex items-center space-x-2 sm:space-x-3 transition-all duration-700 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-blue-500/20">
                <img 
                  src="/17164524823262_logo-web-con-voi.png" 
                  alt="Freedom Training Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Freedom Training
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Nền tảng học tập thông minh</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handleLearnToEarn}
                className={`group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-1 sm:space-x-2 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
              >
                <span className="text-sm sm:text-base">Đăng nhập</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className={`transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium mb-6 border border-blue-200/50">
                <Sparkles className="w-4 h-4 mr-2" />
                Nền tảng học tập với phần thưởng thực tế
              </div>
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Freedom
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Training
                </span>
              </h1>

              {/* Learn to Earn Button - Moved here */}
              <div className={`mb-8 transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
                Học tập thông minh, kiếm điểm TUTE với hệ thống phần thưởng 
                <span className="font-semibold text-blue-600"> TUTE </span>
                độc đáo từ các doanh nghiệp hàng đầu Việt Nam
              </p>
               
                <button
                  onClick={handleLearnToEarn}
                  className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-16 py-5 rounded-2xl text-xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center mx-auto relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Gift className="w-6 h-6 mr-3 relative z-10" />
                  <span className="relative z-10">Learn to Earn</span>
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform relative z-10" />
                </button>
                
                {/* <p className="text-gray-500 text-sm mt-4">
                  🎯 Bắt đầu hành trình học tập và kiếm điểm TUTE ngay hôm nay
                </p> */}
              </div>
              
             
            </div>
            
            {/* Quick Stats */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                   onClick={() => {}}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">2,156</div>
                <div className="text-xs sm:text-sm text-gray-600">Sinh viên</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                   onClick={() => {}}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">234K</div>
                <div className="text-xs sm:text-sm text-gray-600">TUTE đã trả</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                   onClick={() => {}}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">845K</div>
                <div className="text-xs sm:text-sm text-gray-600">TUTE còn lại</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                   onClick={() => {}}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">42.3%</div>
                <div className="text-xs sm:text-sm text-gray-600">Pool khả dụng</div>
              </div>
            </div>

            {/* Showcase Nhà Tài Trợ */}
            <div className={`mt-16 sm:mt-20 transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="max-w-6xl mx-auto">
                {/* Desktop: InvestorShowcase, Mobile: InvestorRankingMobile */}
                <div className="hidden lg:block">
                  <InvestorShowcase 
                    investorData={investorsData as InvestorData} 
                    formatCurrency={formatCurrency}
                  />
                </div>
                <div className="lg:hidden">
                  <InvestorRankingMobile 
                    investors={investorsData.investors}
                    formatCurrency={formatCurrency}
                    totalPool={investorsData.totalPool}
                    dailyPool={investorsData.dailyPool}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white/50 backdrop-blur-sm py-20 border-y border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Tại sao chọn Freedom Training?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Nền tảng học tập thông minh với hệ thống phần thưởng độc đáo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group text-center p-6 sm:p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Học tập hiệu quả</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Hệ thống quiz đa dạng với nhiều chủ đề khác nhau, được thiết kế đặc biệt 
                cho sinh viên các trường đại học tại Việt Nam
              </p>
            </div>
            
            <div className="group text-center p-6 sm:p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Tích lũy điểm TUTE</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Mỗi câu trả lời đúng sẽ được cộng điểm TUTE có giá trị thực tế. 
                Tích lũy để nhận phần thưởng từ các doanh nghiệp
              </p>
            </div>
            
            <div className="group text-center p-6 sm:p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Thi đua giữa các trường</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Cạnh tranh lành mạnh giữa các trường đại học, tạo động lực học tập 
                và xây dựng cộng đồng sinh viên năng động
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="/17164524823262_logo-web-con-voi.png" 
                  alt="Freedom Training Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Freedom Training
              </h3>
            </div>
            <p className="text-gray-300 mb-6 text-lg">
              Nền tảng đào tạo dựa trên công nghệ Blockchain hàng đầu hiện nay
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Về chúng tôi</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Điều khoản</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Bảo mật</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Liên hệ</a>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Freedom Training. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
