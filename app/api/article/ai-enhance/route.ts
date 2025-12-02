import { NextResponse } from 'next/server';
import { enhanceArticleWithAI } from '@/lib/aiEnhancer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      content,
      defaultTag = 'Diplomacy',
      defaultRegion = 'Global',
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 },
      );
    }

    // Enhance with AI (AI handles all cleaning and processing)
    const enhanced = await enhanceArticleWithAI(
      title,
      content,
      defaultTag,
      defaultRegion,
    );

    // Always return something (enhanced or fallback)
    return NextResponse.json(
      enhanced || {
        title,
        description: content.substring(0, 200),
        blocks: [{ type: 'text', text: content }],
        tag: defaultTag,
        region: defaultRegion,
        location: defaultRegion,
      },
    );
  } catch (error) {
    console.error('Error enhancing article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
