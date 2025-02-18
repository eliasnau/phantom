"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Command, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Command className="h-12 w-12 mx-auto" />
            <h1 className="mt-6 text-3xl font-bold tracking-tight">
              Welcome aboard! 🎉
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              We&apos;re excited to have you here. Let&apos;s get you started.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Your account is ready</h2>
              <p className="mt-1 text-sm text-gray-600">
                You&apos;re now connected to our {process.env.NODE_ENV} server.
              </p>
            </div>

            <Link href="/dashboard">
              <Button 
                className="w-full flex justify-center py-2.5 px-4 rounded-lg border border-transparent font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}