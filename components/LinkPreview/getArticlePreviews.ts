'use server';

import type { ArticleType } from '@/types/article';

export async function getArticlePreview(url: string) {
  try {
    const slug = url.split('/').pop();

    const res = await fetch(`https://ir-lens.vercel.app/api/article/${slug}`);
    const data = (await res.json()) as ArticleType;

    const article = data.articles.find((a) => a.slug === slug);

    if (!article) {
      return null;
    }

    return {
      title: article.title,
      description: article.description,
      slug: article.slug,
      image: article.coverImg,
      date: article.date,
      location: article.location,
      tag: article.tag,
      region: article.region,
    };
  } catch (error) {
    console.error('Failed to fetch article preview:', error);
    return null;
  }
}
