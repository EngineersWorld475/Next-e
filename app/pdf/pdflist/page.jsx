import ListPdf from '@/components/PDF/ListPdf'
import SearchPdf from '@/components/PDF/SearchPdf'
import UploadPdf from '@/components/PDF/UploadPdf'
import React from 'react'


const PdfList = () => {
  return (
    <div className="flex flex-col gap-5 h-screen">
      <h1 className='text-3xl text-customGrayBlue'>Dashboard</h1>
      <div className="flex-1 bg-white shadow-lg flex items-center px-7">
        <UploadPdf />
      </div>
      <div className="flex-1 bg-white shadow-lg flex items-center px-7">
        <SearchPdf />
      </div>
      <div className="flex-1 bg-white shadow-lg flex items-center px-7">
        <ListPdf />
      </div>
    </div>
  )
}

export default PdfList
