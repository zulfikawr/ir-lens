/**
 * Minimal content preparation - just pass to AI
 * AI will handle all cleaning
 */
export function preCleanContent(content: string): string {
  // Return raw content unchanged — AI will handle cleaning and structuring
  return content.trim();
}

/**
 * Minimal content cleaner
 */
export function cleanArticleContent(content: string): string {
  // No manual cleaning — leave content intact for AI
  return content.trim();
}

/**
 * Extract main content - just basic trimming
 */
export function extractMainContent(content: string): string {
  // Let AI handle all the work - just limit size
  return content.substring(0, 4000);
}
