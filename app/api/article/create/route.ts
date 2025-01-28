import { NextResponse } from 'next/server';
import { addArticle } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = await addArticle(body);
    return NextResponse.json(
      { message: 'Article added successfully', id },
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
