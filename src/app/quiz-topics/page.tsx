'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Clock, Play, ArrowLeft, GraduationCap, Search, X } from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';

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
  learningContent: Record<string, unknown>[];
  quizQuestions: Record<string, unknown>[];
}

export default function QuizTopicsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [topics, setTopics] = useState<QuizTopic[]>([]);
  const [error, setError] = useState('');

  // Fetch topics from API
  const fetchTopics = async () => {
    try {
      setIsLoadingTopics(true);
      setError('');
      
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedAgeGroup !== 'all') params.append('ageGroup', selectedAgeGroup);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const response = await fetch(`/api/quiz-topics?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTopics(data.topics);
      } else {
        setError(data.error || 'Không thể tải danh sách chủ đề');
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      setError('Lỗi kết nối, vui lòng thử lại');
    } finally {
      setIsLoadingTopics(false);
    }
  };

  // Get unique categories and age groups from topics
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(topics.map(topic => topic.category)));
    return ['all', ...uniqueCategories];
  }, [topics]);

  const ageGroups = useMemo(() => {
    const uniqueAgeGroups = Array.from(new Set(topics.map(topic => topic.ageGroup)));
    return ['all', ...uniqueAgeGroups];
  }, [topics]);

  // Fetch topics when component mounts or filters change
  useEffect(() => {
    fetchTopics();
  }, [selectedCategory, selectedAgeGroup, searchQuery]);

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
                <p className="text-xs text-gray-600">{user.tute_points} điểm TUTE</p>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="min-w-[160px]">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="text-gray-900">
                        {category === 'all' ? 'Tất cả danh mục' : category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-[160px]">
                  <select
                    value={selectedAgeGroup}
                    onChange={(e) => setSelectedAgeGroup(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    {ageGroups.map(ageGroup => (
                      <option key={ageGroup} value={ageGroup} className="text-gray-900">
                        {ageGroup === 'all' ? 'Tất cả độ tuổi' : ageGroup}
                      </option>
                    ))}
                  </select>
                </div>

                {(searchQuery || selectedCategory !== 'all' || selectedAgeGroup !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2 min-w-fit"
                  >
                    <X className="w-4 h-4" />
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
              <button 
                onClick={fetchTopics}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Loading Topics */}
          {isLoadingTopics && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách chủ đề...</p>
            </div>
          )}

          {/* Topics Grid */}
          {!isLoadingTopics && !error && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Có {topics.length} chủ đề học tập
                </h3>
              </div>

              {topics.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy chủ đề nào</h3>
                  <p className="text-gray-600 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Xem tất cả chủ đề
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-3xl">{topic.icon}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                            {getDifficultyText(topic.difficulty)}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{topic.description}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{topic.estimatedTime} phút</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{topic.category}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {topic.keywords.slice(0, 3).map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                            >
                              {keyword}
                            </span>
                          ))}
                          {topic.keywords.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{topic.keywords.length - 3}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleSelectTopic(topic.id)}
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <Play className="w-4 h-4" />
                          Bắt đầu học
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
} 