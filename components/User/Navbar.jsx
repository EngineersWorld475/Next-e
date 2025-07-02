'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { CircleUser, LogOut, User, MessageSquare, Key, Menu, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ThemeToggle from '../Theme/ThemeToggle';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/store/auth-slice';
import { persistor } from '@/store/store';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    dispatch(logout()); 
    await persistor.purge();
    router.replace('/auth/login'); 
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="flex justify-between items-center px-3 md:px-10 lg:px-10 py-3 shadow-md bg-white dark:bg-gray-900 dark:text-white relative">
      <Link href={'/pdf/pdflist'}>
        <Image
          src="/images/scholarly-logo-latest.png"
          width={140}
          height={40}
          alt="Scholarly Logo"
          className="w-24 h-10 md:w-36 md:h-14"
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 lg:gap-6 dark:text-gray-100 font-medium items-center justify-center">
        <Link href={'/pdf/pdflist'} className={`cursor-pointer hover:text-gray-500 transition text-sm ${pathname === '/pdf/pdflist' ? 'text-blue-600 dark:text-blue-200' : 'text-gray-500 hover:text-blue-600'}`}>
          dashboard
        </Link>
        <Link href={'/pdf/manage-groups'} className={`cursor-pointer hover:text-gray-500 transition text-sm ${pathname === '/pdf/manage-groups' ? 'text-blue-600 dark:text-blue-200' : 'text-gray-500 hover:text-blue-600'}`}>
          manage groups
        </Link>
        <div className='flex flex-row gap-6 justify-center items-center'>
          <ThemeToggle />
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-8 w-8 ring-2 ring-background transition-all hover:ring-primary/20">
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

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-3">
        <ThemeToggle />
        
        {/* User Profile Dropdown for Mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-8 w-8 ring-2 ring-background transition-all hover:ring-primary/20">
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

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className="p-2 bg-gray-200 dark:bg-gray-800"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t dark:border-gray-700 md:hidden z-50">
          <div className="px-4 py-3 space-y-3">
            <Link 
              href={'/pdf/pdflist'} 
              className={`block py-2 px-3 rounded-md text-sm font-medium transition ${
                pathname === '/pdf/pdflist' 
                  ? 'text-blue-600 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href={'/pdf/manage-groups'} 
              className={`block py-2 px-3 rounded-md text-sm font-medium transition ${
                pathname === '/pdf/manage-groups' 
                  ? 'text-blue-600 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Manage Groups
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar