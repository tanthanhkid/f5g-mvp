import { neon } from '@neondatabase/serverless';

// Initialize database connection
const sql = neon(process.env.DATABASE_URL!);

// Types định nghĩa theo database schema
export interface School {
  id: string;
  name: string;
  short_name: string;
  logo?: string;
  total_tute_points: number;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  school_id: string;
  tute_points: number;
  avatar?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  school?: School;
}

export interface QuizCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at: Date;
}

export interface Quiz {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options: string[];
  correct_answer: number[];
  category_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  explanation?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  category?: QuizCategory;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_time?: number;
  learning_objectives?: string[];
  tags?: string[];
  content_blocks: any[];
  is_published: boolean;
  view_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserQuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  user_answer: any[];
  is_correct: boolean;
  points_earned: number;
  time_taken?: number;
  attempted_at: Date;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  progress_percentage: number;
  completed_blocks: string[];
  is_completed: boolean;
  completion_time?: number;
  started_at: Date;
  completed_at?: Date;
  updated_at: Date;
}

// Database functions

export class DatabaseService {
  // Schools
  static async getAllSchools(): Promise<School[]> {
    const result = await sql`
      SELECT * FROM schools 
      ORDER BY total_tute_points DESC, name ASC
    `;
    return result as School[];
  }

  static async getSchoolById(id: string): Promise<School | null> {
    const result = await sql`
      SELECT * FROM schools WHERE id = ${id}
    `;
    return (result[0] as School) || null;
  }

  // Users
  static async getUserByEmail(email: string): Promise<User | null> {
    const result = await sql`
      SELECT u.*, s.name as school_name, s.short_name as school_short_name
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      WHERE u.email = ${email} AND u.is_active = true
    `;
    return (result[0] as User) || null;
  }

  static async getUserById(id: string): Promise<User | null> {
    const result = await sql`
      SELECT u.*, s.name as school_name, s.short_name as school_short_name
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      WHERE u.id = ${id} AND u.is_active = true
    `;
    return (result[0] as User) || null;
  }

  static async updateUserPoints(userId: string, pointsToAdd: number): Promise<void> {
    await sql`
      UPDATE users 
      SET tute_points = tute_points + ${pointsToAdd},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `;

    // Update school total points
    await sql`
      UPDATE schools 
      SET total_tute_points = (
        SELECT COALESCE(SUM(tute_points), 0) 
        FROM users 
        WHERE users.school_id = schools.id
      ),
      updated_at = CURRENT_TIMESTAMP
    `;
  }

  // Quiz Categories
  static async getAllQuizCategories(): Promise<QuizCategory[]> {
    const result = await sql`
      SELECT * FROM quiz_categories 
      ORDER BY name ASC
    `;
    return result as QuizCategory[];
  }

  // Quizzes
  static async getRandomQuizzes(limit: number = 5, category?: string): Promise<Quiz[]> {
    let result;
    
    if (category) {
      result = await sql`
        SELECT q.*, c.name as category_name, c.color as category_color
        FROM quizzes q
        LEFT JOIN quiz_categories c ON q.category_id = c.id
        WHERE q.is_active = true AND q.category_id = ${category}
        ORDER BY RANDOM()
        LIMIT ${limit}
      `;
    } else {
      result = await sql`
        SELECT q.*, c.name as category_name, c.color as category_color
        FROM quizzes q
        LEFT JOIN quiz_categories c ON q.category_id = c.id
        WHERE q.is_active = true
        ORDER BY RANDOM()
        LIMIT ${limit}
      `;
    }
    
    return result as Quiz[];
  }

  static async getQuizById(id: string): Promise<Quiz | null> {
    const result = await sql`
      SELECT q.*, c.name as category_name, c.color as category_color
      FROM quizzes q
      LEFT JOIN quiz_categories c ON q.category_id = c.id
      WHERE q.id = ${id} AND q.is_active = true
    `;
    return (result[0] as Quiz) || null;
  }

  // Lessons
  static async getAllLessons(limit?: number): Promise<Lesson[]> {
    let result;
    
    if (limit) {
      result = await sql`
        SELECT * FROM lessons 
        WHERE is_published = true
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      result = await sql`
        SELECT * FROM lessons 
        WHERE is_published = true
        ORDER BY created_at DESC
      `;
    }
    
    return result as Lesson[];
  }

  static async getLessonById(id: string): Promise<Lesson | null> {
    const result = await sql`
      SELECT * FROM lessons 
      WHERE id = ${id} AND is_published = true
    `;
    
    if (result[0]) {
      // Increment view count
      await sql`
        UPDATE lessons 
        SET view_count = view_count + 1 
        WHERE id = ${id}
      `;
    }
    
    return (result[0] as Lesson) || null;
  }

  // Quiz Attempts
  static async createQuizAttempt(attempt: Omit<UserQuizAttempt, 'id' | 'attempted_at'>): Promise<string> {
    const result = await sql`
      INSERT INTO user_quiz_attempts 
      (user_id, quiz_id, user_answer, is_correct, points_earned, time_taken)
      VALUES (${attempt.user_id}, ${attempt.quiz_id}, ${JSON.stringify(attempt.user_answer)}, 
              ${attempt.is_correct}, ${attempt.points_earned}, ${attempt.time_taken})
      RETURNING id
    `;
    return result[0].id;
  }

  static async getUserQuizStats(userId: string): Promise<{
    total_attempts: number;
    correct_answers: number;
    total_points: number;
    avg_time: number;
  }> {
    const result = await sql`
      SELECT 
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
        SUM(points_earned) as total_points,
        AVG(time_taken) as avg_time
      FROM user_quiz_attempts
      WHERE user_id = ${userId}
    `;
    
    const stats = result[0] as any;
    return {
      total_attempts: parseInt(stats.total_attempts) || 0,
      correct_answers: parseInt(stats.correct_answers) || 0,
      total_points: parseInt(stats.total_points) || 0,
      avg_time: parseFloat(stats.avg_time) || 0
    };
  }

  // Lesson Progress
  static async getUserLessonProgress(userId: string, lessonId: string): Promise<UserLessonProgress | null> {
    const result = await sql`
      SELECT * FROM user_lesson_progress
      WHERE user_id = ${userId} AND lesson_id = ${lessonId}
    `;
    return (result[0] as UserLessonProgress) || null;
  }

  static async updateLessonProgress(
    userId: string, 
    lessonId: string, 
    progressData: Partial<UserLessonProgress>
  ): Promise<void> {
    const existing = await this.getUserLessonProgress(userId, lessonId);
    
    if (existing) {
      await sql`
        UPDATE user_lesson_progress
        SET progress_percentage = ${progressData.progress_percentage || existing.progress_percentage},
            completed_blocks = ${JSON.stringify(progressData.completed_blocks || existing.completed_blocks)},
            is_completed = ${progressData.is_completed || existing.is_completed},
            completion_time = ${progressData.completion_time || existing.completion_time},
            completed_at = ${progressData.is_completed ? 'CURRENT_TIMESTAMP' : existing.completed_at},
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId} AND lesson_id = ${lessonId}
      `;
    } else {
      await sql`
        INSERT INTO user_lesson_progress 
        (user_id, lesson_id, progress_percentage, completed_blocks, is_completed, completion_time)
        VALUES (${userId}, ${lessonId}, ${progressData.progress_percentage || 0}, 
                ${JSON.stringify(progressData.completed_blocks || [])}, 
                ${progressData.is_completed || false}, ${progressData.completion_time})
      `;
    }
  }

  // Leaderboard
  static async getSchoolLeaderboard(): Promise<School[]> {
    const result = await sql`
      SELECT * FROM schools 
      ORDER BY total_tute_points DESC, name ASC
    `;
    return result as School[];
  }

  static async getUserLeaderboard(limit: number = 10): Promise<User[]> {
    const result = await sql`
      SELECT u.*, s.name as school_name, s.short_name as school_short_name
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      WHERE u.is_active = true
      ORDER BY u.tute_points DESC, u.name ASC
      LIMIT ${limit}
    `;
    return result as User[];
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      await sql`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

export default DatabaseService; 