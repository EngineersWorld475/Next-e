'use client';

import { loginUser } from '@/store/auth-slice';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useCustomToast } from '@/hooks/useCustomToast';
import CustomButton from '@/common/CustomButton';

const LoginPage = () => {
  const initialState = {
    EmailID: "",
    Password: ""
  }
  const dispatch = useDispatch()

  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { showToast } = useCustomToast();
  const router = useRouter();

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      if (result?.status) {
        if (rememberMe) {
          localStorage.setItem('EmailID', formData?.EmailID);
          // Encrypting password
          const encryptedPassword = CryptoJS.AES.encrypt(formData.Password, process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_SECRET_KEY).toString();
          localStorage.setItem("Password", encryptedPassword);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem('EmailID');
          localStorage.removeItem('Password');
          localStorage.removeItem('rememberMe');
        }
        router.push('/pdf/pdflist');
      } else {
        showToast({
          description: result?.Message,
          variant: "warning"
        })
        setSubmitting(false);

      }
    } catch (error) {
      if (error.response?.status === 500) {
        showToast({
          description: "Internal Server Error. Please try again later.",
          variant: "destructive",
        });
      } else {
        showToast({
          description: error?.response?.data?.message || "An error occurred. Please try again.",
          variant: "warning",
        });
      }

      setSubmitting(false);
    }
  }

  const handleRememberMe = () => {
    setRememberMe((prev) => !prev)
  }

  // Loading stored credentials when component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem('EmailID');
    const storedPassword = localStorage.getItem('Password');
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true'

    if (storedEmail && storedPassword && storedRememberMe) {
      try {
        // Decrypting password 
        const bytes = CryptoJS.AES.decrypt(storedPassword, process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_SECRET_KEY);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedPassword) throw new Error("Decryption failed");

        setFormData({
          EmailID: storedEmail,
          Password: decryptedPassword
        })
        setRememberMe(true);
      } catch (error) {
        console.error("Decryption error:", error);
      }
    }
  }, [])
  return (
    <>
      <div className='w-full md:w-1/2 p-4 '>
        <h1 className='text-black text-3xl font-semibold text-center mb-2 font-geist tracking-tight'>login</h1>
        <p className='text-center font-thin text-sm mb-7 tracking-tight'>we'll get you back to the app in just a minute</p>
        <form className='flex flex-col space-y-4 text-black' onSubmit={handleLogin}>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
            <input type='email' id='EmailID' placeholder='Enter Email Address...' name='EmailID' value={formData?.EmailID} className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm p-2 bg-white' onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="Password"
                placeholder='Enter Password'
                name="Password"
                value={formData?.Password}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm p-2 pr-10 bg-white"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 text-gray-500 justify-end py-2 px-2"
              >
                {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className='flex flex-row gap-3 px-1  py-5'>
            <input type="checkbox" className='cursor-pointer bg-white' checked={rememberMe} onChange={handleRememberMe} />
            <span className='text-gray-500 text-sm font-geist tracking-tight'>stay logged in</span>
          </div>
          <CustomButton variant='purpleGradient' loading={submitting}>Login</CustomButton>
        </form>
        <div className='flex flex-col md:flex-row lg:flex-row justify-center items-center gap-3 md:gap-0 lg:gap-0 mt-4 text-blue-500 text-sm w-full'>
          <p>you don't have an account?</p>
          <Link href='/auth/register' className='mx-2 hover:underline'>Create an Account</Link>
        </div>
        <div className='flex justify-center mt-1 text-blue-500 text-sm w-full'>
          <Link href='/auth/forgot-password' className='mx-2 hover:underline mb-2'>Forgot Password?</Link>
        </div>
        <div className='flex justify-center mt-1 text-blue-500 text-sm w-full'>
          <Link href='/' className='mx-2 hover:underline'>Go Back To Home</Link>
        </div>
      </div>
    </>
  )
}

export default LoginPage;
