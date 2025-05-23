'use client'
import React from 'react';
import Navbar from '@/components/User/Navbar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Layout = ({ children }) => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white">
      <Navbar />
      <main className="px-10 py-5 bg-gray-100 dark:bg-gray-800 dark:text-white relative">
        <Button className="absolute right-10 bg-red-500 dark:bg-blue-600 hover:bg-red-600 dark:text-white shadow-lg z-50 hidden md:block" onClick={() => {
          router.push('/pdf/pdflist')
        }}>Go To Dashboard</Button>
        {children}
        </main>
    </div>
  );
};

export default Layout;
