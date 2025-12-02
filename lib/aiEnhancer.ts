import { GoogleGenerativeAI } from '@google/generative-ai';
import { ContentBlock } from '@/types/contentBlocks';
import { Article } from '@/types/article';
import { preCleanContent } from '@/lib/contentCleaner';

interface EnhancedArticleContent {
  title: string;
  description: string;
  rewrittenContent: string;
  blocks: ContentBlock[];
  tag: string;
  region: string;
  location: string;
  improvements: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 4096,
};

/**
 * Try to extract and parse JSON from a possibly noisy AI response.
 * Uses brace matching to locate a balanced JSON object and applies
 * small fixes (smart quotes, trailing commas) before parsing.
 */
function parseJSONFromAIResponse(responseText: string): any | null {
  if (!responseText || responseText.indexOf('{') === -1) return null;

  const start = responseText.indexOf('{');
  let braceCount = 0;
  for (let i = start; i < responseText.length; i++) {
    const ch = responseText[i];
    if (ch === '{') braceCount++;
    if (ch === '}') braceCount--;
    if (braceCount === 0) {
      let candidate = responseText.substring(start, i + 1);

      // remove code fences if present
      candidate = candidate.replace(/```\w*\n?/g, '');

      // quick normalization fixes
      candidate = candidate
        .replace(/[\u2018\u2019\u201C\u201D]/g, '"') // smart quotes
        .replace(/\r/g, ' ')
        .replace(/\t/g, ' ')
        .replace(/\n\s+/g, ' ')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/\u0000/g, '');

      // Replace single-quoted strings with double quotes (best-effort)
      candidate = candidate.replace(/'([^']*?)'/g, '"$1"');

      // Sanitize unescaped double quotes that appear inside string values
      function sanitizeJSONString(str: string) {
        let out = '';
        let inString = false;
        let escapeNext = false;
        for (let j = 0; j < str.length; j++) {
          const c = str[j];
          if (escapeNext) {
            out += c;
            escapeNext = false;
            continue;
          }
          if (c === '\\') {
            out += c;
            escapeNext = true;
            continue;
          }
          if (c === '"') {
            if (!inString) {
              // entering string
              inString = true;
              out += c;
              continue;
            }

            // candidate closing quote; lookahead to next non-space char
            let k = j + 1;
            while (k < str.length && /\s/.test(str[k])) k++;
            const next = str[k] || '';
            if (next === ',' || next === '}' || next === ']' || next === ':') {
              // valid end of string
              inString = false;
              out += c;
            } else {
              // probably an unescaped quote inside the string -> escape it
              out += '\\"';
            }
            continue;
          }
          out += c;
        }
        return out;
      }

      candidate = sanitizeJSONString(candidate);

      try {
        return JSON.parse(candidate);
      } catch (e) {
        // try a slightly more aggressive cleanup: remove stray backslashes
        const cleaned = candidate.replace(/\\(?!["bfnrt\\/u])/g, '');
        try {
          return JSON.parse(cleaned);
        } catch (e2) {
          console.error(
            'JSON parse failed after cleanup:',
            (e2 as Error).message,
          );
          console.error('Candidate JSON preview:', candidate.substring(0, 400));
          return null;
        }
      }
    }
  }

  return null;
}

/**
 * Generate AI prompt for complete article processing with rich blocks
 */
function generateArticleProcessingPrompt(
  title: string,
  rawContent: string,
  sourceName: string,
  sourceRegion: string,
): string {
  return `Clean, rewrite, and structure this article into diverse blocks.

Title: ${title}
Source: ${sourceName}
Region: ${sourceRegion}

Raw Content:
${rawContent}

Return ONLY this JSON (no markdown, no code blocks):
{
  "description": "2 sentence summary",
  "blocks": [
    {"type": "text", "text": "First paragraph with main points"},
    {"type": "highlight", "highlight": "Key fact or statistic"},
    {"type": "text", "text": "Background details"},
    {"type": "quote", "quote": "Important quote if available", "spokesperson": "Source", "role": "Role"},
    {"type": "text", "text": "Additional context"},
    {"type": "callout", "callout": "Key takeaway"},
    {"type": "text", "text": "Implications or next steps"},
    {"type": "text", "text": "Conclusion"}
  ]
}`;
}

/**
 * Process raw scraped article with AI - handles all cleaning and structuring
 */
export async function processArticleWithAI(
  title: string,
  rawContent: string,
  sourceName: string = 'News Source',
  sourceRegion: string = 'Global',
): Promise<Article | null> {
  try {
    if (!title || !rawContent || rawContent.length < 100) {
      console.warn('Insufficient content');
      return null;
    }

    // Use raw content as-is, let AI handle everything
    const contentToProcess = rawContent.substring(0, 4000);

    const prompt = generateArticleProcessingPrompt(
      title,
      contentToProcess,
      sourceName,
      sourceRegion,
    );

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig,
    });

    const responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!responseText || responseText.trim().length === 0) {
      console.error('Empty response from Gemini');
      return null;
    }

    // Extract and parse JSON robustly
    const parsed = parseJSONFromAIResponse(responseText);
    if (!parsed) {
      console.error('Failed to parse JSON from AI response');
      console.error('AI response preview:', responseText.substring(0, 600));
      return null;
    }

    if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
      console.error('No blocks in response');
      return null;
    }

    const tag = 'Diplomacy'; // Default tag
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Use blocks as-is from AI but remove heading blocks that exactly duplicate the title
    const blocks: ContentBlock[] = (parsed.blocks || [])
      .filter((b: any) => b && b.type)
      .filter((b: any) => {
        // Remove heading blocks that duplicate the article title (case-insensitive)
        if (
          b.type === 'heading' &&
          typeof b.heading === 'string' &&
          b.heading.trim().toLowerCase() === title.trim().toLowerCase()
        ) {
          return false;
        }
        return true;
      });

    const article: Article = {
      title,
      description: parsed.description || contentToProcess.substring(0, 200),
      date: new Date().toISOString(),
      location: sourceRegion,
      tag,
      region: sourceRegion,
      coverImg: '/default-cover.jpg',
      coverImgAlt: `News article: ${title}`,
      slug,
      headline: false,
      views: 0,
      blocks:
        blocks.length > 0 ? blocks : [{ type: 'text', text: contentToProcess }],
    };

    return article;
  } catch (error) {
    console.error('Error processing article:', error);
    return null;
  }
}

/**
 * Generate AI prompt for on-demand article enhancement
 */
function generateEnhancementPrompt(
  title: string,
  content: string,
  tag: string,
  region: string,
): string {
  return `Clean, rewrite, and structure this article. Return ONLY JSON.

Title: ${title}
Tag: ${tag}
Region: ${region}

Content:
${content}

Return ONLY this JSON (no markdown):
{
  "description": "2 sentence summary",
  "blocks": [
    {"type": "text", "text": "First paragraph with main points"},
    {"type": "highlight", "highlight": "Key fact or statistic"},
    {"type": "text", "text": "Background details"},
    {"type": "quote", "quote": "Important quote if available", "spokesperson": "Source", "role": "Role"},
    {"type": "text", "text": "Additional context"},
    {"type": "callout", "callout": "Key takeaway"},
    {"type": "text", "text": "Implications or next steps"},
    {"type": "text", "text": "Conclusion"}
  ]
}`;
}

/**
 * Enhance article on-demand from modal
 */
export async function enhanceArticleWithAI(
  title: string,
  content: string,
  tag: string,
  region: string,
): Promise<{
  title: string;
  description: string;
  blocks: ContentBlock[];
  tag: string;
  region: string;
  location: string;
} | null> {
  try {
    if (content.length < 100) {
      return null;
    }

    // Use raw content as-is
    const contentToProcess = content.substring(0, 4000);

    const prompt = generateEnhancementPrompt(
      title,
      contentToProcess,
      tag,
      region,
    );

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig,
    });

    const responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!responseText) return null;

    // Extract JSON
    const jsonStart = responseText.indexOf('{');
    if (jsonStart === -1) return null;

    const jsonEnd = responseText.lastIndexOf('}');
    if (jsonEnd === -1 || jsonEnd <= jsonStart) return null;

    let jsonStr = responseText.substring(jsonStart, jsonEnd + 1);
    jsonStr = jsonStr
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/'/g, '"');

    const parsed = parseJSONFromAIResponse(responseText);
    if (!parsed) {
      console.error('Failed to parse JSON from AI response');
      console.error('AI response preview:', responseText.substring(0, 600));
      return null;
    }

    // Remove heading blocks that duplicate the provided title
    const blocks: ContentBlock[] = (parsed.blocks || [])
      .filter((b: any) => b && b.type)
      .filter((b: any) => {
        if (
          b.type === 'heading' &&
          typeof b.heading === 'string' &&
          b.heading.trim().toLowerCase() === title.trim().toLowerCase()
        ) {
          return false;
        }
        return true;
      });

    return {
      title,
      description: parsed.description || content.substring(0, 200),
      blocks:
        blocks.length > 0 ? blocks : [{ type: 'text', text: contentToProcess }],
      tag,
      region,
      location: region,
    };
  } catch (error) {
    console.error('Error enhancing article:', error);
    return null;
  }
}
