'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lesson, LearningSession } from '@/types';
import LessonViewer from '@/components/LessonViewer';
import lessonsData from '../../../../data/lessons.json';

export default function LessonDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Find lesson by ID
    const foundLesson = (lessonsData as Lesson[]).find(l => l.id === lessonId);
    if (foundLesson) {
      setLesson(foundLesson);
    } else {
      // Lesson not found, redirect to lessons page
      router.push('/lessons');
    }
    setIsLoading(false);
  }, [user, router, lessonId]);

  const handleLessonComplete = (session: LearningSession) => {
    // Here you would typically save the session to your backend
    console.log('Lesson completed:', session);
    
    // For now, just show an alert and redirect
    alert(`Chúc mừng! Bạn đã hoàn thành bài học và nhận được ${session.tutePointsEarned} điểm TUTE!`);
    router.push('/lessons');
  };

  const handleExit = () => {
    router.push('/lessons');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài học...</p>
        </div>
      </div>
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