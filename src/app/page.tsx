
import Link from 'next/link';
import { Github, ArrowRight, Command, Zap, Shield, Globe } from 'lucide-react';
import { ModeToggle } from '@/components/theme/DarkModeToggle';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Command className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">Starter Kit</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" className="text-sm font-medium hover:text-gray-600">Sign In</Link>
              <a href="https://github.com" className="flex items-center px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800">
                <Github className="h-4 w-4 mr-2" />
                Star on GitHub
              </a>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight">
            Build faster with
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Modern Stack</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            The complete development platform for building and scaling your modern applications.
            Start for free and scale as you grow.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/sign-in" className="px-6 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 flex items-center">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a href="#learn-more" className="px-6 py-3 rounded-lg border border-gray-200 text-sm font-medium hover:border-gray-400">
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border hover:border-gray-400 transition-colors">
            <Zap className="h-8 w-8 text-purple-600" />
            <h3 className="mt-4 text-xl font-semibold">Lightning Fast</h3>
            <p className="mt-2 text-gray-600">Built for speed and performance from the ground up.</p>
          </div>
          <div className="p-6 rounded-xl border hover:border-gray-400 transition-colors">
            <Shield className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-xl font-semibold">Secure by Default</h3>
            <p className="mt-2 text-gray-600">Enterprise-grade security out of the box.</p>
          </div>
          <div className="p-6 rounded-xl border hover:border-gray-400 transition-colors">
            <Globe className="h-8 w-8 text-green-600" />
            <h3 className="mt-4 text-xl font-semibold">Global Edge Network</h3>
            <p className="mt-2 text-gray-600">Deploy globally with a single click.</p>
          </div>
        </div>
      </div>
    </div>
  );
}