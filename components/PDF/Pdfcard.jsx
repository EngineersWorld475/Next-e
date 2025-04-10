'use client'
import { DownloadIcon, EditIcon, GlobeIcon, Loader2, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import ConfirmDialog from '@/common/ConfirmDialog'
import { useDispatch, useSelector } from 'react-redux'
import { editPdf, getCollections } from '@/store/pdf-slice'
import useUserId from '@/hooks/useUserId'
import { useCustomToast } from '@/hooks/useCustomToast'

const Pdfcard = ({ article, author, pdf, doi, id, pubmedId, handleDeleteCollection }) => {
  const [editFormData, setEditFormData] = useState({
    article: article || '',
    author: author || '',
    doi: doi || '',
    pubmedId: pubmedId || ''
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch();
  const userId = useUserId();
  const { user } = useSelector((state) => state.auth);
  const { showToast } = useCustomToast();

  const handleChage = (e) => {
    setEditFormData(
      {
        ...editFormData,
        [e.target.name]: e.target.value
      }
    )
  }

  // Edit collection
  const handleEdit = async (e) => {
    setIsSubmitting(true)
    e.preventDefault();
    try {
      const response = await dispatch(editPdf({ id, article: editFormData?.article, pubmedid: editFormData?.pubmedId, author: editFormData?.author, doi: editFormData?.doi, userId: userId, authToken: user?.token }));

      if (response) {
        dispatch(getCollections({ userId, authToken: user?.token }))
        setIsDialogOpen(false)
        showToast({
          title: "Collection updated successfully",
          variant: "success"
        })
      }
    } catch (error) {
      showToast({
        title: error,
        variant: "error"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <EditIcon size={20} className='cursor-pointer' />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Pdf Details</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-2" onSubmit={handleEdit}>
                  <div className='flex flex-col md:flex-row lg:flex-row gap-3'>
                    <div>
                      <Label>Pub Med Id</Label>
                      <Input type="text" name="pubmedId" value={editFormData?.pubmedId} onChange={handleChage} />
                    </div>
                    <div>
                      <Label>DOI Number</Label>
                      <Input type="text" name="doi" value={editFormData?.doi} onChange={handleChage} />
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row lg:flex-row gap-3'>
                    <div>
                      <Label>Article Name</Label>
                      <Input type="text" name="article" value={editFormData?.article} onChange={handleChage} />
                    </div>
                    <div>
                      <Label>Author</Label>
                      <Input type="text" name="author" value={editFormData?.author} onChange={handleChage} />
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting}>{
                    isSubmitting ? (
                      <><Loader2 className="animate-spin h-5 w-5 text-center" /> Submitting... </>
                    ) : (
                      'Submit'
                    )
                  }</Button>
                </form>
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

export default  React.memo(Pdfcard);
