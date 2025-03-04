'use client';

import Link from 'next/link'
import React from 'react'

const RegisterPage = () => {

  const handleRegister = async (e) => {
    e.preventDefault()
  }
  return (
    <>
      <div className='flex flex-col md:flex-row mt-3'>
        <div className='flex bg-cover bg-center overflow-hidden w-full md:w-1/2 justify-center items-center'>
          <img src="/images/register-image.jpg" alt="register-image" className='md:rounded-lg' />
        </div>
        <div className='w-full md:w-1/2 p-4'>
          <h1 className='text-black text-center mb-2'>Register here</h1>
          <form className='flex flex-col space-y-4 text-black' onSubmit={handleRegister}>
            <div>
              <label htmlFor='username' className='block text-sm font-medium text-gray-700'>Username</label>
              <input type='text' id='username' name='username' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' required />
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
              <input type='email' id='email' name='email' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' required />
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
              <input type='password' id='password' name='password' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' required />
            </div>
            <button type='submit' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300'>Register</button>
            </form>
            <div className='flex justify-center mt-4 text-blue-500'>
            <p>you already have an account?</p>
            <Link href='/login' className='mx-2 hover:underline'>Login</Link>
            </div>
        </div>

      </div>
    </>
  )
}

export default RegisterPage
