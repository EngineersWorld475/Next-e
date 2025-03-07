import Link from 'next/link'
import React from 'react'
import { Inter } from "next/font/google";
import Image from 'next/image';
const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

const Navbar = () => {
  return (
    <nav className='bg-[#ff6347] text-white p-3 flex justify-between items-center px-5 md:px-20 fixed top-0 left-0 w-full z-20'>
        <Image src={'/images/scholarly-logo.png'} alt="scholarly-logo" width={150} height={150} />
        <div className='flex space-x-5 text-white font-semibold'>
            <Link href={'/login'} className='hover:text-black'>Log In</Link>
            <Link href={'/register'} className='hover:text-black'>Sign Up</Link>
        </div>
    </nav>
  )
}

export default Navbar
