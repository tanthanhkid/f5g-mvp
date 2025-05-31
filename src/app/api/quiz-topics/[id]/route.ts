import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: topicKey } = await params;

    const result = await sql`
      SELECT 
        id,
        topic_key,
        title,
        description,
        icon,
        difficulty,
        estimated_time,
        category,
        age_group,
        keywords,
        learning_content,
        quiz_questions,
        created_at,
        updated_at
      FROM quiz_topics
      WHERE topic_key = ${topicKey} AND is_active = true
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Topic không tồn tại' },
        { status: 404 }
      );
    }

    const topic = result[0];

    // Transform to match frontend format
    const topicData = {
      id: topic.topic_key,
      title: topic.title,
      description: topic.description,
      icon: topic.icon,
      difficulty: topic.difficulty,
      estimatedTime: topic.estimated_time,
      category: topic.category,
      ageGroup: topic.age_group,
      keywords: topic.keywords || [],
      learningContent: topic.learning_content || [],
      quizQuestions: topic.quiz_questions || []
    };

    return NextResponse.json({
      success: true,
      topic: topicData
    });

  } catch (error) {
    console.error('Error fetching topic details:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải chi tiết topic' },
      { status: 500 }
    );
  }
} 