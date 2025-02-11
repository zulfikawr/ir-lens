import { useState, useCallback, useEffect } from 'react';
import type { ArticleType } from '@/types/article';
import type { ContentBlock } from '@/types/contentBlocks';

export function useArticleState(initialArticle: ArticleType['articles'][0]) {
  const [article, setArticle] =
    useState<ArticleType['articles'][0]>(initialArticle);

  const updateArticle = useCallback(
    (updates: Partial<ArticleType['articles'][0]>) => {
      setArticle((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const addBlock = useCallback((newBlock: ContentBlock, index?: number) => {
    setArticle((prev) => {
      const newBlocks = [...prev.blocks];
      if (index !== undefined) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      return {
        ...prev,
        blocks: newBlocks,
      };
    });
  }, []);

  const updateBlock = useCallback(
    (index: number, updates: Partial<ContentBlock>) => {
      setArticle((prev) => ({
        ...prev,
        blocks: prev.blocks.map((block, i) => {
          if (i !== index) return block;
          return { ...block, ...updates } as ContentBlock;
        }),
      }));
    },
    [],
  );

  const removeBlock = useCallback((index: number) => {
    setArticle((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  }, []);

  return {
    article,
    updateArticle,
    addBlock,
    updateBlock,
    removeBlock,
  };
}
