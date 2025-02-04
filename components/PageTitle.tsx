import React, { ReactElement } from 'react';

interface PageTitleProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export default function PageTitle({
  icon,
  title,
  description,
}: PageTitleProps) {
  return (
    <div className='mb-20 text-center'>
      <div className='flex items-center justify-center mb-6'>
        <div className='w-16 h-px bg-black'></div>
        <div className='mx-4 w-8 h-8 flex items-center justify-center'>
          {React.isValidElement(icon)
            ? React.cloneElement(icon as ReactElement, { className: 'w-8 h-8' })
            : icon}
        </div>
        <div className='w-16 h-px bg-black'></div>
      </div>
      <h1 className='text-4xl font-bold mb-4 text-black'>{title}</h1>
      <p className='text-gray-700 max-w-2xl mx-auto'>{description}</p>
    </div>
  );
}
