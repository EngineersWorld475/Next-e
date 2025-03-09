import Group from '@/components/PDF/Group'
import CreateGroup from '@/components/PDF/GroupCreateForm'
import React from 'react'

const GroupList = () => {
  return (
    <div className='flex flex-col md:flex-row lg:flex-row w-full bg-white p-4 shadow-lg rounded-xl'>
      <div className='w-full md:w-2/3 lg:w-2/3'>
      <Group />
      </div>
      <div className='w-full md:w-1/3 lg:w-1/3'>
      <CreateGroup />
      </div>
    </div>
  )
}

export default GroupList
