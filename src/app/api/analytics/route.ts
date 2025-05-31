import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'overview', 'sponsor', 'campaigns', 'realtime'
    const sponsor = searchParams.get('sponsor');

    // Read from JSON file
    const jsonPath = path.join(process.cwd(), 'data/analytics.json');
    const analyticsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    let result = analyticsData;

    // Filter by type if specified
    if (type === 'overview') {
      result = { overview: analyticsData.overview };
    } else if (type === 'sponsor' && sponsor) {
      result = { 
        sponsor: analyticsData.sponsorAnalytics[sponsor],
        sponsorName: sponsor
      };
    } else if (type === 'campaigns') {
      result = { campaignPerformance: analyticsData.campaignPerformance };
    } else if (type === 'realtime') {
      result = { realTimeMetrics: analyticsData.realTimeMetrics };
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải dữ liệu analytics' },
      { status: 500 }
    );
  }
} 