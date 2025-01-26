import articlesData from "../../json/articles.json";
import { ArticleType } from "@/types/article";

export async function getArticles(): Promise<ArticleType["articles"]> {
  return articlesData.articles as ArticleType["articles"];
}
