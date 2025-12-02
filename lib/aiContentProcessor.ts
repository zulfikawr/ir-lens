import { GoogleGenerativeAI } from '@google/generative-ai';
import { ContentBlock } from '@/types/contentBlocks';

interface StructuredContent {
  blocks: ContentBlock[];
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
  maxOutputTokens: 8192,
};

/**
 * Generate prompt for content block structuring
 */
function generateBlockStructuringPrompt(content: string): string {
  return `You are an expert content strategist. Analyze and structure the following article content into well-organized content blocks.

Article Content:
${content}

Please provide a JSON response with the following structure (do NOT repeat the article title as a heading):
{
  "blocks": [
    {"type": "text", "text": "First paragraph..."},
    {"type": "highlight", "highlight": "Important key finding or statistic"},
    {"type": "text", "text": "Next section..."},
    {"type": "quote", "quote": "Direct quote from the article", "spokesperson": "Who said it", "role": "Their role"},
    {"type": "text", "text": "Concluding thoughts..."}
  ],
  "improvements": [
    "Organized into logical sections",
    "Added key highlights and statistics",
    "Enhanced readability with proper structure",
    "Included relevant context"
  ]
}

Guidelines:
- Do NOT recreate the article's title as a heading. If you include 'heading' blocks, they must be sub-section headings that are not identical to the title.
- Use 'text' for regular content paragraphs (max 300 chars each)
- Use 'highlight' for important statistics or key facts (max 200 chars)
- Use 'quote' for direct quotes or expert statements (include spokesperson and role)
- Create 5-10 blocks total for good pacing
- Ensure blocks are specific and meaningful
- Focus on readability and visual hierarchy
- Return ONLY valid JSON, no markdown formatting`;
}

/**
 * Structure article content into optimized content blocks
 */
export async function structureArticleBlocks(
  content: string,
): Promise<StructuredContent | null> {
  try {
    const prompt = generateBlockStructuringPrompt(content);

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

    // Robustly parse JSON using brace matching and small cleanups
    const start = responseText.indexOf('{');
    if (start === -1) {
      console.error('Failed to extract JSON from AI response');
      return null;
    }

    let braceCount = 0;
    let parsed: any = null;
    for (let i = start; i < responseText.length; i++) {
      const ch = responseText[i];
      if (ch === '{') braceCount++;
      if (ch === '}') braceCount--;
      if (braceCount === 0) {
        let candidate = responseText.substring(start, i + 1);

        // remove code fences
        candidate = candidate.replace(/```\w*\n?/g, '');

        candidate = candidate
          .replace(/[\u2018\u2019\u201C\u201D]/g, '"')
          .replace(/\r/g, ' ')
          .replace(/\t/g, ' ')
          .replace(/\n\s+/g, ' ')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/\u0000/g, '')
          .replace(/'([^']*?)'/g, '"$1"');

        // sanitize unescaped double quotes inside string values
        let out = '';
        let inString = false;
        let escapeNext = false;
        for (let j = 0; j < candidate.length; j++) {
          const c = candidate[j];
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
              inString = true;
              out += c;
              continue;
            }
            // lookahead
            let k = j + 1;
            while (k < candidate.length && /\s/.test(candidate[k])) k++;
            const next = candidate[k] || '';
            if (next === ',' || next === '}' || next === ']' || next === ':') {
              inString = false;
              out += c;
            } else {
              out += '\\"';
            }
            continue;
          }
          out += c;
        }

        try {
          parsed = JSON.parse(out);
          break;
        } catch (e) {
          const cleaned = out.replace(/\\(?!["bfnrt\\/u])/g, '');
          try {
            parsed = JSON.parse(cleaned);
            break;
          } catch (e2) {
            // continue searching
          }
        }
      }
    }

    if (!parsed) {
      console.error('Failed to parse JSON from AI response');
      console.error('AI response preview:', responseText.substring(0, 600));
      return null;
    }

    return {
      blocks: parsed.blocks || [],
      improvements: parsed.improvements || [],
    };
  } catch (error) {
    console.error('Error structuring article blocks:', error);
    return null;
  }
}

/**
 * Polish and enhance article copy
 */
export async function polishArticleContent(content: string): Promise<string> {
  try {
    const prompt = `You are an expert editor. Polish the following article content to make it more engaging, professional, and readable.

Original Content:
${content}

Provide the polished version with:
- Better transitions between paragraphs
- Improved sentence structure
- Enhanced clarity and flow
- Professional tone
- Removed redundancies

Return ONLY the polished content, no explanations.`;

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

    return (
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || content
    );
  } catch (error) {
    console.error('Error polishing article content:', error);
    return content;
  }
}

/**
 * Generate alternative headlines
 */
export async function generateAlternativeHeadlines(
  content: string,
  originalHeadline: string,
): Promise<string[]> {
  try {
    const prompt = `You are an expert copywriter. Generate 3 alternative headlines for this article.

Original Headline: "${originalHeadline}"

Content: ${content.substring(0, 500)}...

Provide exactly 3 alternative headlines (one per line, no numbers or bullets). They should be:
- Compelling and attention-grabbing
- Accurate to the content
- SEO-friendly
- Different in tone from the original

Return ONLY the 3 headlines.`;

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

    const text =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .slice(0, 3);
  } catch (error) {
    console.error('Error generating alternative headlines:', error);
    return [];
  }
}
