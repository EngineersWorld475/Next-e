import ListPdf from '@/components/PDF/Pdfcard'
import SearchPdf from '@/components/PDF/SearchPdf'
import UploadPdf from '@/components/PDF/UploadPdf'
import React from 'react'


const PdfList = () => {
  return (
    <div className="flex flex-col gap-5 h-screen">
      <h1 className='text-3xl text-customGrayBlue'>Dashboard</h1>
      <div className="bg-white shadow-lg flex items-center px-7 py-10 md:py-7 lg:py-7">
        <UploadPdf />
      </div>
      <div className="bg-white shadow-lg flex items-center px-7 py-10 md:py-7 lg:py-7">
        <SearchPdf />
      </div>
      <div className=" bg-white shadow-lg flex flex-col px-7">
        <h1 className='font-semibold text-blue-600 my-3'>My collections</h1>
        <ListPdf />
        <ListPdf />
      </div>
    </div>
  )
}

export default PdfList
