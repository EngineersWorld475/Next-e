'use client';

import { registerUser } from '@/store/auth-slice';
import Link from 'next/link'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

const RegisterPage = () => {

  const dispatch = useDispatch();
  const initialState = {
    FirstName: "",
    LastName: "",
    Password: "",
    EmailID: "",
    Gender: ""
  }

  const [formData, setFormData] = useState(initialState);
  const [passwordError, setPasswordError] = useState('')

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
    if (formData.Password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      console.log(result);
    } catch (error) {
      console.error('Registration error:', error);
    }
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
            <div className='flex flex-row gap-2 '>
              <div className='w-1/2'>
                <label htmlFor='FirstName' className='block text-sm font-medium text-gray-700'>Firstname</label>
                <input type='text' id='FirstName' name='FirstName' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' value={formData?.FirstName} onChange={handleChange} required />
              </div>
              <div className='w-1/2'>
                <label htmlFor='LastName' className='block text-sm font-medium text-gray-700'>Lastname</label>
                <input type='text' id='LastName' name='LastName' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' value={formData?.LastName} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <label htmlFor='EmailID' className='block text-sm font-medium text-gray-700'>Email</label>
              <input type='email' id='EmailID' name='EmailID' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' value={formData?.EmailID} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor='Password' className='block text-sm font-medium text-gray-700'>Password</label>
              <input type='password' id='Password' name='Password' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' value={formData?.Password} onChange={handleChange} required />
              <p style={{color:'red'}}>
                {passwordError}
              </p>
            </div>
            <div>
              <label htmlFor='Gender' className='block text-sm font-medium text-gray-700'>Gender</label>
              <select id='Gender' name='Gender' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2' value={formData?.Gender} onChange={handleChange} required>
                <option value=''>Select Gender</option>
                <option value='M'>Male</option>
                <option value='F'>Female</option>
                <option value='O'>Other</option>
              </select>
            </div>
            <button type='submit' className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm p-2 bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300'>Register</button>
          </form>
          <div className='flex justify-center mt-4 text-blue-500'>
            <p>Already have an account?</p>
            <Link href='/login' className='mx-2 hover:underline'>Login!</Link>
          </div>
        </div>

      </div>
    </>
  )
}

export default RegisterPage
