'use client';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '../ui/button';
import { Bookmark, ChevronFirst, ChevronLast, ChevronsRight, DownloadIcon, Expand, Eye, FileUp, Minimize2, Printer, Search, Share, ZoomIn, ZoomOut } from 'lucide-react';
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


  // silencing TextLayer task cancelled warning
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('AbortException: TextLayer task cancelled')
      ) {
        return;
      }
      originalWarn(...args);
    };
  
    return () => {
      console.warn = originalWarn;
    };
  }, []);
  
  if (!isClient || !pdfUrl) {
    return <p className="text-center mt-10">Loading pdf...</p>;
  }

  return (
    <div className="relative w-full h-screen overflow-auto">
      <div className="sticky top-0 bg-gray-dark text-white px-4 py-3 flex justify-between items-center gap-4 z-10 relative">

        {/* Left: Navigation */}
        <div className='flex flex-row gap-5 items-center'>
          <button title='Find in Document'>
            <Search size={16} className='cursor-pointer' />
          </button>
          <div className='flex flex-row gap-3 items-center'>
            <button
              title='Previous Page'
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
              className=''
            >
              <ChevronFirst size={18} className='cursor-pointer' />
            </button>
            <span className='text-xs'>
              {pageNumber} / {numPages || '?'}
            </span>
            <button
              title='Next Page'
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}

            >
              <ChevronLast size={18} className='cursor-pointer' />
            </button>
          </div>
        </div>

        {/* Center: Zoom Controls */}
        <div className='md:absolute md:left-1/2 md:-translate-x-1/2 flex flex-row gap-5 items-center'>
          <button title='Zoom In' onClick={zoomIn}>
            <ZoomIn size={18} className='cursor-pointer' />
          </button>
          <button title='Zoom Out' onClick={zoomOut} className='Zoom Out'>
            <ZoomOut size={18} className='cursor-pointer' />
          </button>
          <span className='text-xs'>Zoom: {(scale * 100).toFixed(0)}%</span>
        </div>

        {/* Right section */}
        <div className='flex flex-row gap-5 md:gap-7 lg:gap-7 items-center'>
          <button title='My Annotations'>
            <Eye size={18} className='cursor-pointer text-[#ff6347]' />
          </button>
          <button title='Open File'>
            <FileUp size={18} className='cursor-pointer' />
          </button>
          <button title='Print'>
            <Printer size={18} className='cursor-pointer' />
          </button>
          <button title='Download' onClick={handleDownload}>
            <DownloadIcon size={18} className='cursor-pointer' />
          </button>
          <button title='Current view(copy or open in new window)'>
            <Bookmark size={18} className='cursor-pointer' />
          </button>
          <button title='Share'>
            <Share size={18} className='cursor-pointer text-[#ff6347]' />
          </button>
          <button title='Switch to Presentation Mode' onClick={toggleFullScreen}>
            {isFullScreen ? (
              <Minimize2 size={18} className='cursor-pointer' />
            ) : (
              <Expand size={18} className='cursor-pointer' />
            )}
          </button>
          <button title='Tools'>
            <ChevronsRight size={22} className='cursor-pointer' />
          </button>
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