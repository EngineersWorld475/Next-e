'use client'
import Pdfcard from '@/components/PDF/Pdfcard'
import SearchPdf from '@/components/PDF/SearchPdf'
import UploadPdf from '@/components/PDF/UploadPdf'
import useUserId from '@/hooks/useUserId'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deletePdf, getCollections, saveFile, searchPdf } from '@/store/pdf-slice';
import { useCustomToast } from '@/hooks/useCustomToast';

const PdfList = () => {
  const { collectionList } = useSelector((state) => state.collection);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userId = useUserId();
  const { showToast } = useCustomToast();

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [searchingCollections, setSearchingCollections] = useState(false);
  const [searchedCollectionList, setSearchedCollectionList] = useState([]);
  const [listOfCollections, setListOfCollections] = useState([]);
  const [showActions, setShowActions] = useState(false);
  const [formData, setFormData] = useState({
    article: '',
    url: '',
    pubmedid: '',
    author: '',
    doi: '',
    file: ''
  });

  // Upload collection
  const handleUploadCollection = useCallback(async () => {
    try {
      setLoadingCollections(false)
      setIsSubmitting(true)
      if (!user?.token) {
        showToast({
          title: "Unauthorized",
          description: "Please log in to continue.",
          variant: "warning",
        });
      }

      const form = new FormData();
      form.append('article', formData.article);
      form.append('url', formData.url);
      form.append('pubmedid', formData.pubmedid);
      form.append('author', formData.author);
      form.append('doi', formData.doi);
      form.append('userId', userId)
      form.append('file', formData.file);

      const result = await dispatch(saveFile({ formData: form, authToken: user?.token }));
      // if (result?.payload) {
      //   showToast({
      //     title: result?.payload,
      //     variant: "success"
      //   })
      // }
      if (result?.payload) {
        const newCollection = {
          id: Date.now().toString(),
          article: formData?.article,
          pubmedid: formData?.pubmedid,
          author: formData?.author,
          doi: formData?.doi,
          userId: userId,
          pdfFile: formData?.file,
          createdAt: new Date().toISOString(),
        };
        setListOfCollections((prevCollections) => Array.isArray(prevCollections) ? [...prevCollections, newCollection] : [newCollection])
        dispatch(getCollections({ userId, authToken: user?.token }))
        showToast({
          title: "Collection uploaded successfully!",
          variant: "success",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // resets the file input
        }
        setFileUrl(null)
        setFile(null)
        setFormData({
          article: '',
          url: '',
          file: '',
          pubmedid: '',
          author: '',
          doi: '',
          userId: ''
        })
      } else {
        showToast({
          title: "Upload failed",
          description: result?.payload?.message || "Failed to upload the collection.",
          variant: "destructive",
        });
      }
    } catch (err) {
      showToast({
        title: "Something went wrong",
        description: err?.message || "Unable to upload the collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false)
    }

  }, [dispatch, formData, user?.token, userId, showToast])

  // Delete collection
  const handleDeleteCollection = useCallback(
    async (id) => {
      try {
        setLoadingCollections(false)
        const result = await dispatch(deletePdf({ userId, id, authToken: user?.token }))
        if (result?.payload?.success) {
          setListOfCollections((prev) => prev.filter((c) => c.id !== id))
          dispatch(getCollections({ userId, authToken: user?.token }))
          showToast({
            title: "Collection deleted successfully!",
            variant: "success",
          });
        } else {
          showToast({
            title: "Failed to delete collection",
            description: result?.payload?.message || "Something went wrong while deleting.",
            variant: "destructive",
          });
        }
      } catch (error) {
        showToast({
          title: "Error deleting collection",
          description: error?.message || "Please try again later.",
          variant: "destructive",
        });
      }
    }, [dispatch, userId, user?.token, showToast])

  // Search collection
  const handleSearchCollection = useCallback((keyword) => {
    setSearchingCollections(true)
    try {
      dispatch(searchPdf({ keyword, userId, authToken: user?.token })).then((result) => {
        setSearchingCollections(false)
        if (result?.payload?.success) {
          setSearchedCollectionList(result?.payload?.data);
        }
      })
    } catch (error) {
      setSearchingCollections(false)
      console.log(error)
    }
  }, [dispatch, userId, user?.token])

  // Fetch collections on mount
  useEffect(() => {
    setShowActions(true)
    setLoadingCollections(true)
    if (user?.token && userId) {
      dispatch(getCollections({ userId, authToken: user?.token })).then((result) => {
        setLoadingCollections(false)
      })
    }
  }, [dispatch, userId, user?.token, showActions])

  useEffect(() => {
    if (Array.isArray(collectionList)) {
      setListOfCollections(collectionList);
    }
  }, [collectionList]);

  useEffect(() => {
    setLoadingCollections(true)
  }, [])

  return (
    <div className="flex flex-col gap-5 h-full bg-white dark:bg-gray-800 dark:text-white">
      <h1 className='text-xl md:text-3xl lg:text-3xl text-customGrayBlue'>Dashboard</h1>
      {/* Upload PDF */}
      <div className="group border-l-4 border-transparent hover:border-blue-600 dark:hover:border-gray-300 bg-white shadow-lg flex items-center px-7 py-10 md:py-7 lg:py-7 dark:bg-gray-900 rounded-lg">
        <UploadPdf setFile={setFile} fileUrl={fileUrl} setFileUrl={setFileUrl} formData={formData} setFormData={setFormData} isSubmitting={isSubmitting} fileInputRef={fileInputRef} handleUploadCollection={handleUploadCollection} />
      </div>
      {/* Search PDF */}
      <div className="group border-l-4 border-transparent hover:border-blue-600 dark:hover:border-gray-300 bg-white shadow-lg flex items-center px-7 py-10 md:py-7 lg:py-7 dark:bg-gray-900 rounded-lg">
        <SearchPdf handleSearchCollection={handleSearchCollection} setSearchingCollections={setSearchingCollections} searchedCollectionList={searchedCollectionList} setSearchedCollectionList={setSearchedCollectionList} searchingCollections={searchingCollections} />
      </div>
      {/* List PDFs */}
      <div className="group border-l-4 border-transparent hover:border-blue-600 dark:hover:border-gray-300 bg-white shadow-lg flex flex-col px-7 flex-1 dark:bg-gray-900 rounded-lg">
        <h1 className='font-semibold text-blue-600 my-3'>My collections</h1>
        {loadingCollections ? (
          <div className="py-5">
            <h3 className='text-gray-500 text-sm'>Loading collections...</h3>
          </div>
        ) : (
          listOfCollections && listOfCollections.length > 0 ? (
            listOfCollections.map((collection, index) => (
              <Pdfcard key={collection.id || index} article={collection.article} author={collection.author} doi={collection.doi} id={collection.id} pdf={collection.pdfFile} pubmedId={collection.pubmedid} handleDeleteCollection={handleDeleteCollection} showActions={showActions} />
            ))
          ) : (
            <div>
              <>
                <h3 className='text-gray-500'>No Collections Found</h3>
              </>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default PdfList
