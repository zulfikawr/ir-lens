import Link from "next/link";
import Image from "next/image";
import { ArticleType } from "@/types/article";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  articles: ArticleType["articles"];
}

const Sidebar = ({ articles }: SidebarProps) => {
  const allowedTags = ["Diplomacy", "Conflicts", "Economy", "Climate"];

  const tags = articles.reduce((acc, article) => {
    article.labels.forEach((label) => {
      if (allowedTags.includes(label)) {
        acc[label] = (acc[label] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const latestTagArticles = allowedTags
    .map(tag => articles.find(article => article.labels.includes(tag)))
    .filter((article): article is Exclude<typeof article, undefined> => !!article);

  return (
    <div className="sticky top-8">
      <div className="p-6 mt-5 mb-8 border border-black shadow-sm">
        <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-black">
          Quick Headlines
        </h2>
        <div className="space-y-6">
          {latestTagArticles.map((article) => (
            <article key={article.slug} className="flex items-start gap-4">
              <div className="w-20 h-20 flex-shrink-0">
                <div className="relative w-full h-full">
                  <Link href={`/articles/${article.slug}`}>
                    <Image 
                      src={article.coverImage} 
                      alt={article.coverImageAlt || article.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      fill
                      className="absolute inset-0 object-cover object-center transition-all duration-500 grayscale hover:grayscale-0"
                    />
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {article.labels
                      .filter(label => allowedTags.includes(label))
                      .map(label => (
                        <Link key={label} href={`/tags/${label}`}>
                          <Button size="sm" text="small">
                            {label}
                          </Button>
                        </Link>
                      ))}
                  </div>
                  <time className="text-xs text-gray-500 -mt-1" dateTime={article.date}>
                    {article.date}
                  </time>
                </div>
                <Link href={`/articles/${article.slug}`}>
                  <h3 className="font-bold hover:underline line-clamp-2">{article.title}</h3>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="bg-black text-white p-6">
        <h2 className="text-2xl font-bold mb-4 pb-4 border-b border-white">Tags</h2>
        <div className="space-y-2">
          {Object.entries(tags).map(([label, count]) => (
            <div key={label} className="flex items-center justify-between">
              <Link href={`/tags/${label}`} className="hover:underline">
                {label}
              </Link>
              <span className="bg-white text-black px-3 py-1 text-sm">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;