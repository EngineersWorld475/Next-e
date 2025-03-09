import React from 'react';
import Navbar from '@/components/User/Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="px-10 py-5">{children}</main>
    </div>
  );
};

export default Layout;
