import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'schools'; // 'schools' or 'users'
    const limit = parseInt(searchParams.get('limit') || '10');

    let leaderboard;

    if (type === 'schools') {
      leaderboard = await DatabaseService.getSchoolLeaderboard();
    } else if (type === 'users') {
      leaderboard = await DatabaseService.getUserLeaderboard(limit);
      // Loại bỏ thông tin nhạy cảm
      leaderboard = leaderboard.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } else {
      return NextResponse.json(
        { error: 'Type không hợp lệ. Sử dụng "schools" hoặc "users"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      type,
      leaderboard,
      total: leaderboard.length
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { error: 'Lỗi server, vui lòng thử lại' },
      { status: 500 }
    );
  }
} 