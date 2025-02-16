import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/database';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: NextRequest, props: Props) {
  try {
    const params = await props.params;
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
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
