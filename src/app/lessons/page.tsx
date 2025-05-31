'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson } from '@/types';
import { BookOpen, Clock, Target, Play, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';

interface LessonsResponse {
  success: boolean;
  lessons: Lesson[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

export default function LessonsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchLessons();
  }, [user, router, selectedCategory, selectedDifficulty]);

  const fetchLessons = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      params.append('limit', '20');

      const response = await fetch(`/api/lessons?${params.toString()}`);
      const data: LessonsResponse = await response.json();

      if (data.success) {
        setLessons(data.lessons);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...Array.from(new Set(data.lessons.map(lesson => lesson.category).filter(Boolean)))];
        setCategories(uniqueCategories);
      } else {
        setError(data.error || 'Không thể tải danh sách bài học');
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung bình';
      case 'advanced':
        return 'Nâng cao';
      default:
        return difficulty;
    }
  };

  const handleStartLesson = (lessonId: string) => {
    router.push(`/lessons/${lessonId}`);
  };

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchLessons}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Quay về Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoadingOverlay isVisible={isLoading} message="Đang tải bài học..." />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay về Dashboard</span>
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
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Freedom Training</h1>
                    <p className="text-sm text-gray-600">Bài học</p>
                  </div>
                </div>
              </button>

              <div className="w-32"></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Bài Học Thực Hành</h2>
                <p className="text-green-100 mb-4">
                  Học các kỹ năng sống thiết yếu qua video và quiz tương tác
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Tổng: {lessons.length} bài học</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Cập nhật: Real-time</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex space-x-4">
                <div className="text-center">
                  <p className="text-green-100 text-sm">Điểm cá nhân</p>
                  <p className="text-2xl font-bold">{user.tute_points}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Lọc bài học</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="text-gray-900">
                      {category === 'all' ? 'Tất cả' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ khó
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty} className="text-gray-900">
                      {difficulty === 'all' ? 'Tất cả' : getDifficultyText(difficulty)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lessons Grid */}
          {lessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {lesson.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {lesson.description}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.estimatedTime} phút</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{(lesson as any).contentBlocksCount || lesson.contentBlocks?.length || 0} blocks</span>
                      </div>
                    </div>

                    {/* Category & Difficulty */}
                    <div className="flex items-center space-x-2 mb-4">
                      {lesson.category && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {lesson.category}
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                        {getDifficultyText(lesson.difficulty)}
                      </span>
                    </div>

                    {/* Learning Objectives */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Mục tiêu học tập:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {lesson.learningObjectives?.slice(0, 3).map((objective, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500 font-bold">•</span>
                            <span className="line-clamp-1">{objective}</span>
                          </li>
                        ))}
                        {lesson.learningObjectives && lesson.learningObjectives.length > 3 && (
                          <li className="text-gray-400 text-xs">
                            +{lesson.learningObjectives.length - 3} mục tiêu khác...
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Start Button */}
                    <button
                      onClick={() => handleStartLesson(lesson.id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Bắt đầu học</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : !isLoading && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bài học nào</h3>
              <p className="text-gray-600">Hãy thử thay đổi bộ lọc để tìm bài học phù hợp</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 