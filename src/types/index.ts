export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  schoolId: string;
  tutePoints: number;
}

export interface School {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  totalTutePoints: number;
}

export interface Quiz {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: string[];
  correctAnswer: number[];
  category: string;
}

export interface QuizSession {
  id: string;
  userId: string;
  questions: Quiz[];
  answers: number[][];
  score: number;
  tutePointsEarned: number;
  completedAt: Date;
}

export interface Settings {
  quizSettings: {
    questionsPerQuiz: number;
    timePerQuestion: number;
    tutePointsPerCorrectAnswer: number;
  };
  appSettings: {
    appName: string;
    version: string;
    supportEmail: string;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
} 