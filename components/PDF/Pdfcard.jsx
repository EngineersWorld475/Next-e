'use client'
import { DownloadIcon, EditIcon, GlobeIcon, TrashIcon } from 'lucide-react'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import ConfirmDialog from '@/common/ConfirmDialog'

const Pdfcard = ({article, author, doi, id, pdf, pubmedId, handleDeleteCollection}) => {
  return (
    <div className='flex flex-col md:flex-row lg:flex-row w-full shadow-md mb-4 text-gray-600'>
      <div className='flex-1'>
        <div className='flex flex-col gap-2 px-4 py-4'>
          <h1>{article}</h1>
          <h1>Author: <span>{author}</span></h1>
          <h1>Number Of Annotations:</h1>
        </div>
      </div>
      <div className='flex-1'>
        <div className='flex flex-col gap-2 px-4 py-4'>
          <div className='flex flex-row gap-7 items-center'>
            {/* confirm delete dialog */}
            <ConfirmDialog 
             iconTrigger={<TrashIcon size={20} className='cursor-pointer' />}
             title="Do you want to delete this collection?"
             onConfirm={() => handleDeleteCollection(id)}
             onCancel={() => console.log("Cancelled")}
             ButtonStyle={'absolute right-0 bottom-0'}
            />
            {/* edit dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <EditIcon size={20} className='cursor-pointer' />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Pdf Details</DialogTitle>
                </DialogHeader>
                <Form className="flex flex-col gap-2">
                  <div className='flex flex-col md:flex-row lg:flex-row gap-3'>
                    <div>
                      <Label>Pub Med Id</Label>
                      <Input type="text" />
                    </div>
                    <div>
                      <Label>DOI Number</Label>
                      <Input type="text" />
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row lg:flex-row gap-3'>
                    <div>
                      <Label>Article Name</Label>
                      <Input type="text" />
                    </div>
                    <div>
                      <Label>Author</Label>
                      <Input type="text" />
                    </div>
                  </div>
                  <Button type="submit">Submit</Button>
                </Form>
              </DialogContent>
            </Dialog>
            <GlobeIcon size={20} className='cursor-pointer' />
            <DownloadIcon size={20} className='cursor-pointer' />
          </div>
          <h1>Pub Med ID:  <span>{pubmedId}</span></h1>
          <h1>Comments:</h1>
        </div>
      </div>
      <div className='flex-1'>
        <div className='flex flex-col gap-2 px-4 py-4'>
          <h1>DOI Number: <span>{doi}</span></h1>
          <h1>Closed Access</h1>
        </div>
      </div>
    </div>
  )
}

export default Pdfcard
