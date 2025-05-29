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

// Content block types for lessons
export interface TextBlock {
  type: 'text';
  id: string;
  content: string;
  title?: string;
}

export interface VideoBlock {
  type: 'video';
  id: string;
  youtubeId: string;
  title: string;
  description?: string;
  duration?: number; // in seconds
}

export interface QuizBlock {
  type: 'quiz';
  id: string;
  quiz: Quiz;
}

export type ContentBlock = TextBlock | VideoBlock | QuizBlock;

// Enhanced lesson structure
export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  contentBlocks: ContentBlock[];
  prerequisites?: string[]; // lesson IDs
  learningObjectives: string[];
  tags: string[];
}

// Enhanced quiz with more context
export interface Quiz {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[]; // Optional for text type
  correctAnswer: number[] | string; // Support both multiple choice and text answers
  category: string;
  explanation?: string; // Explanation after answering
  difficulty?: 'easy' | 'medium' | 'hard';
  points?: number; // Custom points for this question
}

// Learning session that combines lessons and quizzes
export interface LearningSession {
  id: string;
  userId: string;
  lessonId: string;
  startedAt: Date;
  completedAt?: Date;
  progress: {
    currentBlockIndex: number;
    completedBlocks: string[];
    quizAnswers: { [quizId: string]: number[] | string };
    videoWatchTime: { [videoId: string]: number };
  };
  score?: number;
  tutePointsEarned: number;
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
  learningSettings: {
    tutePointsPerLessonCompletion: number;
    tutePointsPerVideoWatched: number;
    minimumVideoWatchPercentage: number; // 0-100
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

// Enhanced quiz session with learning content
export interface EnhancedQuizSession {
  id: string;
  userId: string;
  topic: string;
  learningContent: ContentBlock[]; // Learning content before quiz
  questions: Quiz[];
  learningProgress: {
    completedBlocks: string[];
    videoWatchTime: { [videoId: string]: number };
  };
  answers: (number[] | string)[];
  score: number;
  tutePointsEarned: number;
  startedAt: Date;
  completedAt?: Date;
  phase: 'learning' | 'quiz' | 'completed';
  currentBlockIndex: number;
  currentQuestionIndex: number;
} 