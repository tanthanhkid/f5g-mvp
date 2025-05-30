import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, quizId, userAnswer, timeTaken } = await request.json();

    if (!userId || !quizId || !userAnswer) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Lấy quiz để kiểm tra đáp án
    const quiz = await DatabaseService.getQuizById(quizId);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Không tìm thấy câu hỏi' },
        { status: 404 }
      );
    }

    // Kiểm tra đáp án
    let isCorrect = false;
    
    if (quiz.type === 'single') {
      // Single choice: so sánh index đáp án
      isCorrect = userAnswer.length === 1 && 
                  userAnswer[0] === quiz.correct_answer[0];
    } else if (quiz.type === 'multiple') {
      // Multiple choice: so sánh mảng đáp án (đã sắp xếp)
      const sortedUserAnswer = [...userAnswer].sort((a, b) => a - b);
      const sortedCorrectAnswer = [...quiz.correct_answer].sort((a, b) => a - b);
      
      isCorrect = sortedUserAnswer.length === sortedCorrectAnswer.length &&
                  sortedUserAnswer.every((val, index) => val === sortedCorrectAnswer[index]);
    } else if (quiz.type === 'text') {
      // Text answer: so sánh chuỗi (không phân biệt hoa thường)
      const userText = userAnswer[0]?.toString().toLowerCase().trim();
      const correctText = quiz.correct_answer[0]?.toString().toLowerCase().trim();
      isCorrect = userText === correctText;
    }

    const pointsEarned = isCorrect ? quiz.points : 0;

    // Lưu kết quả vào database
    const attemptId = await DatabaseService.createQuizAttempt({
      user_id: userId,
      quiz_id: quizId,
      user_answer: userAnswer,
      is_correct: isCorrect,
      points_earned: pointsEarned,
      time_taken: timeTaken
    });

    // Cập nhật điểm TUTE cho user nếu trả lời đúng
    if (isCorrect && pointsEarned > 0) {
      await DatabaseService.updateUserPoints(userId, pointsEarned);
    }

    return NextResponse.json({
      success: true,
      attemptId,
      isCorrect,
      pointsEarned,
      correctAnswer: quiz.correct_answer,
      explanation: quiz.explanation,
      message: isCorrect ? 'Chính xác!' : 'Sai rồi, thử lại nhé!'
    });

  } catch (error) {
    console.error('Submit quiz error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    );
  }
} 