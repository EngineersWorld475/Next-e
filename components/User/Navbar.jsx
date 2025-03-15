import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { CircleUser, LogOutIcon, UserIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ThemeToggle from '../Theme/ThemeToggle';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-3 md:px-10 lg:px-10 py-3 shadow-md bg-white dark:bg-gray-900 dark:text-white">
      <Link href={'/pdf/pdflist'}>
        <Image
          src="/images/scholarly-logo-auth.png"
          width={120}
          height={40}
          alt="Scholarly Logo"
          className="object-contain"
        />
      </Link>

      <div className="flex gap-3 md:gap-6 lg:gap-6 text-gray-600 font-medium items-center justify-center">
        <Link href={'/pdf/manage-groups'} className='cursor-pointer hover:text-gray-500 transition text-sm md:text-base lg:text-base'>Manage Groups</Link>
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
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href={'/user/feedback'}>
                  <DropdownMenuItem className='flex flex-row gap-4 items-center text-gray-600 cursor-pointer text-xs'>
                    <UserIcon className='text-gray-400' />
                    Feedback
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href={'/auth/reset-password'}>
                  <DropdownMenuItem className='flex flex-row gap-4 items-center text-gray-600 cursor-pointer text-xs'>
                    <UserIcon className='text-gray-400' />
                    Change Password 
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='flex flex-row gap-4 items-center text-gray-600 cursor-pointer text-xs'>
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
