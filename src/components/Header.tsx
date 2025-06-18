'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1f7285]/75 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center md:h-20 h-auto min-h-[56px]">
            {/* Logo and site title */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <picture>
                  <source srcSet="/images/title-stacked.png" media="(max-width: 767px)" />
                  <img 
                    src="/images/title.png" 
                    alt="Earl's Elastic, Stretchy Socks Logo" 
                    className="w-[230px] md:w-[460px] h-auto object-contain pt-[5px] pb-[5px] md:pt-0 md:pb-0"
                  />
                </picture>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 flex-shrink-0 ml-8">
              <Link
                href="/about"
                className={`text-white hover:underline whitespace-nowrap ${isActive('/about') ? 'underline' : ''}`}
              >
                About the Book
              </Link>
              <Link
                href="/contact"
                className={`text-white hover:underline whitespace-nowrap ${isActive('/contact') ? 'underline' : ''}`}
              >
                Contact
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center bg-[#ffe03b] text-black font-bold rounded-full hover:bg-yellow-300 transition-colors ml-4 whitespace-nowrap"
                style={{boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '6px 18px'}}>
                Order Now
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center flex-shrink-0 ml-4">
              <button
                onClick={toggleMobileMenu}
                className="text-white hover:text-yellow-300 focus:outline-none"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile menu overlay rendered outside header */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur"
            onClick={toggleMobileMenu}
          ></div>
          <div className="fixed inset-y-0 right-0 w-full sm:max-w-sm bg-[#1f7285] shadow-xl transform transition-transform duration-300 ease-in-out h-screen">
            <div className="flex flex-col h-screen bg-[#1f7285]">
              <div className="flex justify-end p-6">
                <button
                  onClick={toggleMobileMenu}
                  className="text-white hover:text-yellow-300 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <nav className="flex-1 px-6 pb-6 space-y-6">
                <Link
                  href="/about"
                  onClick={toggleMobileMenu}
                  className={`block text-white text-lg hover:underline ${isActive('/about') ? 'underline' : ''}`}
                >
                  About the Book
                </Link>
                <Link
                  href="/contact"
                  onClick={toggleMobileMenu}
                  className={`block text-white text-lg hover:underline ${isActive('/contact') ? 'underline' : ''}`}
                >
                  Contact
                </Link>
                <Link
                  href="/order"
                  onClick={toggleMobileMenu}
                  className="block bg-[#ffe03b] text-black font-bold rounded-full hover:bg-yellow-300 text-center mt-8"
                  style={{boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '12px 24px'}}>
                  Order Now
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 