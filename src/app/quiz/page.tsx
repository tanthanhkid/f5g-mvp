'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Quiz } from '@/types';
import { 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Trophy,
  AlertCircle 
} from 'lucide-react';
import LoadingOverlay from '@/components/LoadingOverlay';

interface QuizResponse {
  success: boolean;
  questions: Quiz[];
  message?: string;
}

interface SubmitResponse {
  success: boolean;
  score: number;
  tute_points_earned: number;
  total_questions: number;
  correct_answers: number;
  message?: string;
}

export default function QuizPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Quiz[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizResults, setQuizResults] = useState<SubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchQuizQuestions();
  }, [user, router]);

  useEffect(() => {
    // Timer countdown
    if (timeLeft > 0 && !isQuizCompleted && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isQuizCompleted) {
      // Hết thời gian
      handleSubmitQuiz();
    }
  }, [timeLeft, isQuizCompleted, questions.length]);

  const fetchQuizQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quiz/random?limit=5');
      const data: QuizResponse = await response.json();

      if (data.success && data.questions) {
        setQuestions(data.questions);
        setSelectedAnswers(new Array(data.questions.length).fill(-1));
      } else {
        setError(data.message || 'Không thể tải câu hỏi');
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      setError('Có lỗi xảy ra khi tải câu hỏi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsLoading(true);

    try {
      // Format answers cho API
      const answersData = questions.map((question, index) => ({
        question_id: question.id,
        selected_answer: selectedAnswers[index]
      }));

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user!.id,
          answers: answersData
        }),
      });

      const data: SubmitResponse = await response.json();

      if (data.success) {
        setQuizResults(data);
        setIsQuizCompleted(true);
      } else {
        setError(data.message || 'Có lỗi khi nộp bài');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Có lỗi xảy ra khi nộp bài');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 30) return 'text-red-600';
    if (timeLeft <= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const handleStartNewQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTimeLeft(300);
    setIsQuizCompleted(false);
    setQuizResults(null);
    setError(null);
    fetchQuizQuestions();
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
              onClick={fetchQuizQuestions}
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
      <LoadingOverlay isVisible={isLoading} message="Đang xử lý..." />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button 
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại</span>
              </button>
              
              <h1 className="text-xl font-bold text-gray-900">
                {isQuizCompleted ? 'Kết quả Quiz' : 'Quiz Thường Thức Cuộc Sống'}
              </h1>
              
              {!isQuizCompleted && questions.length > 0 && (
                <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
                  <Clock className="w-5 h-5" />
                  <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isQuizCompleted && questions.length > 0 ? (
            // Quiz Interface
            <>
              {/* Progress Bar */}
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                  </span>
                  <span className="text-sm text-gray-600">
                    {selectedAnswers.filter(a => a !== -1).length} / {questions.length} đã trả lời
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="bg-white rounded-lg p-8 mb-6 shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {questions[currentQuestionIndex]?.question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {questions[currentQuestionIndex]?.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Câu trước
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedAnswers[currentQuestionIndex] === -1 
                      ? 'Chọn một đáp án để tiếp tục' 
                      : 'Đã chọn đáp án'}
                  </p>
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestionIndex] === -1}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <span>
                    {currentQuestionIndex === questions.length - 1 ? 'Nộp bài' : 'Câu tiếp theo'}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : isQuizCompleted && quizResults ? (
            // Results Interface
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Hoàn Thành!</h2>
                <p className="text-gray-600 mb-8">Bạn đã hoàn thành xuất sắc bài quiz</p>

                {/* Results Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{quizResults.correct_answers}</p>
                    <p className="text-sm text-gray-600">Câu đúng / {quizResults.total_questions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">+{quizResults.tute_points_earned}</p>
                    <p className="text-sm text-gray-600">Điểm TUTE</p>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{Math.round(quizResults.score)}%</p>
                      <p className="text-sm text-gray-600">Điểm số</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{quizResults.correct_answers}</p>
                      <p className="text-sm text-gray-600">Câu đúng</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-600">{quizResults.total_questions - quizResults.correct_answers}</p>
                      <p className="text-sm text-gray-600">Câu sai</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button
                    onClick={handleStartNewQuiz}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Làm quiz mới
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Quay về Dashboard
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Loading State
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải câu hỏi...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 