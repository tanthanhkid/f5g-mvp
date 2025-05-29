'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Quiz } from '@/types';
import { getRandomQuestions, calculateScore } from '@/lib/utils';
import { Clock, CheckCircle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import quizzesData from '../../../data/quizzes.json';
import settingsData from '../../../data/settings.json';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function QuizPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [questions, setQuestions] = useState<Quiz[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [timeLeft, setTimeLeft] = useState(settingsData.quizSettings.timePerQuestion);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [tutePointsEarned, setTutePointsEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Khởi tạo quiz với câu hỏi ngẫu nhiên
    const randomQuestions = getRandomQuestions(quizzesData as Quiz[], settingsData.quizSettings.questionsPerQuiz);
    setQuestions(randomQuestions);
    setAnswers(new Array(randomQuestions.length).fill([]));
  }, [user, router]);

  // Timer effect
  useEffect(() => {
    if (isCompleted || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Hết thời gian, chuyển câu tiếp theo
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            return settingsData.quizSettings.timePerQuestion;
          } else {
            // Hoàn thành quiz
            const finalScore = calculateScore(questions, answers);
            const points = finalScore * settingsData.quizSettings.tutePointsPerCorrectAnswer;
            setScore(finalScore);
            setTutePointsEarned(points);
            setIsCompleted(true);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isCompleted, questions.length, answers]);

  const handleAnswerSelect = (optionIndex: number) => {
    const currentQuestionData = questions[currentQuestion];
    const newAnswers = [...answers];
    
    if (currentQuestionData.type === 'single') {
      // Single choice - chỉ chọn một đáp án
      newAnswers[currentQuestion] = [optionIndex];
    } else {
      // Multiple choice - có thể chọn nhiều đáp án
      const currentAnswer = newAnswers[currentQuestion] || [];
      if (currentAnswer.includes(optionIndex)) {
        // Bỏ chọn nếu đã chọn
        newAnswers[currentQuestion] = currentAnswer.filter(i => i !== optionIndex);
      } else {
        // Thêm vào danh sách chọn
        newAnswers[currentQuestion] = [...currentAnswer, optionIndex];
      }
    }
    
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(settingsData.quizSettings.timePerQuestion);
    } else {
      // Hoàn thành quiz
      completeQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeLeft(settingsData.quizSettings.timePerQuestion);
    }
  };

  const completeQuiz = () => {
    const finalScore = calculateScore(questions, answers);
    const points = finalScore * settingsData.quizSettings.tutePointsPerCorrectAnswer;
    
    setScore(finalScore);
    setTutePointsEarned(points);
    setIsCompleted(true);
  };

  const handleBackToDashboard = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/dashboard');
  };

  if (!user || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải quiz...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoàn thành!</h2>
          <p className="text-gray-600 mb-6">Bạn đã hoàn thành quiz thành công</p>
          
          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Điểm số</p>
              <p className="text-2xl font-bold text-blue-900">{score}/{questions.length}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Điểm TUTE nhận được</p>
              <p className="text-2xl font-bold text-green-900">+{tutePointsEarned}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Tỷ lệ chính xác</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
          </div>
          
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Quay về Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = answers[currentQuestion] || [];

  return (
    <>
      <LoadingOverlay isVisible={isLoading} message="Đang tải..." />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
            
            {/* Logo ở giữa */}
            <button 
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/17164524823262_logo-web-con-voi.png" 
                  alt="Freedom Training Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold text-gray-900">Freedom Training</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{timeLeft}s</span>
              </div>
              <div className="text-sm text-gray-600">
                {currentQuestion + 1}/{questions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tiến độ</span>
            <span>{currentQuestion + 1}/{questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {currentQuestionData.category}
              </span>
              <span className="text-sm text-gray-500">
                {currentQuestionData.type === 'single' ? 'Chọn một đáp án' : 'Chọn nhiều đáp án'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
              {currentQuestionData.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => {
              const isSelected = currentAnswer.includes(index);
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {currentQuestionData.type === 'single' ? (
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    )}
                    <span className={`text-lg font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Câu trước</span>
          </button>

          <button
            onClick={handleNextQuestion}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
} 