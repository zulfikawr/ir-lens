import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import menu from '@/json/menu.json';

export default function Footer() {
  return (
    <footer className='border-t border-white bg-black text-white'>
      <div className='px-4 md:px-8 py-12 md:py-16'>
        <div className='flex items-center mb-12'>
          <div className='flex-1 h-px bg-white'></div>
          <Link href='/'>
            <div className='mx-8 px-4 py-2 border border-white hover:bg-white hover:text-black transition duration-300 cursor-pointer'>
              <span>IR Lens</span>
            </div>
          </Link>
          <div className='flex-1 h-px bg-white'></div>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='text-lg md:text-xl font-bold mb-4'>About Us</h3>
            <ul className='space-y-2'>
              {menu.footerLinks.about.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className='text-sm md:text-md hover:underline'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className='text-lg md:text-xl font-bold mb-4'>Sections</h3>
            <ul className='space-y-2'>
              {menu.footerLinks.sections.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className='text-sm md:text-md hover:underline'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className='text-lg md:text-xl font-bold mb-4'>Connect</h3>
            <ul className='space-y-2'>
              {menu.footerLinks.connect.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className='text-sm md:text-md hover:underline'
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className='text-lg md:text-xl font-bold mb-4'>Subscribe</h3>
            <p className='text-sm md:text-md mb-2'>
              Stay informed with our daily updates
            </p>
            <form className='space-y-2'>
              <Input
                type='email'
                placeholder='Your email address'
                className='mb-1 text-black'
              />
              <Button type='submit' className='w-full border-white h-9'>
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className='mt-8 pt-8 border-t text-center text-sm text-muted-foreground'>
          <p>&copy; 2025 IR Lens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
