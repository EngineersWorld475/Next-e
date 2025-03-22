'use client'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Progress } from '../ui/progress';

const AuthGuard = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter()
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [isChecking, setIsChecking] = useState(true)
    const [progress, setProgress] = useState(13)

    useEffect(() => {
        if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
            router.replace('/pdf/pdflist')
        } else if (!isAuthenticated && (pathname === '/pdf/pdflist' || pathname === '/pdf/manage-groups' || pathname === '/user/add-profile' || pathname === '/user/feedback' || pathname === '/auth/reset-password')) {
            router.replace('/auth/login')
         } else {
            // allow rendering only when check is completed
            setIsChecking(false) 
        }
    }, [router, isAuthenticated, pathname])

    useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
    })

    // prevent rendering while checking auth state
    if (isChecking) return <div className='flex justify-start h-screen w-screen'>
         <Progress value={progress} className="w-[100%]" />
    </div>

    return children;
}

export default AuthGuard
