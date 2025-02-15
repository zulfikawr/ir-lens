'use client';

import { useState, useEffect } from 'react';
import { LinkPreview } from '@/components/LinkPreview/LinkPreview';

interface Block {
  text: string;
}

interface ProcessedHTMLProps {
  block: Block;
  isEditing: boolean;
}

export function ProcessedHTML({ block, isEditing }: ProcessedHTMLProps) {
  const [processedHTML, setProcessedHTML] = useState('');

  useEffect(() => {
    if (!isEditing) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(block.text, 'text/html');

      doc.querySelectorAll('a').forEach((a) => {
        const href = a.getAttribute('href');
        if (href) {
          const wrapper = doc.createElement('span');
          wrapper.setAttribute('data-link-preview', href);
          wrapper.innerHTML = a.outerHTML;
          a.parentNode?.replaceChild(wrapper, a);
        }
      });

      const elementsToStyle = {
        'b,strong': 'font-weight: bold;',
        'u,ins': 'text-decoration: underline;',
        's,del,strike': 'text-decoration: line-through;',
      };

      Object.entries(elementsToStyle).forEach(([selector, style]) => {
        doc.querySelectorAll(selector).forEach((el) => {
          const span = doc.createElement('span');
          span.style.cssText = style;
          span.innerHTML = el.innerHTML;
          el.parentNode?.replaceChild(span, el);
        });
      });

      setProcessedHTML(doc.body.innerHTML);
    }
  }, [block.text, isEditing]);

  if (isEditing) {
    return null;
  }

  return (
    <div className='my-6 text-md md:text-lg'>
      {processedHTML
        .split(/(<span data-link-preview="[^"]+">.*?<\/span>)/)
        .map((part, index) => {
          const match = part.match(
            /<span data-link-preview="([^"]+)">(.*?)<\/span>/,
          );
          if (match) {
            const [, href, content] = match;
            return (
              <LinkPreview key={index} href={href}>
                {content}
              </LinkPreview>
            );
          }
          return (
            <span key={index} dangerouslySetInnerHTML={{ __html: part }} />
          );
        })}
    </div>
  );
}
