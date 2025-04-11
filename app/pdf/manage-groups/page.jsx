'use client'
import GroupCard from '@/components/PDF/GroupCard'
import CreateGroup from '@/components/PDF/GroupCreateForm'
import { Button } from '@/components/ui/button'
import useUserId from '@/hooks/useUserId'
import { getGroupsByUserId } from '@/store/group-slice'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GroupList = () => {
  const dispatch = useDispatch();
  const userId = useUserId();
  const [isMounting, setIsMounting] = useState(false);
  const { groupList, isLoading } = useSelector((state) => state.group);
  const { user } = useSelector((state) => state.auth);
  const [listOfGroups, setListOfGroups] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if(user?.token) {
      dispatch(getGroupsByUserId({ userId, authToken: user?.token }))
    }
  }, [dispatch, userId, user?.token])

  useEffect(() => {
    setIsMounting(true)
  }, [])
  useEffect(() => {
    setListOfGroups(groupList);
  }, [groupList]);
  return (
    <div className='group border-l-4 border-l-transparent hover:border-blue-600 hover:dark:border-gray-300 bg-white text-black dark:bg-black dark:text-white rounded-lg relative'>
      <Button className="absolute top-0 right-7 bg-red-500 hover:bg-red-600 dark:bg-gray-300 dark:text-black shadow-lg hidden md:block" onClick={() => {
        router.push('/pdf/pdflist')
      }}>Go To Dashboard</Button>
      <h1 className='text-xl md:text-3xl lg:text-3xl text-customGrayBlue mb-4 px-5'>Manage Groups</h1>
      <div className='flex flex-col gap-3 md:flex-row lg:flex-row w-full bg-white p-4 shadow-lg rounded-xl dark:bg-gray-900 dark:text-white'>
        {isLoading && isMounting ? (
          <div className='w-full md:w-2/3 lg:w-2/3 bg-white flex justify-center items-center gap-1 dark:bg-black dark:text-white dark:rounded-lg px-3 py-2'>
            <Loader2 className="animate-spin h-5 w-5 text-center" />
          </div>
        ) : (
          <div className='w-full md:w-2/3 lg:w-2/3 bg-white dark:bg-black dark:text-white dark:rounded-lg px-3 py-2'>
            <h1 className='font-semibold text-gray-500 mt-2'>Groups</h1>
            <p className='text-sm text-gray-500 mb-3'>Total Groups: <span>{listOfGroups?.length}</span></p>
            {listOfGroups?.length > 0 ? (
              listOfGroups?.map((group) => (
                <GroupCard
                  key={group?.GroupId || group.GroupName}
                  groupName={group?.GroupName}
                  emails={group?.Groupmails}
                  count={group?.Members}
                  groupId={group?.GroupId}
                  setIsMounting={setIsMounting}
                  setListOfGroups={setListOfGroups}
                  listOfGroups={listOfGroups}
                />
              ))
            ) : (
              <p>No groups found</p>
            )}
          </div>
        )}
        <div className='w-full md:w-1/3 lg:w-1/3'>
          <CreateGroup setIsMounting={setIsMounting} listOfGroups={listOfGroups} setListOfGroups={setListOfGroups} />
        </div>
      </div>
    </ div>
  )
}

export default GroupList
