'use client';

import { useState, useEffect } from 'react';

const AboutPage = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const sections = [
    {
      title: 'Our Mission',
      content:
        'At IR Lens, we provide a clear, insightful, and reliable perspective on international relations. Our goal is to bridge the gap between complex global issues and our readers.',
    },
    {
      title: 'Our Focus',
      content:
        'We delve into topics such as diplomacy, economy, conflicts, and climate. Our articles are sourced from trusted outlets like AP News and Al Jazeera to ensure accuracy and relevance.',
    },
    {
      title: 'Why IR Lens?',
      content:
        'We prioritize reliability, accessibility, and a fresh perspective on global issues. Every article is handpicked to present a well-rounded view of the world.',
    },
  ];

  useEffect(() => {
    if (!isHovering && sections.length > 0) {
      const interval = setInterval(() => {
        setActiveCard(
          (prevActiveCard) => (prevActiveCard + 1) % sections.length,
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovering, sections.length]);

  const handleCardHover = (index: number) => {
    setActiveCard(index);
    setIsHovering(true);
  };

  const handleCardLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='h-[400px] w-full max-w-2xl mx-auto scale-95 relative'>
        {sections.map((section, index) => (
          <article
            key={index}
            className={`absolute w-full transition-all duration-500 ease-in-out 
              bg-white shadow-xl border border-black overflow-hidden h-[400px]
              ${index === activeCard ? 'z-30 opacity-100 -translate-x-4 -translate-y-4' : ''} 
              ${index === (activeCard + 1) % sections.length ? 'translate-x-0 translate-y-0' : 'z-10'} 
              ${index === (activeCard + 2) % sections.length ? 'translate-x-4 translate-y-4' : 'z-20'}`}
            onMouseEnter={() => handleCardHover(index)}
            onMouseLeave={handleCardLeave}
          >
            <div className='flex flex-col justify-center h-full px-6'>
              <h2 className='text-4xl font-bold mb-4'>{section.title}</h2>
              <p className='text-lg leading-relaxed text-neutral-400'>
                {section.content}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
