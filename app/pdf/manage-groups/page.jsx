'use client'
import GroupCard from '@/components/PDF/GroupCard'
import CreateGroup from '@/components/PDF/GroupCreateForm'
import { Button } from '@/components/ui/button'
import useUserId from '@/hooks/useUserId'
import { getGroupsByUserId } from '@/store/group-slice'
import { Loader } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const GroupList = () => {
  const dispatch = useDispatch();
  const userId = useUserId();
  const [isMounting, setIsMounting] = useState(false);
  const { groupList, isLoading } = useSelector((state) => state.group);
  const { user } = useSelector((state) => state.auth);
  const [listOfGroups, setListOfGroups] = useState([]);
  const hasFetchedGroups = useRef(false);

  useEffect(() => {
    if (user?.token && userId && !hasFetchedGroups.current) {
      hasFetchedGroups.current = true;
      dispatch(getGroupsByUserId({ userId, authToken: user?.token }));
    }
  }, [dispatch, userId, user?.token]);

  useEffect(() => {
    setListOfGroups(groupList);
  }, [groupList]);

  return (
    <div className='group bg-white text-black dark:bg-gray-800 dark:text-white rounded-lg relative'>
      <div className='flex flex-col gap-3 md:flex-row lg:flex-row w-full bg-white mt-5 p-0 md:p-1 lg:p-1 shadow-sm rounded-xl dark:bg-gray-800 dark:text-white'>
        {isLoading && isMounting ? (
          <div className='w-full md:w-2/3 lg:w-2/3 bg-white flex justify-center items-center gap-1 dark:bg-gray-800 dark:text-white dark:rounded-lg px-0 md:px-3 lg:px-3 py-0'>
            <Loader className="animate-spin text-gray-600 w-7 h-7 text-center" />
          </div>
        ) : (
          <div className='w-full md:w-2/3 lg:w-2/3 bg-white dark:bg-gray-800 dark:text-white dark:rounded-lg px-0 md:px-3 lg:px-3 py-0'>
            <h1 className='font-semibold text-gray-500 dark:text-white mt-2'>Groups</h1>
            <p className='text-sm text-gray-500 dark:text-white mb-3'>Total Groups: <span>{listOfGroups?.length}</span></p>
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
    </div>
  )
}

export default GroupList