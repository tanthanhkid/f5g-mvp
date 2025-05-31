'use client';

import { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ContentBlock, Quiz, EnhancedQuizSession } from '@/types';
import { ChevronLeft, ChevronRight, BookOpen, Play, HelpCircle, CheckCircle, Clock, Target, GraduationCap, X, Award } from 'lucide-react';
import TextBlock from '@/components/ContentBlocks/TextBlock';
import VideoBlock from '@/components/ContentBlocks/VideoBlock';
import QuizBlock from '@/components/ContentBlocks/QuizBlock';
import NativeAd from '@/components/NativeAd';

interface QuizTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  estimatedTime: number;
  learningContent: ContentBlock[];
  quizQuestions: Quiz[];
}

export default function EnhancedQuizPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;
  
  const [topic, setTopic] = useState<QuizTopic | null>(null);
  const [session, setSession] = useState<EnhancedQuizSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Fetch topic from API
  const fetchTopic = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(`/api/quiz-topics/${topicId}`);
      const data = await response.json();

      if (data.success) {
        const foundTopic = data.topic;
        setTopic(foundTopic);
        
        // Initialize session
        const newSession: EnhancedQuizSession = {
          id: `session_${Date.now()}`,
          userId: user?.id || '',
          topic: foundTopic.title,
          learningContent: foundTopic.learningContent,
          questions: foundTopic.quizQuestions,
          learningProgress: {
            completedBlocks: [],
            videoWatchTime: {}
          },
          answers: [],
          score: 0,
          tutePointsEarned: 0,
          startedAt: new Date(),
          phase: 'learning',
          currentBlockIndex: 0,
          currentQuestionIndex: 0
        };
        
        setSession(newSession);
      } else {
        setError(data.error || 'Không thể tải topic');
        // Redirect after a delay
        setTimeout(() => {
          router.push('/quiz-topics');
        }, 2000);
      }
    } catch (error) {
      console.error('Error fetching topic:', error);
      setError('Lỗi kết nối, vui lòng thử lại');
      setTimeout(() => {
        router.push('/quiz-topics');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug: Log session changes
  useEffect(() => {
    console.log('Session state changed:', session);
  }, [session]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (topicId) {
      fetchTopic();
    }
  }, [user, router, topicId]);

  const handleBlockComplete = (blockId: string, data?: { answer: number[] | string; isCorrect: boolean }) => {
    try {
      console.log('handleBlockComplete called', { blockId, session, data, isProcessing });
      if (!session || isProcessing) return;

      setIsProcessing(true);

      const updatedSession = { ...session };
      
      // Mark block as completed
      if (!updatedSession.learningProgress.completedBlocks.includes(blockId)) {
        updatedSession.learningProgress.completedBlocks.push(blockId);
      }

      console.log('Before navigation logic', {
        currentBlockIndex: updatedSession.currentBlockIndex,
        totalBlocks: updatedSession.learningContent.length,
        completedBlocks: updatedSession.learningProgress.completedBlocks
      });

      // Move to next block or switch to quiz phase
      if (updatedSession.currentBlockIndex < updatedSession.learningContent.length - 1) {
        updatedSession.currentBlockIndex += 1;
        console.log('Moving to next block:', updatedSession.currentBlockIndex);
      } else {
        // All learning content completed, switch to quiz phase
        updatedSession.phase = 'quiz';
        updatedSession.currentQuestionIndex = 0;
        updatedSession.answers = new Array(updatedSession.questions.length).fill([]);
        console.log('Switching to quiz phase');
      }

      console.log('Setting updated session:', updatedSession);
      flushSync(() => {
        setSession(updatedSession);
      });
      
      // Reset processing flag after a short delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    } catch (error) {
      console.error('Error in handleBlockComplete:', error);
      setIsProcessing(false);
    }
  };

  const handleQuizAnswer = (answer: number[] | string, isCorrect: boolean) => {
    if (!session) return;

    const updatedSession = { ...session };
    updatedSession.answers[updatedSession.currentQuestionIndex] = Array.isArray(answer) ? answer : [answer as any];
    
    // Just save the answer, don't auto advance
    setSession(updatedSession);
  };

  const handleNextQuestion = () => {
    if (!session) return;

    const updatedSession = { ...session };
    
    // Move to next question or complete quiz
    if (updatedSession.currentQuestionIndex < updatedSession.questions.length - 1) {
      updatedSession.currentQuestionIndex += 1;
      setSession(updatedSession);
    } else {
      // Quiz completed
      completeQuiz(updatedSession);
    }
  };

  const completeQuiz = (completedSession: EnhancedQuizSession) => {
    // Calculate score
    let correctAnswers = 0;
    completedSession.questions.forEach((question, index) => {
      const userAnswer = completedSession.answers[index];
      if (question.type === 'text') {
        if (typeof userAnswer === 'string' && 
            typeof question.correctAnswer === 'string' &&
            userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
          correctAnswers++;
        }
      } else {
        if (Array.isArray(question.correctAnswer) &&
            Array.isArray(userAnswer) &&
            userAnswer.length === question.correctAnswer.length &&
            userAnswer.every((ans: any) => (question.correctAnswer as number[]).includes(ans as number))) {
          correctAnswers++;
        }
      }
    });

    const score = correctAnswers;
    let tutePoints = 0;

    // Base points for learning completion
    tutePoints += 30;

    // Points for quiz performance
    tutePoints += correctAnswers * 10;

    // Points for video completion
    const videoBlocks = completedSession.learningContent.filter(block => block.type === 'video');
    videoBlocks.forEach(block => {
      if (block.type === 'video') {
        const watchTime = completedSession.learningProgress.videoWatchTime[block.id] || 0;
        const duration = block.duration || 0;
        if (duration > 0 && watchTime > 0) {
          tutePoints += 5;
        }
      }
    });

    const finalSession = {
      ...completedSession,
      score,
      tutePointsEarned: tutePoints,
      completedAt: new Date(),
      phase: 'completed' as const
    };

    setSession(finalSession);
  };

  const handleExit = () => {
    router.push('/quiz-topics');
  };

  const goToBlock = (index: number) => {
    if (!session || session.phase !== 'learning') return;
    
    const updatedSession = { ...session };
    updatedSession.currentBlockIndex = index;
    setSession(updatedSession);
  };

  const goToQuestion = (index: number) => {
    if (!session || session.phase !== 'quiz') return;
    
    const updatedSession = { ...session };
    updatedSession.currentQuestionIndex = index;
    setSession(updatedSession);
  };

  if (isLoading || !topic || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Completed state
  if (session.phase === 'completed') {
    const correctAnswers = session.score;
    const percentage = Math.round((correctAnswers / session.questions.length) * 100);
    const passed = percentage >= 60; // 60% để pass

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Results với Progress Circle */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center mb-8 border border-gray-100">
            {/* Progress Circle với viền rõ ràng */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              {/* Background circle với viền */}
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                {/* Outer border ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="76"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  fill="none"
                  className="opacity-50"
                />
                
                {/* Background track */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                  fill="none"
                />
                
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  stroke={passed ? "#10b981" : percentage >= 40 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(percentage / 100) * 427.26} 427.26`}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                  }}
                />
                
                {/* Inner border ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  fill="none"
                  className="opacity-30"
                />
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-1 ${
                    passed ? 'text-green-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {percentage}%
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {correctAnswers}/{session.questions.length}
                  </div>
                  <div className={`w-6 h-6 mx-auto mt-2 rounded-full flex items-center justify-center ${
                    passed ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {passed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Target className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {passed ? 'Chúc mừng! Bạn đã hoàn thành!' : 'Hoàn thành bài học'}
            </h2>
            <p className="text-gray-600 mb-8">Kết quả cho &quot;{topic.title}&quot;</p>
            
            {/* 3 Cards thống kê compact và đẹp */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
              {/* Card 1: Điểm TUTE */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white border border-purple-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">+{session.tutePointsEarned}</div>
                  <div className="text-sm font-medium text-gray-600">Điểm TUTE</div>
                  <div className="text-xs text-purple-500 mt-1">Đã nhận được</div>
                </div>
              </div>

              {/* Card 2: Tỷ lệ chính xác */}
              <div className="group relative">
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                  passed ? 'from-green-600 to-emerald-600' : 'from-yellow-600 to-orange-600'
                } rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300`}></div>
                <div className={`relative bg-white border ${
                  passed ? 'border-green-100' : 'border-yellow-100'
                } rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${
                    passed ? 'from-green-500 to-green-600' : 'from-yellow-500 to-yellow-600'
                  } rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    {passed ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <Target className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className={`text-2xl font-bold mb-1 ${
                    passed ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {percentage}%
                  </div>
                  <div className="text-sm font-medium text-gray-600">Tỷ lệ đúng</div>
                  <div className={`text-xs mt-1 font-medium ${
                    passed ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {passed ? 'Đạt yêu cầu' : 'Chưa đạt'}
                  </div>
                </div>
              </div>

              {/* Card 3: Thời gian hoàn thành */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white border border-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{topic.estimatedTime}</div>
                  <div className="text-sm font-medium text-gray-600">Phút</div>
                  <div className="text-xs text-blue-500 mt-1">Thời gian học</div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleExit}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Quay về danh sách
              </button>
              {!passed && (
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Làm lại
                </button>
              )}
            </div>
          </div>

          {/* Review Questions */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Xem lại câu trả lời</h3>
              <p className="text-gray-600">Kiểm tra lại các câu hỏi và học từ giải thích</p>
            </div>
            
            <div className="p-6 space-y-6">
              {session.questions.map((question, index) => {
                const userAnswer = session.answers[index] || [];
                let isCorrect = false;
                
                if (question.type === 'text') {
                  isCorrect = typeof userAnswer === 'string' && 
                            typeof question.correctAnswer === 'string' &&
                            userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
                } else {
                  if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer)) {
                    isCorrect = userAnswer.length === question.correctAnswer.length &&
                              userAnswer.every((ans: any) => (question.correctAnswer as number[]).includes(ans as number));
                  }
                }

                return (
                  <div key={question.id} className={`border rounded-lg p-4 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                        isCorrect ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-black mb-2">{question.question}</h4>
                        
                        {/* Options - chỉ hiển thị nếu có options */}
                        {question.options && (
                          <div className="space-y-2 mb-3">
                            {question.options.map((option, optionIndex) => {
                              const isUserSelected = Array.isArray(userAnswer) && userAnswer.includes(optionIndex);
                              const isCorrectOption = Array.isArray(question.correctAnswer) && 
                                                    question.correctAnswer.includes(optionIndex);
                              
                              return (
                                <div key={optionIndex} className={`flex items-center space-x-2 p-2 rounded ${
                                  isCorrectOption 
                                    ? 'bg-green-100 border border-green-300' 
                                    : isUserSelected 
                                    ? 'bg-red-100 border border-red-300'
                                    : 'bg-gray-50 border border-gray-200'
                                }`}>
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                    isCorrectOption 
                                      ? 'bg-green-600 border-green-600' 
                                      : isUserSelected 
                                      ? 'bg-red-600 border-red-600'
                                      : 'border-gray-300'
                                  }`}>
                                    {(isCorrectOption || isUserSelected) && (
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                  <span className={`text-sm ${
                                    isCorrectOption ? 'text-green-800 font-medium' : 'text-gray-700'
                                  }`}>
                                    {option}
                                  </span>
                                  {isCorrectOption && <span className="text-green-600 text-xs">(Đúng)</span>}
                                  {isUserSelected && !isCorrectOption && <span className="text-red-600 text-xs">(Bạn chọn)</span>}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Text answer display */}
                        {question.type === 'text' && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600">Câu trả lời của bạn:</p>
                            <p className="font-medium">{userAnswer as string}</p>
                            <p className="text-sm text-gray-600 mt-1">Đáp án đúng: {question.correctAnswer as string}</p>
                          </div>
                        )}

                        {/* Result Badge */}
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          isCorrect 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Chính xác</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3" />
                              <span>Sai</span>
                            </>
                          )}
                          <span>• +{isCorrect ? (question.points || 10) : 0} điểm</span>
                        </div>

                        {/* Explanation */}
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">💡 Giải thích: </span>
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê chi tiết</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                <p className="text-sm text-gray-600">Câu đúng</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{session.questions.length - correctAnswers}</p>
                <p className="text-sm text-gray-600">Câu sai</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{session.tutePointsEarned}</p>
                <p className="text-sm text-gray-600">Điểm TUTE</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{topic.estimatedTime}min</p>
                <p className="text-sm text-gray-600">Thời gian học</p>
              </div>
            </div>
          </div>

          {/* Post-Quiz Ad - hiển thị sau khi hoàn thành */}
          <NativeAd 
            placement="post_quiz"
            className="max-w-2xl mx-auto"
          />
        </div>
      </div>
    );
  }

  const currentContent = session.phase === 'learning' 
    ? session.learningContent[session.currentBlockIndex]
    : null;
  
  const currentQuestion = session.phase === 'quiz' 
    ? session.questions[session.currentQuestionIndex]
    : null;

  const learningProgress = (session.learningProgress.completedBlocks.length / session.learningContent.length) * 100;
  const quizProgress = session.phase === 'quiz' 
    ? ((session.currentQuestionIndex + 1) / session.questions.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={handleExit}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
            
            <div className="flex-1 mx-8">
              <h1 className="text-lg font-semibold text-gray-900 truncate">{topic.title}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${session.phase === 'learning' ? learningProgress : 
                               session.phase === 'quiz' ? 50 + (quizProgress * 0.5) : 100}%` 
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {session.phase === 'learning' ? 'Đang học' : 
                   session.phase === 'quiz' ? 'Đang quiz' : 'Hoàn thành'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{topic.estimatedTime} phút</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>
                  {session.phase === 'learning' 
                    ? `${session.currentBlockIndex + 1}/${session.learningContent.length}`
                    : `${session.currentQuestionIndex + 1}/${session.questions.length}`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h3 className="font-semibold text-black mb-4">
                {session.phase === 'learning' ? 'Nội dung học' : 'Câu hỏi'}
              </h3>
              
              {session.phase === 'learning' && (
                <div className="space-y-2">
                  {session.learningContent.map((block, index) => (
                    <button
                      key={block.id}
                      onClick={() => goToBlock(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === session.currentBlockIndex
                          ? 'bg-blue-50 border border-blue-200'
                          : session.learningProgress.completedBlocks.includes(block.id)
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {block.type === 'text' && <BookOpen className="w-4 h-4 text-black" />}
                        {block.type === 'video' && <Play className="w-4 h-4 text-black" />}
                        <span className="text-sm font-medium truncate text-black">
                          {block.type === 'text' && block.title ? block.title :
                           block.type === 'video' ? block.title :
                           `Block ${index + 1}`}
                        </span>
                        {session.learningProgress.completedBlocks.includes(block.id) && (
                          <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {session.phase === 'quiz' && (
                <div className="space-y-2">
                  {session.questions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => goToQuestion(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === session.currentQuestionIndex
                          ? 'bg-blue-50 border border-blue-200'
                          : session.answers[index] && session.answers[index].length > 0
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <HelpCircle className="w-4 h-4 text-black" />
                        <span className="text-sm font-medium text-black">Câu {index + 1}</span>
                        {session.answers[index] && session.answers[index].length > 0 && (
                          <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Learning Phase */}
              {session.phase === 'learning' && currentContent && (
                <>
                  {currentContent.type === 'text' && (
                    <TextBlock
                      key={currentContent.id}
                      block={currentContent}
                      onComplete={() => handleBlockComplete(currentContent.id)}
                      isActive={true}
                    />
                  )}

                  {currentContent.type === 'video' && (
                    <VideoBlock
                      key={currentContent.id}
                      block={currentContent}
                      onComplete={() => handleBlockComplete(currentContent.id)}
                      isActive={true}
                    />
                  )}

                  {/* Learning Break Ad - hiển thị sau block thứ 2 */}
                  {session.currentBlockIndex === 1 && (
                    <NativeAd 
                      placement="learning_break"
                      className="max-w-2xl mx-auto"
                    />
                  )}
                </>
              )}

              {/* Pre-Quiz Ad - hiển thị khi bắt đầu quiz */}
              {session.phase === 'quiz' && session.currentQuestionIndex === 0 && (
                <NativeAd 
                  placement="pre_quiz"
                  className="max-w-2xl mx-auto"
                />
              )}

              {/* Quiz Phase */}
              {session.phase === 'quiz' && currentQuestion && (
                <>
                  <QuizBlock
                    block={{
                      type: 'quiz',
                      id: currentQuestion.id,
                      quiz: currentQuestion
                    }}
                    onComplete={(answer, isCorrect) => 
                      handleQuizAnswer(answer, isCorrect)
                    }
                    onNext={handleNextQuestion}
                    isActive={true}
                    isLastQuestion={session.currentQuestionIndex === session.questions.length - 1}
                  />

                  {/* Between Quiz Ad - hiển thị giữa câu 2 và 3 */}
                  {session.currentQuestionIndex === 1 && (
                    <NativeAd 
                      placement="between_quiz"
                      className="max-w-xl mx-auto"
                    />
                  )}
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={() => {
                    if (session.phase === 'learning') {
                      goToBlock(session.currentBlockIndex - 1);
                    } else {
                      goToQuestion(session.currentQuestionIndex - 1);
                    }
                  }}
                  disabled={
                    (session.phase === 'learning' && session.currentBlockIndex === 0) ||
                    (session.phase === 'quiz' && session.currentQuestionIndex === 0)
                  }
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    (session.phase === 'learning' && session.currentBlockIndex === 0) ||
                    (session.phase === 'quiz' && session.currentQuestionIndex === 0)
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trước</span>
                </button>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>
                    {session.phase === 'learning' ? 'Giai đoạn học tập' : 'Giai đoạn kiểm tra'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (session.phase === 'learning') {
                      goToBlock(session.currentBlockIndex + 1);
                    } else {
                      goToQuestion(session.currentQuestionIndex + 1);
                    }
                  }}
                  disabled={
                    (session.phase === 'learning' && session.currentBlockIndex === session.learningContent.length - 1) ||
                    (session.phase === 'quiz' && session.currentQuestionIndex === session.questions.length - 1)
                  }
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    (session.phase === 'learning' && session.currentBlockIndex === session.learningContent.length - 1) ||
                    (session.phase === 'quiz' && session.currentQuestionIndex === session.questions.length - 1)
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