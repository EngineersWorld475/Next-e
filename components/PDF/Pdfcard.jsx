'use client'
import { DownloadIcon, EditIcon, GlobeIcon, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

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
            {/* delete dialog */}
            <Dialog>
              <DialogTrigger asChild>
              <TrashIcon size={20} className='cursor-pointer' />
              </DialogTrigger>
             <DialogContent className="flex flex-col justify-center items-center">
             <DialogHeader>
                <DialogTitle>Do you want to delete this collection?</DialogTitle>
              </DialogHeader>
              <div className='flex justify-start items-center gap-3'>
                <Button>Cancel</Button>
                <Button>Ok</Button>
              </div>
             </DialogContent>
             {/* edit dialog */}
            </Dialog>
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
