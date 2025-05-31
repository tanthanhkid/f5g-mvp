import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET - Get user's progress for a lesson
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonKey } = await params;
    
    // Get user from session/auth (simplified for now)
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get lesson ID from lesson_key
    const lessonResult = await sql`
      SELECT id FROM lessons WHERE lesson_key = ${lessonKey}
    `;

    if (lessonResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bài học không tồn tại' },
        { status: 404 }
      );
    }

    const lessonId = lessonResult[0].id;

    // Get user progress
    const progressResult = await sql`
      SELECT 
        id,
        user_id,
        lesson_id,
        started_at,
        completed_at,
        current_block_index,
        completed_blocks,
        quiz_answers,
        video_watch_time,
        tute_points_earned,
        is_completed
      FROM user_lesson_progress
      WHERE user_id = ${userId} AND lesson_id = ${lessonId}
    `;

    if (progressResult.length === 0) {
      // No progress yet, return default
      return NextResponse.json({
        success: true,
        progress: {
          currentBlockIndex: 0,
          completedBlocks: [],
          quizAnswers: {},
          videoWatchTime: {},
          tutePointsEarned: 0,
          isCompleted: false,
          startedAt: null,
          completedAt: null
        }
      });
    }

    const progress = progressResult[0];
    
    return NextResponse.json({
      success: true,
      progress: {
        currentBlockIndex: progress.current_block_index,
        completedBlocks: progress.completed_blocks,
        quizAnswers: progress.quiz_answers,
        videoWatchTime: progress.video_watch_time,
        tutePointsEarned: progress.tute_points_earned,
        isCompleted: progress.is_completed,
        startedAt: progress.started_at,
        completedAt: progress.completed_at
      }
    });

  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải tiến độ bài học' },
      { status: 500 }
    );
  }
}

// POST - Start lesson or update progress
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonKey } = await params;
    const body = await request.json();
    
    const {
      userId,
      currentBlockIndex,
      completedBlocks,
      quizAnswers,
      videoWatchTime,
      tutePointsEarned,
      isCompleted
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get lesson ID from lesson_key
    const lessonResult = await sql`
      SELECT id FROM lessons WHERE lesson_key = ${lessonKey}
    `;

    if (lessonResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bài học không tồn tại' },
        { status: 404 }
      );
    }

    const lessonId = lessonResult[0].id;

    // Upsert progress
    const progressResult = await sql`
      INSERT INTO user_lesson_progress (
        user_id,
        lesson_id,
        current_block_index,
        completed_blocks,
        quiz_answers,
        video_watch_time,
        tute_points_earned,
        is_completed,
        completed_at
      ) VALUES (
        ${userId},
        ${lessonId},
        ${currentBlockIndex || 0},
        ${JSON.stringify(completedBlocks || [])},
        ${JSON.stringify(quizAnswers || {})},
        ${JSON.stringify(videoWatchTime || {})},
        ${tutePointsEarned || 0},
        ${isCompleted || false},
        ${isCompleted ? new Date().toISOString() : null}
      )
      ON CONFLICT (user_id, lesson_id) DO UPDATE SET
        current_block_index = EXCLUDED.current_block_index,
        completed_blocks = EXCLUDED.completed_blocks,
        quiz_answers = EXCLUDED.quiz_answers,
        video_watch_time = EXCLUDED.video_watch_time,
        tute_points_earned = EXCLUDED.tute_points_earned,
        is_completed = EXCLUDED.is_completed,
        completed_at = EXCLUDED.completed_at
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: 'Cập nhật tiến độ thành công',
      progress: progressResult[0]
    });

  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật tiến độ' },
      { status: 500 }
    );
  }
} 