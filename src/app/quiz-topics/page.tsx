'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Clock, Play, ArrowLeft, GraduationCap, Search, Filter, X } from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';
import quizTopicsData from '../../../data/quiz-topics.json';

interface QuizTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  estimatedTime: number;
  category: string;
  ageGroup: string;
  keywords: string[];
  learningContent: any[];
  quizQuestions: any[];
}

export default function QuizTopicsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');

  // Use useMemo for topics to prevent unnecessary re-creation
  const topics = useMemo(() => quizTopicsData as QuizTopic[], []);

  // Get unique categories and age groups
  const categories = useMemo(() => ['all', ...Array.from(new Set(topics.map(topic => topic.category)))], [topics]);
  const ageGroups = useMemo(() => ['all', ...Array.from(new Set(topics.map(topic => topic.ageGroup)))], [topics]);

  // Use useMemo for filtered topics to prevent infinite loops
  const filteredTopics = useMemo(() => {
    let filtered = topics;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
        topic.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }

    // Age group filter
    if (selectedAgeGroup !== 'all') {
      filtered = filtered.filter(topic => topic.ageGroup === selectedAgeGroup);
    }

    return filtered;
  }, [topics, searchQuery, selectedCategory, selectedAgeGroup]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  const handleBackToDashboard = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/dashboard');
  };

  const handleSelectTopic = async (topicId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push(`/enhanced-quiz/${topicId}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedAgeGroup('all');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung bình';
      case 'advanced': return 'Nâng cao';
      default: return difficulty;
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
      <LoadingOverlay isVisible={isLoading} message="Đang tải chủ đề..." />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBackToDashboard}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
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
                    <h1 className="text-2xl font-bold text-gray-900">Thường thức cuộc sống</h1>
                    <p className="text-sm text-gray-600">Học kỹ năng sống, làm quiz kiểm tra</p>
                  </div>
                </button>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.tutePoints} điểm TUTE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
            <div className="text-center">
              <GraduationCap className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Thường thức cuộc sống</h2>
              <p className="text-green-100 text-lg">
                Học các kỹ năng sống thiết yếu, sau đó làm quiz để củng cố kiến thức
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài học (ví dụ: an toàn, sơ cứu, giao thông...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="min-w-[160px]">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Tất cả chủ đề' : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-[180px]">
                  <select
                    value={selectedAgeGroup}
                    onChange={(e) => setSelectedAgeGroup(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ageGroups.map(ageGroup => (
                      <option key={ageGroup} value={ageGroup}>
                        {ageGroup === 'all' ? 'Tất cả lứa tuổi' : ageGroup}
                      </option>
                    ))}
                  </select>
                </div>

                {(searchQuery || selectedCategory !== 'all' || selectedAgeGroup !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search Results Info */}
            <div className="mt-4 text-sm text-gray-600">
              Tìm thấy <span className="font-semibold text-gray-900">{filteredTopics.length}</span> bài học
              {searchQuery && (
                <span> cho từ khóa "<span className="font-semibold text-blue-600">{searchQuery}</span>"</span>
              )}
            </div>
          </div>

          {/* Topics Grid */}
          {filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => handleSelectTopic(topic.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl mb-3">{topic.icon}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                      {getDifficultyText(topic.difficulty)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {topic.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {topic.description}
                  </p>

                  {/* Topic Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{topic.learningContent.length} nội dung</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Play className="w-4 h-4" />
                        <span>{topic.quizQuestions.length} câu hỏi</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>~{topic.estimatedTime} phút</span>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {topic.ageGroup}
                      </span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {topic.category}
                    </span>
                  </div>

                  {/* Learning Flow Preview */}
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 mb-2">Luồng học tập:</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">📖 Học</span>
                      <span className="text-gray-400">→</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">🎯 Quiz</span>
                      <span className="text-gray-400">→</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">🏆 Điểm</span>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 group-hover:bg-blue-700">
                    <GraduationCap className="w-4 h-4" />
                    <span>Bắt đầu học</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài học</h3>
              <p className="text-gray-600 mb-4">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm bài học phù hợp
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-12 bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Về chương trình thường thức cuộc sống</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">1. Học kỹ năng sống</h4>
                <p className="text-sm text-gray-600">Kiến thức thiết yếu cho cuộc sống hàng ngày</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">2. Kiểm tra hiểu biết</h4>
                <p className="text-sm text-gray-600">Quiz giúp củng cố và ghi nhớ kiến thức</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">3. Tích lũy điểm số</h4>
                <p className="text-sm text-gray-600">Nhận điểm TUTE cho bản thân và trường</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 