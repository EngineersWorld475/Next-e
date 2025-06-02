'use client'
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { CircleUser, LogOut, User, MessageSquare, Key, Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ThemeToggle from '../Theme/ThemeToggle';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/auth-slice';
import { persistor } from '@/store/store';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Navbar = () => {
  const dispatch = useDispatch();
  const router =  useRouter();

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
          {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button  variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 ring-2 ring-background transition-all hover:ring-primary/20">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <CircleUser className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 p-2" 
                align="end" 
                forceMount
              >
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                      SG
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Sanjay G Nair</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      sanjay@gmail.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href={'/user/add-profile'}>
                    <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  </Link>
                 <Link href={'/user/feedback'}>
                   <DropdownMenuItem className="cursor-pointer">
                    <MessageSquare className="mr-3 h-4 w-4" />
                    <span>Feedback</span>
                  </DropdownMenuItem>
                 </Link>
                 <Link href={'/auth/reset-password'}>
                   <DropdownMenuItem className="cursor-pointer">
                    <Key className="mr-3 h-4 w-4" />
                    <span>Change Password</span>
                  </DropdownMenuItem>
                 </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
