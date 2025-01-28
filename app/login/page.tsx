'use client';

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();
  const database = getDatabase();

  const markUserAsAdmin = (uid: string) => {
    const adminRef = ref(database, 'admins/' + uid);
    set(adminRef, {
      isAdmin: true,
    })
      .then(() => {
        console.log('User marked as admin.');
      })
      .catch((error) => {
        console.error('Error marking user as admin:', error);
      });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      markUserAsAdmin(user.uid);

      window.location.href = '/';
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <form
        onSubmit={handleLogin}
        className='bg-white text-black p-8 border border-black shadow-lg max-w-sm w-full'
      >
        <h2 className='text-3xl font-bold mb-6 text-center'>Login</h2>
        {error && <p className='text-red-600 text-sm mb-2'>{error}</p>}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-2 border text-sm'
            placeholder='admin@example.com'
            required
          />
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-medium mb-1'>Password</label>
          <input
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
      </form>
    </div>
  );
}
