import React, { useState } from 'react';
import { Github } from 'lucide-react';
import { signInWithGithub } from '@/util/auth-client';
import Image from 'next/image';

export const SocialButtons = () => {
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleGithubSignIn = async () => {
    try {
      setIsGithubLoading(true);
      await signInWithGithub();
    } catch (error) {
      console.error('GitHub sign in error:', error);
    } finally {
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        // onClick={() => {}}
      >
        <Image
          width={24}
          height={24}
          src="https://www.google.com/favicon.ico" 
          alt="Google" 
          className="w-5 h-5 mr-2"
        />
        Continue with Google
      </button>

      <button
        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-70"
        onClick={handleGithubSignIn}
        disabled={isGithubLoading}
      >
        <Github className="w-5 h-5 mr-2" />
        {isGithubLoading ? 'Loading...' : 'Continue with GitHub'}
      </button>
    </div>
  );
};