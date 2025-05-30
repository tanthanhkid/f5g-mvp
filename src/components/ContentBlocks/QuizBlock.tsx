'use client';

import { useState, useEffect } from 'react';
import { QuizBlock as QuizBlockType } from '@/types';
import { HelpCircle, CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';

interface QuizBlockProps {
  block: QuizBlockType;
  onComplete?: (answer: number[] | string, isCorrect: boolean) => void;
  onNext?: () => void;
  isActive?: boolean;
  isLastQuestion?: boolean;
}

export default function QuizBlock({ block, onComplete, onNext, isActive = false, isLastQuestion = false }: QuizBlockProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const quiz = block.quiz;

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswers([]);
    setTextAnswer('');
    setIsAnswered(false);
    setShowExplanation(false);
    setIsCorrect(false);
  }, [quiz.id]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (isAnswered) return;

    if (quiz.type === 'single') {
      setSelectedAnswers([optionIndex]);
    } else if (quiz.type === 'multiple') {
      if (selectedAnswers.includes(optionIndex)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== optionIndex));
      } else {
        setSelectedAnswers([...selectedAnswers, optionIndex]);
      }
    }
  };

  const handleSubmit = () => {
    if (isAnswered) return;

    let answer: number[] | string;
    let correct = false;

    if (quiz.type === 'text') {
      answer = textAnswer.trim();
      correct = typeof quiz.correctAnswer === 'string' && 
                textAnswer.trim().toLowerCase() === quiz.correctAnswer.toLowerCase();
    } else {
      answer = selectedAnswers;
      if (Array.isArray(quiz.correctAnswer)) {
        correct = selectedAnswers.length === quiz.correctAnswer.length &&
                 selectedAnswers.every(ans => (quiz.correctAnswer as number[]).includes(ans));
      }
    }

    setIsCorrect(correct);
    setIsAnswered(true);
    setShowExplanation(true);
    
    onComplete?.(answer, correct);
  };

  const canSubmit = () => {
    if (quiz.type === 'text') {
      return textAnswer.trim().length > 0;
    }
    return selectedAnswers.length > 0;
  };

  const getOptionClass = (index: number) => {
    if (!isAnswered) {
      return selectedAnswers.includes(index)
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-gray-300';
    }

    // After answering
    const isSelected = selectedAnswers.includes(index);
    const isCorrectAnswer = Array.isArray(quiz.correctAnswer) && 
                           (quiz.correctAnswer as number[]).includes(index);

    if (isCorrectAnswer) {
      return 'border-green-500 bg-green-50';
    } else if (isSelected && !isCorrectAnswer) {
      return 'border-red-500 bg-red-50';
    } else {
      return 'border-gray-200 bg-gray-50';
    }
  };

  const getOptionIcon = (index: number) => {
    if (!isAnswered) return null;

    const isSelected = selectedAnswers.includes(index);
    const isCorrectAnswer = Array.isArray(quiz.correctAnswer) && 
                           (quiz.correctAnswer as number[]).includes(index);

    if (isCorrectAnswer) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (isSelected && !isCorrectAnswer) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all duration-300 ${
      isActive ? 'ring-2 ring-blue-500 shadow-md' : ''
    }`}>
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Câu hỏi</h3>
          {quiz.difficulty && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {quiz.difficulty === 'easy' ? 'Dễ' : 
               quiz.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Question */}
        <div className="mb-6">
          <p className="text-lg text-black font-medium">{quiz.question}</p>
          {quiz.type === 'multiple' && (
            <p className="text-sm text-gray-500 mt-2">Có thể chọn nhiều đáp án</p>
          )}
        </div>

        {/* Answer Options */}
        {quiz.type !== 'text' && quiz.options && (
          <div className="space-y-3 mb-6">
            {quiz.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  getOptionClass(index)
                } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">{option}</span>
                  {getOptionIcon(index)}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Text Input for Text Type Questions */}
        {quiz.type === 'text' && (
          <div className="mb-6">
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={isAnswered}
              placeholder="Nhập câu trả lời của bạn..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-gray-900 placeholder-gray-500"
              rows={4}
            />
          </div>
        )}

        {/* Submit Button */}
        {!isAnswered && (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              canSubmit()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Gửi câu trả lời
          </button>
        )}

        {/* Result and Explanation */}
        {isAnswered && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Chính xác!' : 'Chưa chính xác'}
                </span>
              </div>
            </div>

            {quiz.explanation && showExplanation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Giải thích</h4>
                    <p className="text-blue-800 text-sm">{quiz.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button */}
            {onNext && (
              <button
                onClick={onNext}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>{isLastQuestion ? 'Hoàn thành bài kiểm tra' : 'Tiếp tục câu tiếp theo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 