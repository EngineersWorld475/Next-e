'use client'
import ProfileCard from '@/components/User/ProfileCard'
import { getUserDetails } from '@/store/user-slice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const page = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userprofile);


  useEffect(() => {
    if (!userData) { // Fetch only if data is not available in userData
      dispatch(getUserDetails(23));
    }
  }, [dispatch, userData])

  return (
    <div className='flex flex-col justify-center items-center mt-2'>
      <h1 className='text-2xl font-semibold'>User profile</h1>
      <div className='mt-5'>
        <ProfileCard userProfileData={userData} />
      </div>
    </div>
  )
}

export default page
