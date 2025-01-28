import { useState, useCallback, useEffect } from "react"
import type { ArticleType, ContentBlock } from "@/types/article"

export function useArticleState(initialArticle: ArticleType["articles"][0]) {
  const [article, setArticle] = useState<ArticleType["articles"][0]>(() => {
    // If it's a new article (no id), check localStorage
    if (!initialArticle.id) {
      const savedArticle = localStorage.getItem("draftArticle")
      return savedArticle ? JSON.parse(savedArticle) : initialArticle
    }
    // For existing articles, use the initialArticle
    return initialArticle
  })

  useEffect(() => {
    // Only save to localStorage if it's a new article (no id)
    if (!article.id) {
      localStorage.setItem("draftArticle", JSON.stringify(article))
    }
  }, [article])

  const updateArticle = useCallback((updates: Partial<ArticleType["articles"][0]>) => {
    setArticle((prev) => ({ ...prev, ...updates }))
  }, [])

  const addBlock = useCallback((newBlock: ContentBlock) => {
    setArticle((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }))
  }, [])

  const updateBlock = useCallback((index: number, updates: Partial<ContentBlock>) => {
    setArticle((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block, i) => {
        if (i !== index) return block
        return { ...block, ...updates } as ContentBlock
      }),
    }))
  }, [])

  const removeBlock = useCallback((index: number) => {
    setArticle((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }))
  }, [])

  return {
    article,
    updateArticle,
    addBlock,
    updateBlock,
    removeBlock,
  }
}

