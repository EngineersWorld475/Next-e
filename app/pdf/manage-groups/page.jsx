'use client'
import GroupCard from '@/components/PDF/GroupCard'
import CreateGroup from '@/components/PDF/GroupCreateForm'
import React from 'react'

const GroupList = () => {
  return (
    <>
      <h1 className='text-3xl text-customGrayBlue mb-4'>Manage Groups</h1>
      <div className='flex flex-col gap-3 md:flex-row lg:flex-row w-full bg-white p-4 shadow-lg rounded-xl'>
        <div className='w-full md:w-2/3 lg:w-2/3'>
          <h1 className='font-semibold text-gray-500'>Groups</h1>
          <p className='text-sm text-gray-500 mb-3'>Total Groups: <span>3</span></p>
          <GroupCard groupName={'First group'} count={3} />
          <GroupCard groupName={'Second group'} count={2} />
          <GroupCard groupName={'Third group'} count={1} />
        </div>
        <div className='w-full md:w-1/3 lg:w-1/3'>
          <CreateGroup />
        </div>
      </div>
    </>
  )
}

export default GroupList
