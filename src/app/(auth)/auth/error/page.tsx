"use client";

import { useSearchParams } from "next/navigation";
import { Command, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Cancelled':
        return 'You cancelled the authentication process.';
      case 'AccessDenied':
        return 'Access was denied. Please try again.';
      case 'CredentialsSignin':
        return 'Invalid email or password.';
      case 'EmailSignin':
        return 'Failed to send verification email.';
      case 'OAuthSignin':
        return 'Could not sign in with the provider.';
      case 'OAuthCallback':
        return 'Could not verify provider callback.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <Command className="h-12 w-12 mx-auto" />
        <h2 className="mt-6 text-3xl font-bold tracking-tight">Authentication error</h2>
        <p className="mt-2 text-sm text-gray-600">
          {getErrorMessage(error)}
        </p>
        <Link href="/sign-in">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}