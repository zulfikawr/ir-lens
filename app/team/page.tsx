'use client';

import Link from 'next/link';

export default function TeamPage() {
  return (
    <div className='min-h-screen bg-white text-black p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          {/* Left Column */}
          <div className='space-y-8'>
            <h1 className='text-5xl font-bold tracking-tight'>
              Editorial Team
            </h1>
            <p className='text-lg leading-relaxed'>
              IR Lens is a one-person operation, managed entirely by Muhammad
              Zulfikar. As the sole curator, editor, and developer, I am deeply
              committed to delivering high-quality content that reflects the
              complexities of international relations. My academic background
              and passion for global affairs drive the vision of this platform.
            </p>
            <Link
              href='/'
              className='inline-block text-sm underline hover:no-underline'
            >
              Back to Home
            </Link>
          </div>

          {/* Right Column */}
          <div className='bg-black text-white p-8 border border-black'>
            <h2 className='text-3xl font-bold mb-6'>About Muhammad Zulfikar</h2>
            <ul className='space-y-4'>
              <li className='text-lg'>
                <span className='font-semibold'>Role:</span> Curator, Editor,
                Developer
              </li>
              <li className='text-lg'>
                <span className='font-semibold'>Background:</span> 6th-semester
                International Relations student in Indonesia.
              </li>
              <li className='text-lg'>
                <span className='font-semibold'>Focus:</span> Diplomacy,
                Economy, Conflicts, and Climate.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
