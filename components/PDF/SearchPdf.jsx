'use client'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Pdfcard from './Pdfcard'
import { useCustomToast } from '@/hooks/useCustomToast'
import { Loader } from 'lucide-react'

const SearchPdf = ({ handleSearchCollection, setSearchingCollections, searchedCollectionList, setSearchedCollectionList, searchingCollections }) => {
  const [keyword, setKeyword] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const { showToast } = useCustomToast();
  const handleChange = (e) => {
    setKeyword(e.target.value)
  }
  return (
    <div className='flex flex-col gap-2 w-full'>
      <p className='font-semibold text-blue-600'>Search your collections</p>
      <div className='flex flex-col md:flex-row lg:flex-row gap-3 md:gap-2 lg:gap-2'>
        <Input type="text" placeholder="Search your collections" className="w-56 md:w-96 lg:w-96" name="keyword" value={keyword} onChange={handleChange} />
        <div className='flex flex-row gap-1'>
          <Button className="text-xs px-2 md:text-base md:px-4 md:py-2" onClick={() => {
            if (keyword === '') {
              showToast({
                title: 'Search input required',
                description: 'Please enter a keyword to search your collections.',
                variant: 'warning',
              });
            } else {
              handleSearchCollection(keyword)
              setSearchingCollections(true)
              setShowSearchResults(true)
              setShowActions(false)
            }
          }}>Search</Button>
          <Button className="text-xs px-2 md:text-base md:px-4 md:py-2" onClick={() => {
            setKeyword('')
            setSearchedCollectionList([])
            setShowSearchResults(false)
          }
          }>Clear</Button>
        </div>
      </div>
      {/* Search results */}
      {showSearchResults && (
        searchingCollections ? (
          <div className="flex items-center gap-2 text-sm text-gray-500 py-2 px-3">
            <Loader className="w-4 h-4 animate-spin text-black" />
            <span>Searching for collections...</span>
          </div>

        ) : (
          searchedCollectionList && searchedCollectionList.length > 0 ? (
            searchedCollectionList.map((c, index) => (
              <div key={c.id || index} className='mt-3'>
                <Pdfcard id={c.id} article={c.article} author={c.author} doi={c.doi} pdf={c.pdfFile} pubmedId={c.pubmedid} showActions={showActions} />
              </div>
            ))
          ) : (
            <h3 className='text-gray-500 text-sm px-3 py-3'>No Collections Found</h3>
          )
        )
      )}
    </div>
  )
}

export default SearchPdf
