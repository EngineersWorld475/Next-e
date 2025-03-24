'use client'
import ProfileCard from '@/components/User/ProfileCard'
import { getUserDetails } from '@/store/user-slice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const page = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userprofile);


  useEffect(() => {
    dispatch(getUserDetails(23)) // userid hardcoded beacouse userid is not available in logined user's data
  }, [])

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
