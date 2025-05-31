'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson, LearningSession } from '@/types';
import LessonViewer from '@/components/LessonViewer';
import LoadingOverlay from '@/components/LoadingOverlay';
import { AlertCircle } from 'lucide-react';

interface LessonResponse {
  success: boolean;
  lesson: Lesson;
  error?: string;
}

export default function LessonDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchLesson();
  }, [user, router, lessonId]);

  const fetchLesson = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/lessons/${lessonId}`);
      const data: LessonResponse = await response.json();

      if (data.success) {
        setLesson(data.lesson);
      } else {
        setError(data.error || 'Không thể tải bài học');
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      setError('Có lỗi xảy ra khi tải bài học');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonComplete = async (session: LearningSession) => {
    try {
      // Save lesson progress to database
      const response = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          currentBlockIndex: session.progress.currentBlockIndex,
          completedBlocks: session.progress.completedBlocks,
          quizAnswers: session.progress.quizAnswers,
          videoWatchTime: session.progress.videoWatchTime,
          isCompleted: true
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`${result.message} Điểm TUTE bạn nhận được: ${session.tutePointsEarned}`);
      } else {
        console.error('Error saving progress:', result.error);
        alert('Có lỗi khi lưu tiến độ, nhưng bạn vẫn đã hoàn thành bài học!');
      }
    } catch (error) {
      console.error('Error saving lesson progress:', error);
      alert('Có lỗi khi lưu tiến độ, nhưng bạn vẫn đã hoàn thành bài học!');
    }
    
    router.push('/lessons');
  };

  const handleExit = () => {
    router.push('/lessons');
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
              onClick={fetchLesson}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
            <button
              onClick={() => router.push('/lessons')}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Quay về danh sách bài học
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingOverlay isVisible={true} message="Đang tải bài học..." />
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài học</h2>
          <p className="text-gray-600 mb-4">Bài học bạn đang tìm kiếm không tồn tại.</p>
          <button
            onClick={() => router.push('/lessons')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay về danh sách bài học
          </button>
        </div>
      </div>
    );
  }

  return (
    <LessonViewer
      lesson={lesson}
      onComplete={handleLessonComplete}
      onExit={handleExit}
    />
  );
} 