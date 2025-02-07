export function getArticleUrl(article: { date: string; slug: string }) {
  const date = new Date(article.date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `/articles/${year}/${month}/${day}/${article.slug}`;
}

export function parseArticleUrlSegments(segments: string[]) {
  const [year, month, day, slug] = segments;
  return {
    year,
    month,
    day,
    slug,
  };
}
