'use client';

import { registerUser } from '@/store/auth-slice';
import Link from 'next/link'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';


const RegisterPage = () => {

  const dispatch = useDispatch();
  const initialState = {
    firstName: "",
    lastName: "",
    password: "",
    emailID: "",
    gender: "",
    currentLocation: "",
    currentPosition: "",
    specialzation: "",
    university: ""
  }

  const [formData, setFormData] = useState(initialState);
  const [passwordError, setPasswordError] = useState('')
  const { isLoading } = useSelector((state) => state.auth)


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password' && value.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
    } else {
      setPasswordError('')
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    try { 
      const result = await dispatch(registerUser(formData)).unwrap();
      console.log(result)
    } catch (error) {
      console.error('Registration error:', error);
    }
  }


  return (
    <>
      <div className='flex flex-col md:flex-row mt-3'>
        <div className='flex bg-cover bg-center overflow-hidden w-full md:w-1/2 justify-center items-center'>
          <Image src="/images/register-image.jpg" alt="register-image" className='md:rounded-lg' height={600} width={600} />
        </div>
        <div className='w-full md:w-1/2 p-4'>
          <h1 className='text-black text-center mb-5'>Register here</h1>
          <form className='flex flex-col space-y-4 text-black' onSubmit={handleRegister}>
            <div className='flex flex-row gap-2 '>
              <div className='w-1/2'>
                <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>Firstname</label>
                <input type='text' id='firstName' name='firstName' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white text-black' value={formData?.firstName} onChange={handleChange} required />
              </div>
              <div className='w-1/2'>
                <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>Lastname</label>
                <input type='text' id='lastName' name='lastName' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' value={formData?.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label htmlFor='emailID' className='block text-sm font-medium text-gray-700'>Email</label>
              <input type='email' id='emailID' name='emailID' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' value={formData?.emailID} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
              <input type='password' id='password' name='password' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' value={formData?.password} onChange={handleChange} required />
              <p style={{ color: 'red' }}>
                {passwordError}
              </p>
            </div>
            <div className='flex flex-row gap-2'>
              <div className='w-1/2'>
                <label htmlFor='currentLocation' className='block text-sm font-medium text-gray-700'>Current Location</label>
                <input type='text' id='currentLocation' name='currentLocation' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' value={formData?.currentLocation} onChange={handleChange} required />
              </div>
              <div className='w-1/2'>
                <label htmlFor='currentPosition' className='block text-sm font-medium text-gray-700'>Current Position</label>
                <input type='text' id='currentPosition' name='currentPosition' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' value={formData?.currentPosition} onChange={handleChange} required />
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              <div className='w-1/2'>
                <label htmlFor='CurrentLocation' className='block text-sm font-medium text-gray-700'>University</label>
                <input type='text' id='university' name='university' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' value={formData?.university } onChange={handleChange} required />
              </div>
              <div className='w-1/2'>
                <label htmlFor='CurrentPosition' className='block text-sm font-medium text-gray-700'>Speacialization</label>
                <input type='text' id='specialzation' name='specialzation' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' value={formData?.specialzation} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label htmlFor='gender' className='block text-sm font-medium text-gray-700'>Gender</label>
              <select id='gender' name='gender' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-white' value={formData?.gender} onChange={handleChange} required>
                <option value=''>Select Gender</option>
                <option value='M'>Male</option>
                <option value='F'>Female</option>
                <option value='O'>Other</option>
              </select>
            </div>
            <button type='submit' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300'>{isLoading ? 'Loading...' : 'Register'}</button>
          </form>
          <div className='flex justify-center mt-4 text-blue-500 text-sm'>
            <p>Already have an account?</p>
            <Link href='/auth/login' className='mx-2 hover:underline'>Login!</Link> 
          </div>
        </div>

      </div>
    </>
  )
}

export default RegisterPage
