'use client';

import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          preferences: {
            frequency: 'instant',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.errors?.email || 'Subscription failed',
        );
      }

      setStatus('success');
      setEmail('');
      toast({
        description:
          "Thank you for subscribing! You'll receive updates when new articles are published.",
        duration: 3000,
      });
    } catch (error) {
      setStatus('error');
      const errorMsg =
        error instanceof Error ? error.message : 'Subscription failed';
      setErrorMessage(errorMsg);
      toast({
        description: errorMsg,
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  return (
    <section className='my-16 pb-16'>
      <div className='w-full max-w-5xl mx-auto'>
        <div className='flex items-center mb-12'>
          <div className='flex-1 h-px bg-black'></div>
          <Mail className='mx-8 w-8 h-8' />
          <div className='flex-1 h-px bg-black'></div>
        </div>

        <div className='text-center mb-8'>
          <h2 className='text-4xl font-bold mb-4'>Stay Informed</h2>
          <p className='text-gray-600 max-w-2xl mx-auto text-sm md:text-base'>
            Subscribe to our weekly newsletter for in-depth analysis of global
            affairs, regional developments, and exclusive insights from
            diplomatic correspondents.
          </p>
        </div>

        <div className='max-w-xl mx-auto'>
          <form onSubmit={handleSubmit} className='relative'>
            <div className='flex'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email address'
                className='flex-1 p-4 border border-black focus:outline-none
                        bg-white text-black placeholder:text-gray-500 text-sm md:text-base'
                disabled={status === 'loading' || status === 'success'}
              />
              <button
                type='submit'
                disabled={status === 'loading' || status === 'success'}
                className='px-8 bg-black text-white border border-black border-l-0
                        hover:bg-white hover:text-black transition-colors
                        disabled:bg-gray-200 disabled:border-gray-200 disabled:cursor-not-allowed text-sm md:text-base'
              >
                {status === 'loading' ? (
                  <Loader2 className='w-full h-5 animate-spin' />
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </form>

          <p className='text-xs text-gray-500 text-center mt-8'>
            By subscribing, you agree to receive our newsletter. We respect your
            privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;
