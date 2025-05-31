import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get lessons with content blocks count
    let lessonsResult;
    let countResult;

    if (category && category !== 'all' && difficulty && difficulty !== 'all') {
      // Both filters
      lessonsResult = await sql`
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
          l.updated_at,
          COUNT(lcb.id) as content_blocks_count
        FROM lessons l
        LEFT JOIN lesson_content_blocks lcb ON l.id = lcb.lesson_id
        WHERE l.category = ${category} AND l.difficulty = ${difficulty}
        GROUP BY l.id, l.lesson_key, l.title, l.description, l.category, 
                 l.difficulty, l.estimated_time, l.learning_objectives, 
                 l.tags, l.created_at, l.updated_at
        ORDER BY l.created_at ASC
        LIMIT ${limit} OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(DISTINCT l.id) as total
        FROM lessons l
        WHERE l.category = ${category} AND l.difficulty = ${difficulty}
      `;
    } else if (category && category !== 'all') {
      // Category filter only
      lessonsResult = await sql`
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
          l.updated_at,
          COUNT(lcb.id) as content_blocks_count
        FROM lessons l
        LEFT JOIN lesson_content_blocks lcb ON l.id = lcb.lesson_id
        WHERE l.category = ${category}
        GROUP BY l.id, l.lesson_key, l.title, l.description, l.category, 
                 l.difficulty, l.estimated_time, l.learning_objectives, 
                 l.tags, l.created_at, l.updated_at
        ORDER BY l.created_at ASC
        LIMIT ${limit} OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(DISTINCT l.id) as total
        FROM lessons l
        WHERE l.category = ${category}
      `;
    } else if (difficulty && difficulty !== 'all') {
      // Difficulty filter only
      lessonsResult = await sql`
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
          l.updated_at,
          COUNT(lcb.id) as content_blocks_count
        FROM lessons l
        LEFT JOIN lesson_content_blocks lcb ON l.id = lcb.lesson_id
        WHERE l.difficulty = ${difficulty}
        GROUP BY l.id, l.lesson_key, l.title, l.description, l.category, 
                 l.difficulty, l.estimated_time, l.learning_objectives, 
                 l.tags, l.created_at, l.updated_at
        ORDER BY l.created_at ASC
        LIMIT ${limit} OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(DISTINCT l.id) as total
        FROM lessons l
        WHERE l.difficulty = ${difficulty}
      `;
    } else {
      // No filters
      lessonsResult = await sql`
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
          l.updated_at,
          COUNT(lcb.id) as content_blocks_count
        FROM lessons l
        LEFT JOIN lesson_content_blocks lcb ON l.id = lcb.lesson_id
        GROUP BY l.id, l.lesson_key, l.title, l.description, l.category, 
                 l.difficulty, l.estimated_time, l.learning_objectives, 
                 l.tags, l.created_at, l.updated_at
        ORDER BY l.created_at ASC
        LIMIT ${limit} OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(DISTINCT l.id) as total
        FROM lessons l
      `;
    }

    // Transform to match frontend interface
    const lessons = lessonsResult.map((row: any) => ({
      id: row.lesson_key, // Use lesson_key as id for frontend compatibility
      title: row.title,
      description: row.description,
      category: row.category,
      difficulty: row.difficulty,
      estimatedTime: row.estimated_time,
      learningObjectives: row.learning_objectives,
      tags: row.tags,
      contentBlocks: [], // Will be filled when needed
      prerequisites: [], // Could be added later
      contentBlocksCount: parseInt(row.content_blocks_count)
    }));

    const total = parseInt(countResult[0]?.total || '0');

    return NextResponse.json({
      success: true,
      lessons,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách bài học' },
      { status: 500 }
    );
  }
} 