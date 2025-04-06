'use client'
import Pdfcard from '@/components/PDF/Pdfcard'
import SearchPdf from '@/components/PDF/SearchPdf'
import UploadPdf from '@/components/PDF/UploadPdf'
import useUserId from '@/hooks/useUserId'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deletePdf, getCollections, saveFile } from '@/store/pdf-slice';
import { useCustomToast } from '@/hooks/useCustomToast';

const PdfList = () => {
  const { collectionList } = useSelector((state) => state.collection);
  const { user } = useSelector((state) => state.auth);
  const [listOfCollections, setListOfCollections] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ article: '', url: '', pubmedid: '', author: '', doi: '' });
  const { showToast } = useCustomToast()
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)
  const userId = useUserId();

  const handleUploadCollection = async () => {
    try {
      setIsSubmitting(true)
      if (!user?.token) {
        showToast({
          title: "unauthorized",
          variant: "warning"
        })
      }

      const form = new FormData();
      form.append('article', formData.article);
      form.append('url', formData.url);
      form.append('pubmedid', formData.pubmedid);
      form.append('author', formData.author);
      form.append('doi', formData.doi);
      form.append('userId', userId);

      const result = await dispatch(saveFile({ formData: form, authToken: user?.token }))
      if (result?.payload?.success) {
        const newCollection = {
          id: Date.now().toString(),
          article: formData?.article,
          pubmedid: formData?.pubmedid,
          author: formData?.author,
          doi: formData?.doi,
          userId: userId,
          pdfFile: formData?.url, 
          createdAt: new Date().toISOString(),
        };
        setListOfCollections((prevCollections) => Array.isArray(prevCollections) ? [...prevCollections, newCollection] : [newCollection])
        dispatch(getCollections({ userId, authToken: user?.token }))
        showToast({ title: "Upload successful!", variant: "success" });
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // resets the file input
        }
        setFileUrl(null)
        setFile(null)
        setFormData({
          article: '',
          url: '',
          pubmedid: '',
          author: '',
          doi: '',
          userId: ''
        })
      } else {
        showToast({ title: result?.payload?.message || "Upload failed", variant: "error" });
      }
    } catch (err) {
      showToast({
        title: err || "Something went wrong. Please try again ",
        variant: "error"
      })
    } finally {
      setIsSubmitting(false)
    }

  }

  const handleDeleteCollection = (id) => {
    try {
      dispatch(deletePdf({userId, id, authToken: user?.token})).then((result) => {
        if(result?.payload?.success) {
          setListOfCollections((prevCollections) => prevCollections.filter((collection) => collection.id !== id));
          dispatch(getCollections({ userId, authToken: user?.token }))
          showToast({ title: result?.payload?.message || "Collection deleted successfully", variant: "success" });
        } else {
          showToast({ title: "Can not delete collection", variant: "error" });
        }
      })
    } catch (error) {
      console.log(error || "Something went wrong. Please try again later")
    }
  }

  useEffect(() => {
    if (user?.token) {
      dispatch(getCollections({ userId, authToken: user?.token }))
    }
  }, [dispatch, userId])

  useEffect(() => {
    if (Array.isArray(collectionList)) {
      setListOfCollections(collectionList);
    }
  }, [collectionList]);
  


  return (
    <div className="flex flex-col gap-5 h-screen bg-white dark:bg-black dark:text-white">
      <h1 className='text-xl md:text-3xl lg:text-3xl text-customGrayBlue'>Dashboard</h1>
      <div className="bg-white shadow-lg flex items-center px-7 py-10 md:py-7 lg:py-7 dark:bg-gray-900 dark:text-white dark:rounded-lg">
        <UploadPdf setFile={setFile} fileUrl={fileUrl} setFileUrl={setFileUrl} formData={formData} setFormData={setFormData} isSubmitting={isSubmitting} fileInputRef={fileInputRef} handleUploadCollection={handleUploadCollection} />
      </div>
      <div className="bg-white shadow-lg flex items-center px-7 py-10 md:py-7 lg:py-7 dark:bg-gray-900 dark:text-white dark:rounded-lg">
        <SearchPdf />
      </div>
      <div className=" bg-white shadow-lg flex flex-col px-7  dark:bg-gray-900 dark:text-white dark:rounded-lg flex-1">
        <h1 className='font-semibold text-blue-600 my-3'>My collections</h1>
        {
          listOfCollections && listOfCollections.length > 0 && (
            listOfCollections.map((collection, index) => (
              <Pdfcard key={collection.id || index} article={collection.article} author={collection.author} doi={collection.doi} id={collection.id} pdf={collection.pdfFile} pubmedId={collection.pubmedid} handleDeleteCollection={handleDeleteCollection} />
            ))
          )
        }
      </div>
    </div>
  )
}

export default PdfList
