"use client"

import { useState, useEffect } from "react"
import { useArticleContext } from "@/hooks/useArticleContext"
import type { ArticleType } from "@/types/article"
import Loading from "./loading"
import NewsTicker from "@/components/Home/NewsTicker/NewsTicker"
import LatestArticle from "@/components/Home/LatestArticle/LatestArticle"
import MasonryArticle from "@/components/Home/MasonryArticle/MasonryArticle"
import Sidebar from "@/components/Home/Sidebar/Sidebar"
import ScrollToTop from "@/components/ScrollToTop"
import RegionalFocus from "./RegionalFocus/RegionalFocus"
import NewsletterSubscription from "@/components/Home/NewsletterSubscription/NewsletterSubscription"

const HomeSection = () => {
  const { data } = useArticleContext()
  const [articles, setArticles] = useState<{
    latest: ArticleType["articles"]
    remaining: ArticleType["articles"]
  }>({
    latest: [],
    remaining: [],
  })

  useEffect(() => {
    if (data.length) {
      const sortedArticles = data.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })

      const latest = sortedArticles.slice(0, 3)
      const remaining = sortedArticles.slice(4)

      setArticles({ latest, remaining })
    }
  }, [data])

  if (!data || !data.length) {
    return <Loading />
  }

  return (
    <div className="py-8">
      <NewsTicker />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12 md:space-y-2">
          <LatestArticle articles={articles.latest} />
          <MasonryArticle articles={articles.remaining} />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-8">
          <Sidebar articles={articles.remaining} />
        </div>
      </div>

      <div className="mt-8">
        <RegionalFocus />
      </div>

      <NewsletterSubscription />

      <ScrollToTop />
    </div>
  )
}

export default HomeSection