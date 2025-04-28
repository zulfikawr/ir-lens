import { NextResponse } from 'next/server';
import { fetchAndProcessNews } from '@/lib/newsProcessor';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const CRON_SECRET = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await fetchAndProcessNews();
    return NextResponse.json({
      message: 'News fetching completed',
      results,
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
