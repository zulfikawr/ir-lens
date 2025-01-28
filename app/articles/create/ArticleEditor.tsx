"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Eye, Save } from "lucide-react"
import { useArticleState } from "@/hooks/useArticleState"
import { ArticleHeader } from "./components/ArticleHeader"
import { ContentBlocks } from "./components/ContentBlocks"
import { createNewBlock } from "@/utils/blockUtils"
import { useToast } from "@/hooks/useToast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { ArticleType } from "@/types/article"

interface ArticleEditorProps {
  article: ArticleType["articles"][0]
}

export default function ArticleEditor({ article: initialArticle }: ArticleEditorProps) {
  const { article, updateArticle, addBlock, updateBlock, removeBlock } = useArticleState(initialArticle)
  const { toast } = useToast()

  const handleSaveConfirm = async () => {
    const isNew = !article.id
    const url = isNew ? "/api/article/create" : "/api/article/update"
    const method = isNew ? "POST" : "PUT"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      })

      if (response.ok) {
        toast({
          description: isNew ? "Article created successfully!" : "Article updated successfully!",
          duration: 2000,
        })
        if (isNew) {
          localStorage.removeItem("draftArticle")
        }
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to save the article.")
      }
    } catch (error) {
      console.error("Error saving article:", error)
      toast({
        description: "Error saving article!",
        duration: 2000,
        variant: "destructive",
      })
    }
  }

  const handlePreview = () => {
    const previewWindow = window.open(`/articles/preview/${article.slug}`, "_blank")
    if (previewWindow) {
      previewWindow.articleData = article
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="top-0 bg-white py-4 space-x-4 flex justify-end items-center border-b mb-8">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Article</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to save this article? Make sure you've reviewed all changes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveConfirm}>Save</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button onClick={handlePreview} className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Preview
        </Button>
      </div>

      <ArticleHeader article={article} onUpdate={updateArticle} />

      <ContentBlocks
        blocks={article.blocks}
        onAddBlock={(type) => addBlock(createNewBlock(type))}
        onUpdateBlock={updateBlock}
        onRemoveBlock={removeBlock}
        updateArticle={updateArticle}
      />
    </div>
  )
}

