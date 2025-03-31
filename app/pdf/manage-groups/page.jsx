'use client'
import GroupCard from '@/components/PDF/GroupCard'
import CreateGroup from '@/components/PDF/GroupCreateForm'
import useUserId from '@/hooks/useUserId'
import { getGroupsByUserId } from '@/store/group-slice'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GroupList = () => {
  const dispatch = useDispatch();
  const userId = useUserId();
  const [isMounting, setIsMounting] = useState(false);
  const { groupList, isLoading } = useSelector((state) => state.group);

  useEffect(() => {
    dispatch(getGroupsByUserId({ userId }))
  }, [dispatch, userId])

  useEffect(() => {
    setIsMounting(true)
  }, [])

  return (
    <div className='bg-white text-black dark:bg-black dark:text-white'>
      <h1 className='text-xl md:text-3xl lg:text-3xl text-customGrayBlue mb-4'>Manage Groups</h1>
      <div className='flex flex-col gap-3 md:flex-row lg:flex-row w-full bg-white p-4 shadow-lg rounded-xl dark:bg-gray-900 dark:text-white'>
        {isLoading && isMounting ? (
          <div className='w-full md:w-2/3 lg:w-2/3 bg-white flex justify-center items-center gap-1 dark:bg-black dark:text-white dark:rounded-lg px-3 py-2'>
            <Loader2 className="animate-spin h-5 w-5 text-center" />
          </div>
        ) : (
          <div className='w-full md:w-2/3 lg:w-2/3 bg-white dark:bg-black dark:text-white dark:rounded-lg px-3 py-2'>
          <h1 className='font-semibold text-gray-500 mt-2'>Groups</h1>
          <p className='text-sm text-gray-500 mb-3'>Total Groups: <span>{groupList?.length}</span></p>
          {groupList?.length > 0 ? (
            groupList?.map((group, index) => (
              <GroupCard
                key={group?.groupId || `group-${index}`} 
                groupName={group?.groupName}
                emails={group?.tags}
                count={group?.tags?.length}
                groupId={group?.groupId}
                setIsMounting={setIsMounting}
              />
            ))
          ) : (
            <p>No groups found</p>
          )}
        </div>
        )}
        <div className='w-full md:w-1/3 lg:w-1/3'>
          <CreateGroup setIsMounting={setIsMounting}/>
        </div>
      </div>
    </ div>
  )
}

export default GroupList
