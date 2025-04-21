'use client';
import { useSearchParams } from 'next/navigation';
import PDFViewer from '@/components/PDF/PdfViewer';

export default function PdfViewerPage() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('url');

  if (!pdfUrl) return <div>PDF not found</div>;

  return <PDFViewer pdfUrl={pdfUrl} />;
}
