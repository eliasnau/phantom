import Link from "next/link";
import { Command, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        <Command className="h-12 w-12 mx-auto" />
        <h2 className="mt-6 text-3xl font-bold tracking-tight">Page not found</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link href="/">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}