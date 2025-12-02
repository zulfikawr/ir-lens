export interface FetchedArticle {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  urlToImage: string;
  source: string;
  content: string;
  url: string;
  tag?: string;
  region?: string;
}

export interface NewsSource {
  id: string;
  name: string;
}

export const NEWS_SOURCES: NewsSource[] = [
  { id: 'al-jazeera-english', name: 'Al Jazeera English' },
  { id: 'associated-press', name: 'Associated Press' },
];
