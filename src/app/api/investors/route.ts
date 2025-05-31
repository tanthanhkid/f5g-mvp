import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// For now, serve data from JSON until we create investors table
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const tier = searchParams.get('tier');

    // Read from JSON file for now
    const jsonPath = path.join(process.cwd(), 'data/investors.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    let investors = jsonData.investors || [];

    // Filter by tier if specified
    if (tier && tier !== 'all') {
      investors = investors.filter((investor: any) => investor.tier === tier);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInvestors = investors.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        dailyPool: jsonData.dailyPool,
        totalPool: jsonData.totalPool,
        investors: paginatedInvestors,
        minorSponsors: jsonData.minorSponsors,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(investors.length / limit),
          totalItems: investors.length,
          hasNext: endIndex < investors.length,
          hasPrevious: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching investors:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải danh sách nhà đầu tư' },
      { status: 500 }
    );
  }
} 