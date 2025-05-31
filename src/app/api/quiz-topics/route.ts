import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const ageGroup = searchParams.get('ageGroup');
    const search = searchParams.get('search');

    let result;

    if (!category && !difficulty && !ageGroup && !search) {
      // No filters - get all topics
      result = await sql`
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
        WHERE is_active = true
        ORDER BY created_at DESC
      `;
    } else {
      // Build filtered query
      let whereConditions = ['is_active = true'];
      const params: any[] = [];

      if (category && category !== 'all') {
        whereConditions.push(`category = '${category}'`);
      }

      if (difficulty && difficulty !== 'all') {
        whereConditions.push(`difficulty = '${difficulty}'`);
      }

      if (ageGroup && ageGroup !== 'all') {
        whereConditions.push(`age_group = '${ageGroup}'`);
      }

      if (search) {
        const searchTerm = search.replace(/'/g, "''"); // Escape quotes
        whereConditions.push(`(
          title ILIKE '%${searchTerm}%' OR 
          description ILIKE '%${searchTerm}%' OR 
          category ILIKE '%${searchTerm}%' OR
          keywords::text ILIKE '%${searchTerm}%'
        )`);
      }

      const queryStr = `
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
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY created_at DESC
      `;

      result = await sql.unsafe(queryStr);
    }

    // Transform result to match frontend format
    const topics = (result as any[]).map((topic: any) => ({
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
    }));

    return NextResponse.json({
      success: true,
      topics
    });

  } catch (error) {
    console.error('Error fetching quiz topics:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách chủ đề' },
      { status: 500 }
    );
  }
} 