'use client'
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { CircleUser, LogOutIcon, UserIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ThemeToggle from '../Theme/ThemeToggle';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/auth-slice';
import { persistor } from '@/store/store';

const Navbar = () => {
  const dispatch = useDispatch();
  const router =  useRouter()

  const handleLogout = async () => {
    dispatch(logout()); 
    await persistor.purge();
    router.replace('/auth/login'); 
  };

  return (
    <nav className="flex justify-between items-center px-3 md:px-10 lg:px-10 py-3 shadow-md bg-white dark:bg-gray-900 dark:text-white">
      <Link href={'/pdf/pdflist'}>
        <Image
          src="/images/scholarly-logo-auth.png"
          width={120}
          height={40}
          alt="Scholarly Logo"
          className="w-24 h-10 md:w-36 md:h-14"
        />
      </Link>

      <div className="flex gap-3 md:gap-6 lg:gap-6 text-gray-600 font-medium items-center justify-center">
        <Link href={'/pdf/manage-groups'} className='cursor-pointer hover:text-gray-500 transition text-sm md:text-base lg:text-base'>
          Manage Groups
        </Link>
        <div className='flex flex-row gap-3 md:gap-6 lg:gap-6 justify-center items-center'>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CircleUser className='cursor-pointer' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <Link href={'/user/add-profile'}>
                  <DropdownMenuItem className='flex flex-row gap-4 items-center text-gray-600 cursor-pointer text-xs'>
                    <UserIcon className='text-gray-400' />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href={'/user/feedback'}>
                  <DropdownMenuItem className='flex flex-row gap-4 items-center text-gray-600 cursor-pointer text-xs'>
                    <UserIcon className='text-gray-400' />
                    <span>Feedback</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href={'/auth/reset-password'}>
                  <DropdownMenuItem className='flex flex-row gap-4 items-center text-gray-600 cursor-pointer text-xs'>
                    <UserIcon className='text-gray-400' />
                    <span>Change Password</span> 
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='flex flex-row gap-4 items-center text-gray-600 cursor-pointer text-xs' onClick={handleLogout}>
                  <LogOutIcon className='text-gray-400' />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
