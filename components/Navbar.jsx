import Link from 'next/link'
import React from 'react'
import { Inter } from "next/font/google";
import Image from 'next/image';
import { useSelector } from 'react-redux';
const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className='text-white
 p-3 flex justify-between items-center px-5 md:px-20 top-0 left-0 w-full z-20'>
      <Image
        src="/images/scholarly-logo.png"
        alt="scholarly-logo"
        width={140}
        height={40}
        className="w-24 h-10 md:w-36 md:h-14"
      />
      {user ? (
        <Link href={'/pdf/pdflist'} className='text-white hover:text-black text-xs md:text-base lg:text-base  border border-white py-1 px-2 md:py-2 md:px-3 rounded-lg' >
          Go To Dashboard
        </Link>
      ) : (
        <div className='flex space-x-5 text-white'>
          <Link href={'/auth/login'} className='text-sm md:text-base lg:text-base py-1 px-2 rounded-lg'>
            Log In
          </Link>
          <Link href={'/auth/register'} className='text-sm md:text-base lg:text-base py-1 px-2 rounded-lg'> 
            Sign Up
          </Link>
        </div>
      )
      }
    </nav>
  )
}

export default Navbar
