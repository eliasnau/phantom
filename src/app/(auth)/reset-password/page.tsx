"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Command, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/util/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid reset link");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(token, password);
      
      if (error) {
        setError(error.message || "Failed to reset password");
        return;
      }

      router.push("/sign-in?message=Password reset successful");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          <Command className="h-12 w-12 mx-auto" />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Invalid reset link</h2>
          <p className="mt-2 text-sm text-gray-600">This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password">
            <Button className="mt-6">
              Request new link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
              Set new password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your new password below.
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
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="mt-1"
                  placeholder="Enter new password"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="mt-1"
                  placeholder="Confirm new password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Updating password..." : "Update password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}