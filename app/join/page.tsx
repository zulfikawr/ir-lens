'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitApplication } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User2Icon } from 'lucide-react';
import PageTitle from '@/components/PageTitle/PageTitle';

export default function JoinPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitApplication({
        name,
        email,
        coverLetter,
      });

      toast({
        title: 'Application Submitted',
        description:
          'Thank you for applying! We will review your application shortly.',
      });

      // Reset form
      setName('');
      setEmail('');
      setCoverLetter('');

      // Optional: Redirect to home after a delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='mx-auto px-4 md:px-8 py-16'>
      <PageTitle
        icon={<User2Icon />}
        title='Join as a Contributor'
        description='Apply to become a contributor and share your insights with our community.'
      />

      <Card className='w-full max-w-md mx-auto'>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6 mt-6'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder='John Doe'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='john@example.com'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='coverLetter'>Cover Letter</Label>
              <Textarea
                id='coverLetter'
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
                placeholder='Tell us why you want to contribute...'
                className='min-h-[150px]'
              />
            </div>

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
