import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Quiz } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getRandomQuestions(questions: Quiz[], count: number): Quiz[] {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, count);
}

export function calculateScore(questions: Quiz[], answers: number[][]): number {
  let correct = 0;
  
  questions.forEach((question, index) => {
    const userAnswer = answers[index] || [];
    const correctAnswer = question.correctAnswer;
    
    // Kiểm tra xem câu trả lời có đúng không
    if (Array.isArray(correctAnswer)) {
      if (userAnswer.length === correctAnswer.length) {
        const isCorrect = correctAnswer.every(answer => userAnswer.includes(answer));
        if (isCorrect) {
          correct++;
        }
      }
    } else {
      // For text type questions, convert to string comparison
      const userAnswerStr = userAnswer.join(',');
      if (userAnswerStr === correctAnswer) {
        correct++;
      }
    }
  });
  
  return correct;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
} 