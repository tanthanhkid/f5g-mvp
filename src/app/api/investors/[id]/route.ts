import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Read from JSON file
    const jsonPath = path.join(process.cwd(), 'data/investors.json');
    const investorsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Find investor by ID
    const investor = investorsData.investors.find((inv: any) => inv.id.toString() === id);

    if (!investor) {
      return NextResponse.json(
        { success: false, error: 'Nhà đầu tư không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        investor,
        totalPool: investorsData.totalPool,
        dailyPool: investorsData.dailyPool
      }
    });

  } catch (error) {
    console.error('Error fetching investor details:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải chi tiết nhà đầu tư' },
      { status: 500 }
    );
  }
} 