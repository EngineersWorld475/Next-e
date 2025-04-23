'use client'
import { useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import PDFViewer from '@/components/PDF/PdfViewer'

export default function PdfViewerPage() {
  const { id } = useParams()
  const { collectionList } = useSelector((state) => state.collection)
  console.log('...collectionList', collectionList);
  const collection = Array.isArray(collectionList)
    ? collectionList.find(item => item.id === id)
    : null

  if (!collection) return <div>PDF not found</div>

  return <PDFViewer pdfUrl={collection?.pdfFile} />
}
