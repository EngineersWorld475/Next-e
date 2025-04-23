'use client';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '../ui/button';
import { DownloadIcon, Maximize2, Minimize2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export default function PDFViewer({ pdfUrl }) {
  const [selectedText, setSelectedText] = useState('');
  const [question, setQuestion] = useState('');
  const [showBox, setShowBox] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!pdfUrl) setShowBox(false);
  }, [pdfUrl]);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection().toString();
      if (selection.length > 0) {
        setSelectedText(selection);
        setShowBox(true);
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'document.pdf';
    link.click();
  };

  const handleSubmit = () => {
    const data = {
      id: uuid(),
      selectedText,
      question,
    };
    console.log('Submitted Question:', data);
    setShowBox(false);
    setQuestion('');
    setSelectedText('');
  };


  if (!isClient || !pdfUrl) {
    return <p className="text-center mt-10">Loading pdf...</p>;
  }

  return (
    <div className="relative w-full h-screen overflow-auto">
      <div className="sticky top-0 bg-gray-100 px-4 py-6 flex justify-between items-center gap-4 z-10">
        <div className='flex flex-row gap-2 items-center'>
          <Button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            variant="outline"
          >
            Previous
          </Button>
          <span>
            Page {pageNumber} of {numPages || '?'}
          </span>
          <Button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
        <div className='flex flex-row gap-2 items-center'>
          <Button onClick={zoomIn} variant="outline">
            Zoom In
          </Button>
          <Button onClick={zoomOut} variant="outline">
            Zoom Out
          </Button>
          <span>Zoom: {(scale * 100).toFixed(0)}%</span>
        </div>
        <div className='flex flex-row gap-2 items-center'>
          <Button onClick={handleDownload} variant="outline">
            <DownloadIcon size={16} className="mr-2" />
            Download
          </Button>
          <Button onClick={toggleFullScreen} variant="outline">
            {isFullScreen ? (
              <Minimize2 size={16} className="mr-2" />
            ) : (
              <Maximize2 size={16} className="mr-2" />
            )}
            {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          </Button>
        </div>
      </div>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} className="flex justify-center items-center py-3">
        <Page
          pageNumber={pageNumber}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          scale={scale}
        />
      </Document>

      {showBox && (
        <div className="fixed bottom-6 left-6 p-4 bg-white border shadow-md rounded w-96 z-50">
          <p className="mb-2 text-sm text-gray-700 font-medium">
            Selected: <i>{selectedText}</i>
          </p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="w-full border p-2 rounded text-sm mb-2"
            placeholder="Ask your question here..."
          />
          <Button onClick={handleSubmit}>Submit Question</Button>
        </div>
      )}
    </div>
  );
}