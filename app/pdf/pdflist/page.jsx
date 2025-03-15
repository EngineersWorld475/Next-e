import ListPdf from '@/components/PDF/Pdfcard'
import SearchPdf from '@/components/PDF/SearchPdf'
import UploadPdf from '@/components/PDF/UploadPdf'
import React from 'react'


const PdfList = () => {
  return (
    <div className="flex flex-col gap-5 h-screen bg-white dark:bg-black dark:text-white">
      <h1 className='text-3xl text-customGrayBlue'>Dashboard</h1>
      <div className="bg-white shadow-lg flex items-center px-7 py-10 md:py-7 lg:py-7 dark:bg-gray-900 dark:text-white dark:rounded-lg">
        <UploadPdf />
      </div>
      <div className="bg-white shadow-lg flex items-center px-7 py-10 md:py-7 lg:py-7 dark:bg-gray-900 dark:text-white dark:rounded-lg">
        <SearchPdf />
      </div>
      <div className=" bg-white shadow-lg flex flex-col px-7  dark:bg-gray-900 dark:text-white dark:rounded-lg">
        <h1 className='font-semibold text-blue-600 my-3'>My collections</h1>
        <ListPdf />
        <ListPdf />
      </div>
    </div>
  )
}

export default PdfList
