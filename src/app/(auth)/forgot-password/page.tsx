"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Command, ArrowLeft } from "lucide-react";
import { forgotPassword } from "@/util/auth-client";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await forgotPassword(email);
      
      if (error) {
        setError(error.message || "Failed to send reset email");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Link href="/sign-in" className="p-6">
        <ArrowLeft className="h-6 w-6 hover:text-gray-600" />
      </Link>
      
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Command className="h-12 w-12 mx-auto" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <Alert 
              message={error} 
              onDismiss={() => setError(null)}
            />
          )}

          {success ? (
            <div className="mt-8 text-center">
              <div className="bg-green-50 rounded-lg p-6 text-green-800">
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="mt-2 text-sm">
                  We've sent you a link to reset your password. Please check your inbox.
                </p>
              </div>
              <Link href="/sign-in">
                <Button 
                  className="mt-6 w-full"
                >
                  Back to sign in
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}