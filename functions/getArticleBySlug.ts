import { getArticles } from './getArticles';

export const getArticleBySlug = async (slug: string) => {
  const articles = await getArticles();

  const foundArticle = articles.find(
    (article) => article.slug === decodeURIComponent(slug),
  );

  return foundArticle;
};
