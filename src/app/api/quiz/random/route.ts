import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const category = searchParams.get('category') || undefined;

    const quizzes = await DatabaseService.getRandomQuizzes(limit, category);

    // Loại bỏ correct_answer khỏi response để không lộ đáp án
    const quizzesWithoutAnswers = quizzes.map(quiz => {
      const { correct_answer, ...quizWithoutAnswer } = quiz;
      return quizWithoutAnswer;
    });

    return NextResponse.json({
      success: true,
      quizzes: quizzesWithoutAnswers,
      total: quizzes.length
    });

  } catch (error) {
    console.error('Get random quizzes error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    );
  }
} 