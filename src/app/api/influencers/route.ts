import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'overview', 'influencers', 'campaigns', 'content', 'leaderboard'
    const tier = searchParams.get('tier');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Read from JSON file
    const jsonPath = path.join(process.cwd(), 'data/influencers.json');
    const influencersData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    let result = influencersData;

    // Filter by type if specified
    if (type === 'overview') {
      result = { 
        program: influencersData.program,
        tiers: influencersData.tiers,
        analytics: influencersData.analytics
      };
    } else if (type === 'influencers') {
      let influencers = influencersData.activeInfluencers;
      
      if (tier && tier !== 'all') {
        influencers = influencers.filter((inf: any) => inf.tier === tier);
      }
      
      result = { 
        activeInfluencers: influencers.slice(0, limit),
        totalCount: influencers.length
      };
    } else if (type === 'campaigns') {
      result = { campaigns: influencersData.campaigns };
    } else if (type === 'content') {
      result = { contentLibrary: influencersData.contentLibrary };
    } else if (type === 'leaderboard') {
      result = { leaderboard: influencersData.leaderboard };
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching influencers data:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải dữ liệu influencers' },
      { status: 500 }
    );
  }
} 