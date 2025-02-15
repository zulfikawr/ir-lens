import { getArticles } from '@/lib/database';
import EditArticlePage from '@/components/Article/ArticleEditor/edit/EditArticlePage';

export async function generateStaticParams() {
  const articles = await getArticles();

  return articles.map((article) => {
    const date = new Date(article.date);

    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      day: date.getDate().toString().padStart(2, '0'),
      slug: article.slug,
    };
  });
}

export default function Page() {
  return <EditArticlePage />;
}
