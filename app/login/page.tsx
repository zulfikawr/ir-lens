'use client';

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User profile creation is handled by AuthContext or we can do it here if it's a new user,
      // but for login we assume user exists or we just let AuthContext handle fetching.
      // However, if we want to ensure 'users' entry exists for every logged in user:
      // We might want to do that in a signup flow, but here we just login.
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className='min-h-screen mx-auto px-4 md:px-8 py-16'>
      <div className='mb-16 text-center'>
        <div className='flex items-center justify-center mb-6'>
          <div className='w-16 h-px bg-black'></div>
          <LogIn className='mx-4 w-8 h-8' />
          <div className='w-16 h-px bg-black'></div>
        </div>
        <h1 className='text-4xl font-bold'>Login</h1>
      </div>
      <form
        onSubmit={handleLogin}
        className='bg-white text-black p-8 border border-black shadow-lg max-w-sm w-full mx-auto'
      >
        <div className='mb-4'>
          <Label htmlFor='email' className='mb-1'>
            Email
          </Label>
          <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-2 border text-sm'
            placeholder='admin@example.com'
            required
          />
        </div>
        <div className='mb-6'>
          <Label htmlFor='password' className='mb-1'>
            Password
          </Label>
          <Input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-2 border text-sm'
            placeholder='Your password'
            required
          />
        </div>
        <Button type='submit' className='w-full py-2 px-4'>
          Login
        </Button>
        {error && <p className='text-red-600 text-sm'>{error}</p>}
      </form>
    </div>
  );
}
