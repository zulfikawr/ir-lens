"use client"

import { useArticleContext } from "@/hooks/useArticleContext"
import Image from "next/image"
import Link from "next/link"
import { useState, useRef } from "react"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Pagination from "../../Pagination"

const RegionalFocus = () => {
  const { data } = useArticleContext()
  const [selectedRegion, setSelectedRegion] = useState("Asia")
  const [currentPage, setCurrentPage] = useState(1)

  const sectionRef = useRef<HTMLDivElement>(null)

  const regions = ["Asia", "Europe", "Middle East", "Africa", "Americas"]

  const articlesPerPage = 12

  const filteredArticles = data
    .filter((article) => article.labels.includes(selectedRegion))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)

  const paginatedArticles = filteredArticles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage)

  return (
    <section className="my-16" ref={sectionRef}>
      {/* Section Header */}
      <div className="border-t border-black py-6 mt-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Regional Focus</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-sm md:text-base">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region)
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 border border-black transition-colors
                  ${
                    region === selectedRegion
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-black hover:text-white"
                  }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 border border-black">
          <p className="text-xl">No articles available for {selectedRegion}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedArticles.map((article) => (
            <article
              key={article.title}
              className="bg-white border border-black shadow-md transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group"
            >
              <Link href={`/articles/${article.slug}`}>
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={article.coverImage || "/placeholder.svg"}
                    alt={article.coverImageAlt}
                    fill
                    className="object-cover transition-transform duration-500 grayscale group-hover:grayscale-0"
                  />
                </div>
                <div className="p-2 md:p-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.labels.map((label: string, index: number) => (
                      <Link key={index} href={`/tags/${label}`}>
                        <Button size="sm" className="text-xs">
                          {label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-2 relative hover:underline line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-2">{article.description}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          scrollOffset={40}
          targetRef={sectionRef}
        />
      </div>

      <div className="flex justify-center mt-8">
        <Link href={`/regions/${selectedRegion.toLowerCase()}`}>
          <button className="bg-black text-white hover:bg-white hover:text-black border hover:border-black px-4 py-2 transition-colors">
            See all {selectedRegion} articles
          </button>
        </Link>
      </div>
    </section>
  )
}

export default RegionalFocus;