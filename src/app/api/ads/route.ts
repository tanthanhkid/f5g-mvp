import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'current' hoặc 'auction'
    const sponsor = searchParams.get('sponsor');

    // Read from JSON file
    const jsonPath = path.join(process.cwd(), 'data/ads.json');
    const adsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    let result = adsData;

    // Filter by type if specified
    if (type === 'current') {
      result = {
        ...adsData,
        currentAds: sponsor 
          ? adsData.currentAds.filter((ad: any) => ad.sponsor === sponsor)
          : adsData.currentAds
      };
    } else if (type === 'auction') {
      result = {
        auctionData: adsData.auctionData,
        realTimeMetrics: adsData.realTimeMetrics
      };
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching ads data:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải dữ liệu quảng cáo' },
      { status: 500 }
    );
  }
} 