import { NextResponse } from 'next/server';
import {
  structureArticleBlocks,
  polishArticleContent,
  generateAlternativeHeadlines,
} from '@/lib/aiContentProcessor';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, headline, action } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 },
      );
    }

    let result: unknown = null;

    switch (action) {
      case 'structure':
        // Structure content into content blocks
        result = await structureArticleBlocks(content);
        break;

      case 'polish':
        // Polish and enhance content
        result = await polishArticleContent(content);
        break;

      case 'headlines':
        // Generate alternative headlines
        if (!headline) {
          return NextResponse.json(
            { error: 'Headline is required for this action' },
            { status: 400 },
          );
        }
        result = await generateAlternativeHeadlines(content, headline);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error processing article:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
