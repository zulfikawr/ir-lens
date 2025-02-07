// contexts/BlockContext.tsx
import React, { createContext, useContext, useCallback, useState } from 'react';
import type { ContentBlock } from '@/types/contentBlocks';
import { createNewBlock } from '@/utils/blockUtils';

interface BlockContextType {
  blocks: ContentBlock[];
  addBlock: (type: ContentBlock['type'], index?: number) => void;
  updateBlock: (index: number, updates: Partial<ContentBlock>) => void;
  removeBlock: (index: number) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  duplicateBlock: (index: number) => void;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

interface BlockProviderProps {
  initialBlocks: ContentBlock[];
  children: React.ReactNode;
}

export const BlockProvider: React.FC<BlockProviderProps> = ({ initialBlocks, children }) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);

  const addBlock = useCallback((type: ContentBlock['type'], index?: number) => {
    const newBlock = createNewBlock(type);
    setBlocks((prevBlocks) => {
      const newBlocks = [...prevBlocks];
      if (index !== undefined) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }
      return newBlocks;
    });
  }, []);

  const updateBlock = useCallback((index: number, updates: Partial<ContentBlock>) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block, i) => 
        i === index ? { ...block, ...updates } as ContentBlock : block
      ),
    );
  }, []);  

  const removeBlock = useCallback((index: number) => {
    setBlocks((prevBlocks) => prevBlocks.filter((_, i) => i !== index));
  }, []);

  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks((prevBlocks) => {
      const newBlocks = [...prevBlocks];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      return newBlocks;
    });
  }, []);

  const duplicateBlock = useCallback((index: number) => {
    setBlocks((prevBlocks) => {
      const newBlocks = [...prevBlocks];
      const blockToDuplicate = { ...prevBlocks[index] };
      newBlocks.splice(index + 1, 0, blockToDuplicate);
      return newBlocks;
    });
  }, []);

  return (
    <BlockContext.Provider
      value={{ blocks, addBlock, updateBlock, removeBlock, moveBlock, duplicateBlock }}
    >
      {children}
    </BlockContext.Provider>
  );
};

export const useBlockContext = () => {
  const context = useContext(BlockContext);
  if (!context) {
    throw new Error('useBlockContext must be used within a BlockProvider');
  }
  return context;
};