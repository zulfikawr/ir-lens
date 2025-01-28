import { NextResponse } from 'next/server';
import { updateArticle } from '@/lib/database';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...articleData } = body;

    if (!id) {
      throw new Error('Article ID is required for updates.');
    }

    await updateArticle(id, articleData);

    return NextResponse.json(
      { message: 'Article updated successfully' },
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
