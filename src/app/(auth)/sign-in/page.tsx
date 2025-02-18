"use client";

import React, { useState } from 'react';
import { Command, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SocialButtons } from '@/components/SocialButtons';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { signIn } from '@/util/auth-client';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn({
        email,
        password,
        rememberMe: true,
      });

      if (error) {
        setError(error.message ?? 'Failed to sign in');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Link href="/" className="p-6">
        <ArrowLeft className="h-6 w-6 hover:text-gray-600" />
      </Link>
      
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Command className="h-12 w-12 mx-auto" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="font-medium text-black hover:text-gray-800">
                Create one
              </Link>
            </p>
          </div>

          {error && (
            <Alert 
              message={error} 
              onDismiss={() => setError(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link 
                href="/forgot-password" 
                className="text-sm font-medium text-black hover:text-gray-800"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 rounded-lg border border-transparent font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <SocialButtons />
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="font-medium text-black hover:text-gray-800">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-black hover:text-gray-800">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}