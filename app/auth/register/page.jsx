'use client';

import { registerUser } from '@/store/auth-slice';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useCustomToast } from '@/hooks/useCustomToast';
import CustomButton from '@/common/CustomButton';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { showToast } = useCustomToast();
  const router = useRouter();

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
  };

  const [formData, setFormData] = useState(initialState);
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password' && value.length < 5) {
      setPasswordError('Password must be at least 5 characters long.');
    } else {
      setPasswordError('');
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 5) {
      setPasswordError('Password must be at least 5 characters long.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      showToast({
        description: 'Registration successful! Please log in.',
        variant: 'success',
      });
      router.push('/auth/login');
    } catch (error) {
      showToast({
        description: error?.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      }); 
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 p-3">
      <h1 className="text-black text-2xl font-semibold text-center mb-1 font-geist tracking-tight">Create Your Account</h1>
      <p className="text-center font-thin text-xs mb-3 tracking-tight">Join Scholarly to collaborate</p>
      <form className="flex flex-col space-y-2 text-black" onSubmit={handleRegister}>
        <div className="flex flex-row gap-2">
          <div className="w-1/2">
            <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-0.5 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm p-2 bg-white text-black"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="lastName" className="block text-xs font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-0.5 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm p-2 bg-white text-black"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="emailID" className="block text-xs font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="emailID"
            name="emailID"
            className="mt-0.5 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm p-2 bg-white text-black"
            value={formData.emailID}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-gray-700">Password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="mt-0.5 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm p-2 pr-8 bg-white text-black"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-0 text-gray-500 py-2"
            >
              {!showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {passwordError && <p className="text-red-500 text-xs mt-0.5">{passwordError}</p>}
        </div>
        <div className="flex flex-row gap-2">
          <div className="w-1/2">
            <label htmlFor="gender" className="block text-xs font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              name="gender"
              className="mt-0.5 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm p-2 bg-white text-black"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div className="w-1/2">
            <label htmlFor="currentPosition" className="block text-xs font-medium text-gray-700">Position</label>
            <input
              type="text"
              id="currentPosition"
              name="currentPosition"
              className="mt-0.5 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm p-2 bg-white text-black"
              value={formData.currentPosition}
              onChange={handleChange}
              placeholder="Position"
              required
            />
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="w-1/2">
            <label htmlFor="currentLocation" className="block text-xs font-medium text-gray-700">Location</label>
            <input
              type="text"
              id="currentLocation"
              name="currentLocation"
              className="mt-0.5 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm p-2 bg-white text-black"
              value={formData.currentLocation}
              onChange={handleChange}
              placeholder="Location"
              required
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="specialzation" className="block text-xs font-medium text-gray-700">Specialization</label>
            <input
              type="text"
              id="specialzation"
              name="specialzation"
              className="mt-0.5 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm p-2 bg-white text-black"
              value={formData.specialzation}
              onChange={handleChange}
              placeholder="Specialization"
              required
            />
          </div>
        </div>
        <div className="w-full">
          <label htmlFor="university" className="block text-xs font-medium text-gray-700">University</label>
          <input
            type="text"
            id="university"
            name="university"
            className="mt-0.5 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none text-sm p-2 bg-white text-black"
            value={formData.university}
            onChange={handleChange}
            placeholder="University"
            required
          />
        </div>
        <CustomButton variant='purpleGradient' loading={isSubmitting}>Register</CustomButton>
      </form>
      <div className="flex justify-center mt-2 text-blue-500 text-sm w-full">
        <p>Already have an account?</p>
        <Link href="/auth/login" className="mx-1 hover:underline">Login!</Link>
      </div>
      <div className="flex justify-center mt-1 text-blue-500 text-sm w-full">
        <Link href="/" className="mx-1 hover:underline">Go Back To Home</Link>
      </div>
    </div>
  );
};

export default RegisterPage;