"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import type { ArticleType } from "@/types/article"
import { Button } from "@/components/ui/button"

interface LatestArticleProps {
  articles: ArticleType["articles"]
}

const LatestArticle = ({ articles }: LatestArticleProps) => {
  const [activeCard, setActiveCard] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setActiveCard((prevActiveCard) => (prevActiveCard + 1) % 3)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isHovering])

  const handleCardHover = (index: number) => {
    setActiveCard(index)
    setIsHovering(true)
  }

  const handleCardLeave = () => {
    setIsHovering(false)
  }

  return (
    <div className="relative h-[600px] md:h-[560px] w-full pr-4 mx-auto mt-6 scale-95">
      {articles.slice(0, 3).map((article, index) => (
        <article
          key={article.slug}
          className={`absolute w-full transition-all duration-500 ease-in-out 
            bg-white shadow-xl border border-black overflow-hidden h-[600px] md:h-[500px]
            ${index === activeCard ? "z-30 opacity-100 -translate-x-4 -translate-y-4" : ""}
            ${index === (activeCard + 1) % 3 ? "translate-x-0 translate-y-0" : "z-10"}
            ${index === (activeCard + 2) % 3 ? "translate-x-4 translate-y-4" : "z-20"}`}
          style={{
            transitionDelay: `${index * 50}ms`,
          }}
          onMouseEnter={() => handleCardHover(index)}
          onMouseLeave={handleCardLeave}
        >
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-full">
          <div className="col-span-5 min-h-[200px] lg:min-h-[400px] h-auto">
            <Link href={`/articles/${article.slug}`} className="block h-full">
              <div className="relative w-full h-full transition-all duration-500 grayscale hover:grayscale-0">
                <Image
                  src={article.coverImage || "/images/default-fallback-image.png"}
                  alt={article.coverImageAlt || "Article cover image"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Link>
          </div>

          <div className="col-span-5 flex flex-col h-auto px-4 md:px-2 md:py-6">
            {/* Article Card */}
            <div className="flex flex-col h-full space-y-4">
              {/* Labels */}
              {Array.isArray(article.labels) && article.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 md:gap-2">
                  {article.labels.map((label, index) => (
                    <Link key={index} href={`/tags/${label}`}>
                      <Button size="sm" className="text-xs md:text-sm">
                        {label}
                      </Button>
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <Link href={`/articles/${article.slug}`}>
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-black hover:underline transition-all">
                  {article.title}
                </h2>
              </Link>

              {/* Description */}
              <p className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-4">
                {article.description}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-500 text-sm mb-6">
              <time dateTime={article.date} className="italic">
                {article.date}
              </time>
              <span>|</span>
              <p>{article.location}</p>
            </div>

            {/* Read More Button */}
            <Link href={`/articles/${article.slug}`}>
              <Button className="mb-4 md:mb-0">Read More</Button>
            </Link>
          </div>
        </div>

        </article>
      ))}
    </div>
  )
}

export default LatestArticle

