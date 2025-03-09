'use client';

import { loginUser } from '@/store/auth-slice';
import Link from 'next/link';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const initialState = {
    EmailID: "",
    Password: ""
  }
  const dispatch = useDispatch()
  const [formData, setFormData] = useState(initialState);
  const { isLoading } = useSelector((state) => state.auth)
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
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      router.push('/pdf/pdflist')
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  return (
    <>
      <div className='flex flex-col md:flex-row mt-3 justify-center items-center'>
        <div className='bg-cover bg-center overflow-hidden w-full md:w-1/2 '>
          <Image src="/images/login-image.jpg" alt="login_image" className='md:rounded-lg' width={600} height={600} />
        </div>
        <div className='w-full md:w-1/2 p-4'>
          <h1 className='text-black text-center mb-2'>Login to your account</h1>
          <form className='flex flex-col space-y-4 text-black' onSubmit={handleLogin}>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
              <input type='email' id='EmailID' name='EmailID' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
              <input type='password' id='Password' name='Password' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' onChange={handleChange} required />
            </div>
            <button type='submit' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300'>{isLoading ? 'Loading...' : 'Login'}</button>
          </form>
          <div className='flex flex-col md:flex-row lg:flex-row justify-center items-center gap-3 md:gap-0 lg:gap-0 mt-4 text-blue-500 text-sm w-full'>
            <p>you don't have an account?</p>
            <Link href='/register' className='mx-2 hover:underline'>Create an Account</Link>
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
