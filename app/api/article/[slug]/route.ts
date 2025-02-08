import { NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/database';
import type { ArticleType } from '@/types/article';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 },
      );
    }

    const article = await getArticleBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({
      articles: [article],
    } satisfies ArticleType);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
