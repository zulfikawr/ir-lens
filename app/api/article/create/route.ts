import { NextResponse } from 'next/server';
import { addArticle } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await addArticle(body);
    return NextResponse.json(
      {
        message: 'Article added successfully',
        slug: body.slug,
        date: body.date,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error adding article:', error);
    return NextResponse.json(
      { message: 'Error adding article', error },
      { status: 500 },
    );
  }
}
