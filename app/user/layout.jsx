'use client'
import React from 'react';
import Navbar from '@/components/User/Navbar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const router = useRouter();
  const { userData } = useSelector((state) => state.userprofile);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-white">
      <Navbar />
      <main className="px-10 py-5 bg-gray-100 dark:bg-gray-800 dark:text-white relative">
        {children}
        </main>
    </div>
  );
};

export default Layout;
