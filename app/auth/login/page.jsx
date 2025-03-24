'use client';

import { loginUser } from '@/store/auth-slice';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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
        toast.error(
          <span className="text-red-500 font-semibold text-center">
            {result?.Message}
          </span>
        )
        setSubmitting(false);

      }
    } catch (error) {
      console.error('Login error:', error);
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
      <div className='flex flex-col md:flex-row mt-3 justify-center items-center'>
        <div className='bg-cover bg-center overflow-hidden w-full md:w-1/2 '>
          <Image src="/images/login-image.jpg" alt="login_image" className='md:rounded-lg' width={600} height={600} />
        </div>
        <div className='w-full md:w-1/2 p-4 mt-4'>
          <h1 className='text-black text-center mb-2'>Login to your account</h1>
          <form className='flex flex-col space-y-4 text-black' onSubmit={handleLogin}>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
              <input type='email' id='EmailID' placeholder='Enter Email Address...' name='EmailID' value={formData?.EmailID} className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' onChange={handleChange} required />
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 pr-10 bg-white"
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
            <div className='flex flex-row gap-3 px-5 py-5'>
              <span className='text-gray-700'>Remember Me</span>
              <input type="checkbox" className='cursor-pointer bg-white' checked={rememberMe} onChange={handleRememberMe} />
            </div>
            <button type='submit' className='mt-3 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300 flex justify-center items-center gap-2' disabled={submitting}>{submitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 text-center" />
                Loading...
              </>
            ) : (
              'Login'
            )}</button>
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
      </div>
    </>
  )
}

export default LoginPage;
