'use client'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const SearchPdf = () => {
  const [key, setKey] = useState('');

  const handleChange = (e) => {
    setKey(e.target.value)
  }
  return (
    <div className='flex flex-col gap-2'>
      <p className='font-semibold text-blue-600'>Search your collections</p>
      <div className='flex flex-col md:flex-row lg:flex-row gap-3 md:gap-2 lg:gap-2'>
        <Input type="text" placeholder="Search your collections" className="w-56 md:w-96 lg:w-96" name="key" value={key} onChange={handleChange}/>
        <div className='flex flex-row gap-1'>
          <Button className="text-xs px-2 md:text-base md:px-4 md:py-2">Search</Button>
          <Button className="text-xs px-2 md:text-base md:px-4 md:py-2" onClick={() => setKey('')}>Clear</Button>
        </div>
      </div>
    </div>
  )
}

export default SearchPdf
