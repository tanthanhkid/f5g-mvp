'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lesson, ContentBlock, LearningSession } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight, BookOpen, Play, HelpCircle, CheckCircle, Clock, Target } from 'lucide-react';
import TextBlock from './ContentBlocks/TextBlock';
import VideoBlock from './ContentBlocks/VideoBlock';
import QuizBlock from './ContentBlocks/QuizBlock';

interface LessonViewerProps {
  lesson: Lesson;
  onComplete?: (session: LearningSession) => void;
  onExit?: () => void;
}

export default function LessonViewer({ lesson, onComplete, onExit }: LessonViewerProps) {
  const { user } = useAuth();
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [completedBlocks, setCompletedBlocks] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [quizId: string]: number[] | string }>({});
  const [videoWatchTime, setVideoWatchTime] = useState<{ [videoId: string]: number }>({});
  const [startTime] = useState(new Date());
  const [isCompleted, setIsCompleted] = useState(false);

  const currentBlock = lesson.contentBlocks[currentBlockIndex];
  const progress = (completedBlocks.length / lesson.contentBlocks.length) * 100;

  // Calculate TUTE points - memoized to prevent recalculation
  const calculateTutePoints = useCallback(() => {
    // Base points for lesson completion
    let points = 50;

    // Points for quiz performance
    const quizBlocks = lesson.contentBlocks.filter(block => block.type === 'quiz');
    quizBlocks.forEach(block => {
      const answer = quizAnswers[block.id];
      if (block.type === 'quiz') {
        const quiz = block.quiz;
        let isCorrect = false;
        
        if (quiz.type === 'text') {
          isCorrect = typeof answer === 'string' && 
                     typeof quiz.correctAnswer === 'string' &&
                     answer.toLowerCase() === quiz.correctAnswer.toLowerCase();
        } else {
          isCorrect = Array.isArray(answer) && 
                     Array.isArray(quiz.correctAnswer) &&
                     answer.length === quiz.correctAnswer.length &&
                     answer.every(ans => (quiz.correctAnswer as number[]).includes(ans));
        }
        
        if (isCorrect) {
          points += quiz.points || 10;
        }
      }
    });

    // Points for video completion
    const videoBlocks = lesson.contentBlocks.filter(block => block.type === 'video');
    videoBlocks.forEach(block => {
      if (block.type === 'video') {
        const watchTime = videoWatchTime[block.id] || 0;
        const duration = block.duration || 0;
        if (duration > 0 && watchTime > 0) {
          points += 5;
        }
      }
    });

    return points;
  }, [lesson.contentBlocks, quizAnswers, videoWatchTime]);

  // Handle lesson completion - memoized to prevent infinite loops
  const handleLessonComplete = useCallback(() => {
    if (!user || isCompleted) return;

    setIsCompleted(true);

    // Calculate score and points
    const quizBlocks = lesson.contentBlocks.filter(block => block.type === 'quiz');
    const correctAnswers = quizBlocks.filter(block => {
      const answer = quizAnswers[block.id];
      if (block.type === 'quiz') {
        const quiz = block.quiz;
        if (quiz.type === 'text') {
          return typeof answer === 'string' && 
                 typeof quiz.correctAnswer === 'string' &&
                 answer.toLowerCase() === quiz.correctAnswer.toLowerCase();
        } else {
          return Array.isArray(answer) && 
                 Array.isArray(quiz.correctAnswer) &&
                 answer.length === quiz.correctAnswer.length &&
                 answer.every(ans => (quiz.correctAnswer as number[]).includes(ans));
        }
      }
      return false;
    }).length;

    const score = quizBlocks.length > 0 ? (correctAnswers / quizBlocks.length) * 100 : 100;
    const tutePointsEarned = calculateTutePoints();

    const session: LearningSession = {
      id: `session_${Date.now()}`,
      userId: user.id,
      lessonId: lesson.id,
      startedAt: startTime,
      completedAt: new Date(),
      progress: {
        currentBlockIndex: lesson.contentBlocks.length,
        completedBlocks,
        quizAnswers,
        videoWatchTime
      },
      score,
      tutePointsEarned
    };

    onComplete?.(session);
  }, [user, isCompleted, lesson.contentBlocks, lesson.id, quizAnswers, completedBlocks, videoWatchTime, startTime, calculateTutePoints, onComplete]);

  // Check if lesson is completed - FIXED: Use memoized handleLessonComplete
  useEffect(() => {
    if (completedBlocks.length === lesson.contentBlocks.length && !isCompleted) {
      handleLessonComplete();
    }
  }, [completedBlocks.length, lesson.contentBlocks.length, isCompleted, handleLessonComplete]);

  const handleBlockComplete = (blockId: string, data?: { answer: number[] | string; isCorrect: boolean }) => {
    if (!completedBlocks.includes(blockId)) {
      setCompletedBlocks([...completedBlocks, blockId]);
    }

    // Handle specific block type data
    if (currentBlock.type === 'quiz' && data) {
      const { answer } = data;
      setQuizAnswers(prev => ({
        ...prev,
        [blockId]: answer
      }));
    }

    // Auto advance to next block
    if (currentBlockIndex < lesson.contentBlocks.length - 1) {
      setTimeout(() => {
        setCurrentBlockIndex(currentBlockIndex + 1);
      }, 1000);
    }
  };

  const handleVideoProgress = (videoId: string, watchedTime: number) => {
    setVideoWatchTime(prev => ({
      ...prev,
      [videoId]: Math.max(prev[videoId] || 0, watchedTime)
    }));
  };

  const goToBlock = (index: number) => {
    if (index >= 0 && index < lesson.contentBlocks.length) {
      setCurrentBlockIndex(index);
    }
  };

  const getBlockIcon = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return <BookOpen className="w-4 h-4" />;
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getBlockStatus = (blockId: string) => {
    return completedBlocks.includes(blockId) ? 'completed' : 'pending';
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoàn thành bài học!</h2>
          <p className="text-gray-600 mb-6">Bạn đã hoàn thành &quot;{lesson.title}&quot; thành công</p>
          
          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Điểm số</p>
              <p className="text-2xl font-bold text-blue-900">
                {Math.round((completedBlocks.length / lesson.contentBlocks.length) * 100)}%
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Điểm TUTE nhận được</p>
              <p className="text-2xl font-bold text-green-900">+{calculateTutePoints()}</p>
            </div>
          </div>
          
          <button
            onClick={onExit}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Quay về
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={onExit}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
            
            <div className="flex-1 mx-8">
              <h1 className="text-lg font-semibold text-gray-900 truncate">{lesson.title}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.estimatedTime} phút</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{currentBlockIndex + 1}/{lesson.contentBlocks.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Nội dung bài học</h3>
              <div className="space-y-2">
                {lesson.contentBlocks.map((block, index) => (
                  <button
                    key={block.id}
                    onClick={() => goToBlock(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentBlockIndex
                        ? 'bg-blue-50 border border-blue-200'
                        : getBlockStatus(block.id) === 'completed'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {getBlockIcon(block)}
                      <span className="text-sm font-medium truncate">
                        {block.type === 'text' && block.title ? block.title :
                         block.type === 'video' ? block.title :
                         block.type === 'quiz' ? 'Câu hỏi' :
                         `Block ${index + 1}`}
                      </span>
                      {getBlockStatus(block.id) === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Current Block */}
              {currentBlock.type === 'text' && (
                <TextBlock
                  block={currentBlock}
                  onComplete={() => handleBlockComplete(currentBlock.id)}
                  isActive={true}
                />
              )}

              {currentBlock.type === 'video' && (
                <VideoBlock
                  block={currentBlock}
                  onComplete={() => handleBlockComplete(currentBlock.id)}
                  onProgress={(watchedTime) => 
                    handleVideoProgress(currentBlock.id, watchedTime)
                  }
                  isActive={true}
                />
              )}

              {currentBlock.type === 'quiz' && (
                <QuizBlock
                  block={currentBlock}
                  onComplete={(answer, isCorrect) => 
                    handleBlockComplete(currentBlock.id, { answer, isCorrect })
                  }
                  isActive={true}
                />
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={() => goToBlock(currentBlockIndex - 1)}
                  disabled={currentBlockIndex === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentBlockIndex === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trước</span>
                </button>

                <button
                  onClick={() => goToBlock(currentBlockIndex + 1)}
                  disabled={currentBlockIndex === lesson.contentBlocks.length - 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentBlockIndex === lesson.contentBlocks.length - 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>Tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 