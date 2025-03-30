'use client'
import GroupCard from '@/components/PDF/GroupCard'
import CreateGroup from '@/components/PDF/GroupCreateForm'
import useUserId from '@/hooks/useUserId'
import { getGroupsByUserId } from '@/store/group-slice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GroupList = () => {
  const dispatch = useDispatch();
  const userId = useUserId();
  const { groupList } = useSelector((state) => state.group)

  useEffect(() => {
    dispatch(getGroupsByUserId({ userId }))
  }, [dispatch, userId])
  console.log('....groupList', groupList);
  return (
    <div className='bg-white text-black dark:bg-black dark:text-white'>
      <h1 className='text-xl md:text-3xl lg:text-3xl text-customGrayBlue mb-4'>Manage Groups</h1>
      <div className='flex flex-col gap-3 md:flex-row lg:flex-row w-full bg-white p-4 shadow-lg rounded-xl dark:bg-gray-900 dark:text-white'>
        <div className='w-full md:w-2/3 lg:w-2/3 bg-white dark:bg-black dark:text-white dark:rounded-lg px-3 py-2'>
          <h1 className='font-semibold text-gray-500 mt-2'>Groups</h1>
          <p className='text-sm text-gray-500 mb-3'>Total Groups: <span>3</span></p>
          {groupList?.length > 0 ? (
            groupList?.map((group, index) => (
              <GroupCard
                key={group?.groupId || `group-${index}`}  // Ensure key is unique
                groupName={group?.groupName}
                emails={group?.tags}
                count={group?.tags?.length}
              />
            ))
          ) : (
            <p>No groups found</p>
          )}
        </div>
        <div className='w-full md:w-1/3 lg:w-1/3'>
          <CreateGroup />
        </div>
      </div>
    </ div>
  )
}

export default GroupList
