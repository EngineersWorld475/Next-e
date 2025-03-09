import { DownloadIcon, EditIcon, GlobeIcon, TrashIcon } from 'lucide-react'
import React from 'react'

const Pdfcard = () => {
  return (
    <div className='flex flex-col md:flex-row lg:flex-row w-full shadow-md mb-4 text-gray-600'>
      <div className='flex-1'>
        <div className='flex flex-col gap-2 px-4 py-4'>
          <h1>mammogram</h1>
          <h1>Author:</h1>
          <h1>Number Of Annotations:</h1>
        </div>
      </div>
      <div className='flex-1'>
        <div className='flex flex-col gap-2 px-4 py-4'>
          <div className='flex flex-row gap-7 items-center'>
            <TrashIcon size={20} className='cursor-pointer' />
            <EditIcon size={20} className='cursor-pointer' />
            <GlobeIcon size={20} className='cursor-pointer' />
            <DownloadIcon size={20} className='cursor-pointer' />
          </div>
          <h1>Pub Med ID:</h1>
          <h1>Comments:</h1>
        </div>
      </div>
      <div className='flex-1'>
        <div className='flex flex-col gap-2 px-4 py-4'>
          <h1>DOI Number:</h1>
          <h1>Closed Access</h1>
        </div>
      </div>
    </div>
  )
}

export default Pdfcard
