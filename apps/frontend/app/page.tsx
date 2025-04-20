"use client"

import React, { useState, useEffect} from 'react';
import { 
  Pencil, 
  Share2, 
  Users, 
  Lock, 
  Shapes,
  Moon,
  Sun
} from 'lucide-react';
import Link from 'next/link';

function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-purple-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Shapes className="h-8 w-8 text-purple-600" />
            <span className="font-bold text-xl dark:text-white ml-3 sm:mr-12">Drawify</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-6">
              <a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">About</a>
              <a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Blog</a>
              <a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Libraries</a>
            </div>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-purple-600" />
              )}
            </button>
            <Link href={'/create-room'}>
              <button className="bg-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap">
                Start Drawing
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-[80vh] flex justify-center items-center bg-gradient-to-b from-purple-50 to-purple-100 dark:from-gray-950 dark:to-gray-900">
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-purple-900 dark:text-white mb-6">
              Virtual whiteboard for<br />sketching and collaboration
            </h1>
            <p className="text-lg sm:text-xl text-purple-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Create beautiful hand-drawn diagrams, wireframes, and illustrations with our free and open-source drawing tool.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link href={'/signup'}>
                <button className="bg-purple-600 text-white px-10 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                  Signup
                </button>
              </Link>
              <Link href={"/signin"}>
                <button className='flex items-center justify-center px-6 py-3 border border-purple-200 dark:border-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors dark:text-white'>
                  Signin
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Features */}
      <section className="bg-purple-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Pencil className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Intuitive Drawing</h3>
              <p className="text-purple-700 dark:text-gray-300">Create beautiful diagrams with our easy-to-use drawing tools and gestures.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Easy Sharing</h3>
              <p className="text-purple-700 dark:text-gray-300">Share your drawings with a simple link or export them in various formats.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Real-time Collaboration</h3>
              <p className="text-purple-700 dark:text-gray-300">Work together with your team in real-time, anywhere in the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-purple-50 dark:bg-gray-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl font-bold dark:text-white">Secure by Default</h2>
          </div>
          <p className="text-center text-purple-700 dark:text-gray-300 max-w-2xl mx-auto">
            Your drawings are automatically encrypted and stored securely. We never track you or collect unnecessary data.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Download</a></li>
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Libraries</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">API</a></li>
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Guides</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">About</a></li>
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Blog</a></li>
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Terms</a></li>
                <li><a href="#" className="text-purple-700 hover:text-purple-900 dark:text-gray-300 dark:hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-purple-200 dark:border-gray-800 text-center text-purple-700 dark:text-gray-400">
            <p>© 2025 Drawify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;