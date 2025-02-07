import { NextResponse } from 'next/server';
import { updateArticle } from '@/lib/database';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, ...articleData } = body;

    if (!slug) {
      throw new Error('Article slug is required for updates.');
    }

    await updateArticle(slug, articleData);

    return NextResponse.json(
      { message: 'Article updated successfully', slug, date: articleData.date },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { message: 'Error updating article', error },
      { status: 500 },
    );
  }
}
