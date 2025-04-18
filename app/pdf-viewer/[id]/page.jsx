'use client';
import { getMockPdfs } from '@/app/api/mock/mockPdfs';
import { Document, Page, pdfjs } from 'react-pdf';


pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export default function PDFViewer({ params }) {
  const { id } = params;
  const pdf = getMockPdfs().find((item) => item.id === id); // this wont work in client component.

  if (!pdf) return <p>PDF not found</p>;

  return (
    <div className="h-screen p-4">
      <Document file={pdf.pdfFile}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}
