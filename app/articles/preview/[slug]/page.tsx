import ArticlePreviewPage from '@/components/Article/ArticlePreview';
import { getArticles } from '@/lib/database';

export async function generateStaticParams() {
  const articles = await getArticles();

  return articles.map((article) => ({
    year: article.date.split('-')[0],
    month: article.date.split('-')[1],
    day: article.date.split('-')[2],
    slug: article.slug,
  }));
}

export default function Page() {
  return <ArticlePreviewPage />;
}
