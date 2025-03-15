import React from 'react';
import Navbar from '@/components/User/Navbar';


const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="min-h-screen px-10 py-5 bg-white dark:bg-black dark:text-white">{children}</main>
    </div>
  );
};

export default Layout;
