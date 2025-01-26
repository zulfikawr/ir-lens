"use client"

import { useArticleContext } from "@/hooks/useArticleContext"
import Link from "next/link"
import Image from "next/image"
import { useRef, useState, useEffect, useMemo } from "react"
import Pagination from "@/components/Pagination"
import Loading from "@/components/Articles/loading"

export default function ExperimentalNewspaper() {
  const { data } = useArticleContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [activeCard, setActiveCard] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null)

  const articlesPerPage = 10

  const allArticles = useMemo(() => {
    if (!data.length) return []
    return data.flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [data])

  const totalPages = useMemo(() => Math.ceil(allArticles.length / articlesPerPage), [allArticles])

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = useMemo(
    () => allArticles.slice(indexOfFirstArticle, indexOfLastArticle),
    [allArticles, indexOfFirstArticle, indexOfLastArticle],
  )

  const featuredArticles = useMemo(() => allArticles.slice(0, 3), [allArticles])

  useEffect(() => {
    if (!isHovering) {
      transitionTimerRef.current = setInterval(() => {
        setActiveCard((prevActiveCard) => (prevActiveCard + 1) % 3)
      }, 5000)
    }

    return () => {
      if (transitionTimerRef.current) {
        clearInterval(transitionTimerRef.current)
      }
    }
  }, [isHovering])

  const handleCardHover = (index: number) => {
    setActiveCard(index)
    setIsHovering(true)

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }

    hoverTimerRef.current = setTimeout(() => {
      setIsHovering(false)
    }, 5000)
  }

  const handleCardLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }
    setIsHovering(false)
  }

  if (!data.length) {
    return <Loading />
  }

  return (
    <div className="relative min-h-screen p-4 md:p-8 lg:p-12">
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
        <div className="space-y-8">
          <header className="relative pb-4 border-b border-neutral-300">
            <div className="flex justify-between items-end">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight group">
                <span className="relative">
                  Articles
                  <span className="absolute bottom-0 right-0 w-full h-0.5 bg-neutral-800 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </span>
              </h1>
              <p className="text-xs md:text-sm text-neutral-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </header>

          <div className="relative h-[560px] w-full">
            {featuredArticles.map((article, index) => (
              <article
                key={article.title}
                className={`absolute w-full transition-all duration-500 ease-in-out 
                  bg-white shadow-xl border border-neutral-200 p-6 overflow-hidden
                  cursor-pointer rounded-lg
                  ${index === activeCard ? "z-30 opacity-100 -translate-x-4 -translate-y-4" : ""}
                  ${index === (activeCard + 1) % 3 ? "translate-x-4 translate-y-4" : "z-20"}
                  ${index === (activeCard + 2) % 3 ? "translate-x-0 translate-y-0" : "z-10"}`}
                style={{
                  height: "500px",
                  transitionDelay: `${index * 50}ms`,
                }}
                onClick={() => handleCardHover(index)}
                onMouseEnter={() => handleCardHover(index)}
                onMouseLeave={handleCardLeave}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full max-h-[468px] overflow-hidden">
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.labels.slice(0, 3).map((label, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 border border-neutral-400 text-neutral-700 rounded-full"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                      <Link href={`/articles/${article.slug}`} className="group">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-4 relative inline-block hover:underline">
                          {article.title}
                        </h2>
                      </Link>
                      <p className="text-sm md:text-base text-neutral-600 line-clamp-4">{article.description}</p>
                    </div>
                    <div className="text-xs text-neutral-500 flex justify-between items-center mt-4">
                      <span>{article.date}</span>
                      <span>{article.location}</span>
                    </div>
                  </div>
                  <Link href={`/articles/${article.slug}`}>
                    <div className="aspect-[3/4] relative group overflow-hidden rounded-lg">
                      <Image
                        src={article.coverImage || "/placeholder.svg"}
                        alt={article.coverImageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                    </div>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="hidden lg:block space-y-8">
          <div className="bg-white border border-neutral-200 p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-light border-b border-neutral-300 pb-2 mb-4">Trending</h2>
            <ul className="space-y-4">
              {allArticles.slice(0, 5).map((article, index) => (
                <li key={article.title} className="pb-4 border-b last:border-b-0 border-neutral-200">
                  <Link href={`/articles/${article.slug}`} className="group flex items-center">
                    <span className="text-2xl font-thin text-neutral-300 mr-4">{index + 1}</span>
                    <div>
                      <h3 className="text-sm font-light group-hover:text-neutral-600 transition-colors relative inline-block hover:underline">
                        {article.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">{article.date}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-8 lg:p-12">
        {currentArticles.slice(3).map((article) => (
          <article
            key={article.title}
            className="bg-white border border-neutral-200 p-4 shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group rounded-lg"
          >
            <Link href={`/articles/${article.slug}`}>
              <div className="aspect-video relative mb-4 overflow-hidden rounded-lg">
                <Image
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.coverImageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {article.labels.slice(0, 3).map((label, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 border border-neutral-400 text-neutral-700 rounded-full">
                    {label}
                  </span>
                ))}
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2 relative inline-block hover:underline">
                {article.title}
              </h3>
              <p className="text-xs text-neutral-600 line-clamp-2">{article.description}</p>
            </Link>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="relative z-10 max-w-7xl mx-auto mt-8 pt-8 border-t border-neutral-300">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollOffset={40}
            targetRef={sectionRef}
          />
        </div>
      )}
    </div>
  )
}