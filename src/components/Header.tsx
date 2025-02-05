import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeSwitch from './ThemeSwitch';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md' : 'bg-white dark:bg-gray-900'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand Name */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/logo.svg"
              alt="AI Assistant 4 Architect Logo"
              width={32}
              height={32}
              className="h-8 w-auto dark:invert"
            />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Assistant 4 Architect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#how-it-works"
              className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </a>
            <a 
              href="#contact"
              className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
            <a 
              href="#pricing"
              className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Pricing
            </a>
            <a 
              href="#faq"
              className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              FAQ
            </a>
            <ThemeSwitch />
            <Link
              href="auth?view=sign-up"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Start for Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            {/* Add mobile menu implementation if needed */}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
