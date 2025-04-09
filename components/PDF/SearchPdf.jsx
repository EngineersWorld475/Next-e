'use client'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { getCollections } from '@/store/pdf-slice'
import useUserId from '@/hooks/useUserId'

const SearchPdf = ({handleSearchCollection, setListOfCollections}) => {
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch() 
  const { user } = useSelector((state) => state.auth)
  const userId = useUserId();
  const handleChange = (e) => {
    setKeyword(e.target.value)
  }
  return (
    <div className='flex flex-col gap-2'>
      <p className='font-semibold text-blue-600'>Search your collections</p>
      <div className='flex flex-col md:flex-row lg:flex-row gap-3 md:gap-2 lg:gap-2'>
        <Input type="text" placeholder="Search your collections" className="w-56 md:w-96 lg:w-96" name="keyword" value={keyword} onChange={handleChange}/>
        <div className='flex flex-row gap-1'>
          <Button className="text-xs px-2 md:text-base md:px-4 md:py-2" onClick={() => handleSearchCollection(keyword)}>Search</Button>
          <Button className="text-xs px-2 md:text-base md:px-4 md:py-2" onClick={() => {
            setKeyword('')
            const collectionList = dispatch(getCollections({userId, authToken: user?.token}))
            setListOfCollections(collectionList)
          }}>Clear</Button>
        </div>
      </div>
    </div>
  )
}

export default SearchPdf
