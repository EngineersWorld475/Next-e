'use client'
import ProfileCard from '@/components/User/ProfileCard'
import useUserId from '@/hooks/useUserId';
import { getUserDetails } from '@/store/user-slice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const page = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userprofile);
  const userId = useUserId();

  useEffect(() => {
      dispatch(getUserDetails(userId)); 
  }, [dispatch])

  return (
    <div className='flex flex-col justify-center items-center mt-2 dark:bg-gray-800'>
      <div className='mt-5'>
        <ProfileCard userProfileData={userData} />
      </div>
    </div>
  )
}

export default page
