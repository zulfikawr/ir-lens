'use client';

import type React from 'react';
import type { TextBlockTypes } from '@/types/contentBlocks';
import { renderPlaceholder } from '@/utils/blockUtils';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, Link, Strikethrough } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface TextBlockProps {
  block: TextBlockTypes;
  isEditing?: boolean;
  onUpdateBlock?: (updates: Partial<TextBlockTypes>) => void;
}

interface ToolbarButtonProps {
  icon: React.ElementType;
  command: string;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  command,
  active,
  onClick,
}) => (
  <Button
    variant='ghost'
    size='sm'
    onMouseDown={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className={active ? 'bg-black text-white' : ''}
  >
    <Icon className='w-4 h-4' />
  </Button>
);

const cleanHtml = (html: string): string => {
  return html
    .replace(/(<div>(\s*<br>\s*)*<\/div>)+/g, '<br>')
    .replace(/(<br\s*\/?>)+/g, '<br>')
    .replace(/<div>(.*?)<\/div>/g, '$1')
    .trim()
    .replace(/(<br\s*\/?>)+$/, '');
};

export const TextBlock: React.FC<TextBlockProps> = ({
  block,
  isEditing = false,
  onUpdateBlock,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [activeStyles, setActiveStyles] = useState<Set<string>>(new Set());
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);
  const savedContent = useRef<string>('');

  useEffect(() => {
    if (editorRef.current && block.text) {
      editorRef.current.innerHTML = block.text;
      savedContent.current = block.text;
    }
  }, [block.text]);

  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    if (savedSelection.current && editorRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedSelection.current);
      editorRef.current.focus();
    }
  }, []);

  const checkActiveStyles = useCallback(() => {
    const styles = new Set<string>();
    if (document.queryCommandState('bold')) styles.add('bold');
    if (document.queryCommandState('italic')) styles.add('italic');
    if (document.queryCommandState('underline')) styles.add('underline');
    if (document.queryCommandState('strikeThrough'))
      styles.add('strikethrough');

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentElement = range.startContainer.parentElement;
      if (parentElement && parentElement.closest('a')) {
        styles.add('link');
      }
    }

    setActiveStyles(styles);
  }, []);

  const updateContent = useCallback(() => {
    if (editorRef.current) {
      const cleanedHtml = cleanHtml(editorRef.current.innerHTML);
      if (cleanedHtml !== savedContent.current) {
        savedContent.current = cleanedHtml;
        onUpdateBlock?.({ text: cleanedHtml });
      }
    }
  }, [onUpdateBlock]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleSelectionChange = () => {
      if (document.activeElement === editor) {
        saveSelection();
        checkActiveStyles();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [saveSelection, checkActiveStyles]);

  const execCommand = useCallback(
    (command: string, value = '') => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection?.toString() && command !== 'createLink') {
        const tempText = document.createTextNode('\u200B');
        const range = document.createRange();

        if (selection?.rangeCount === 0) {
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          selection?.addRange(range);
        }

        selection?.getRangeAt(0).insertNode(tempText);
        range.selectNode(tempText);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      document.execCommand(command, false, value);
      checkActiveStyles();
      editorRef.current.focus();
    },
    [checkActiveStyles],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.execCommand('insertLineBreak');
        return;
      }

      if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        execCommand('bold');
      } else if (e.key === 'i' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        execCommand('italic');
      } else if (e.key === 'u' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        execCommand('underline');
      }
    },
    [execCommand],
  );

  const insertLink = useCallback(() => {
    if (linkUrl.trim()) {
      if (savedSelection.current) {
        restoreSelection();
        const range = savedSelection.current;
        const selectedText = range.toString();

        if (selectedText) {
          document.execCommand('createLink', false, linkUrl);
        } else {
          const existingLink = range.startContainer.parentElement;
          if (existingLink && existingLink.tagName === 'A') {
            existingLink.setAttribute('href', linkUrl);
          } else {
            document.execCommand('createLink', false, linkUrl);
          }
        }

        setLinkUrl('');
        setIsLinkPopoverOpen(false);

        setTimeout(() => {
          checkActiveStyles();
        }, 100);
      }
    }
  }, [linkUrl, restoreSelection, checkActiveStyles]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (!isLinkPopoverOpen) {
      savedSelection.current = null;
    }
    updateContent();
  }, [isLinkPopoverOpen, updateContent]);

  if (!isEditing) {
    const processedHTML = block.text
      .replace(
        /<a /g,
        '<a style="text-decoration: underline;" target="_blank" rel="noopener noreferrer" ',
      )
      .replace(/<(b|strong)>/g, '<span style="font-weight: bold;">')
      .replace(/<\/(b|strong)>/g, '</span>')
      .replace(/<(u|ins)>/g, '<span style="text-decoration: underline;">')
      .replace(/<\/(u|ins)>/g, '</span>')
      .replace(
        /<(s|del|strike)>/g,
        '<span style="text-decoration: line-through;">',
      )
      .replace(/<\/(s|del|strike)>/g, '</span>');

    return (
      <div
        className='my-6 text-md md:text-lg'
        dangerouslySetInnerHTML={{ __html: processedHTML }}
      />
    );
  }

  return (
    <div className='relative'>
      <style>{`
        .w-full.text-gray-800.text-md.md\\:text-lg.focus\\:outline-none.min-h-\\[1\\.5em\\].prose.prose-lg.max-w-none a {
          text-decoration: underline;
        }
      `}</style>
      <div className='mb-2 flex items-center gap-1 border-b'>
        <ToolbarButton
          icon={Bold}
          command='bold'
          active={activeStyles.has('bold')}
          onClick={() => execCommand('bold')}
        />
        <ToolbarButton
          icon={Italic}
          command='italic'
          active={activeStyles.has('italic')}
          onClick={() => execCommand('italic')}
        />
        <ToolbarButton
          icon={Underline}
          command='underline'
          active={activeStyles.has('underline')}
          onClick={() => execCommand('underline')}
        />
        <ToolbarButton
          icon={Strikethrough}
          command='strikeThrough'
          active={activeStyles.has('strikethrough')}
          onClick={() => execCommand('strikeThrough')}
        />
        <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
              }}
              className={activeStyles.has('link') ? 'bg-black text-white' : ''}
            >
              <Link className='w-4 h-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80 p-2'>
            <div className='flex gap-2'>
              <Input
                type='url'
                placeholder='Enter URL'
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && insertLink()}
                className='h-10'
              />
              <Button
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertLink();
                }}
                className='h-10'
              >
                Set
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className='w-full text-gray-800 text-md md:text-lg focus:outline-none min-h-[1.5em] prose prose-lg max-w-none'
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onMouseUp={() => {
          saveSelection();
          checkActiveStyles();
        }}
      />

      {renderPlaceholder(isFocused, editorRef.current?.textContent || '') && (
        <span className='absolute top-10 left-0 text-gray-400 pointer-events-none'>
          Text...
        </span>
      )}
    </div>
  );
};
