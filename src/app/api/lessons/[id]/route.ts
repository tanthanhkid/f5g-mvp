import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonKey } = await params;

    // Get lesson details
    const lessonResult = await sql`
      SELECT 
        l.id,
        l.lesson_key,
        l.title,
        l.description,
        l.category,
        l.difficulty,
        l.estimated_time,
        l.learning_objectives,
        l.tags,
        l.created_at,
        l.updated_at
      FROM lessons l
      WHERE l.lesson_key = ${lessonKey}
    `;

    if (lessonResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bài học không tồn tại' },
        { status: 404 }
      );
    }

    const lesson = lessonResult[0];

    // Get content blocks for this lesson
    const blocksResult = await sql`
      SELECT 
        lcb.id,
        lcb.block_key,
        lcb.block_type,
        lcb.block_order,
        lcb.title,
        lcb.content
      FROM lesson_content_blocks lcb
      WHERE lcb.lesson_id = ${lesson.id}
      ORDER BY lcb.block_order ASC
    `;

    // Transform content blocks to match frontend format
    const contentBlocks = blocksResult.map((block: any) => {
      const baseBlock = {
        type: block.block_type,
        id: block.block_key,
        title: block.title
      };

      // Add type-specific content
      if (block.block_type === 'text') {
        return {
          ...baseBlock,
          content: block.content.content
        };
      } else if (block.block_type === 'video') {
        return {
          ...baseBlock,
          youtubeId: block.content.youtubeId,
          description: block.content.description,
          duration: block.content.duration
        };
      } else if (block.block_type === 'quiz') {
        return {
          ...baseBlock,
          quiz: block.content.quiz
        };
      }

      return baseBlock;
    });

    // Transform lesson to match frontend interface
    const lessonData = {
      id: lesson.lesson_key,
      title: lesson.title,
      description: lesson.description,
      category: lesson.category,
      difficulty: lesson.difficulty,
      estimatedTime: lesson.estimated_time,
      learningObjectives: lesson.learning_objectives,
      tags: lesson.tags,
      contentBlocks,
      prerequisites: [] // Could be added later
    };

    return NextResponse.json({
      success: true,
      lesson: lessonData
    });

  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải chi tiết bài học' },
      { status: 500 }
    );
  }
} 