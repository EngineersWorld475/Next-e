'use client';
import React from 'react';
import { Document, Page } from 'react-pdf';

const PdfSidebar = ({
  showThumbnails,
  pdfUrl,
  numPages,
  pageNumber,
  thumbnailRendered,
  setThumbnailRendered,
  goToPage,
  searchText,
}) => {
  const thumbnailScale = 0.2;

  const onThumbnailRenderSuccess = (pageNumber) => {
    setThumbnailRendered((prev) => ({ ...prev, [pageNumber]: true }));
  };

  return (
    <div
      className={`bg-gray-300 dark:bg-gray-700 h-full items-center overflow-y-auto transform transition-transform duration-300 ease-in-out`}
      style={{
        transform: showThumbnails ? 'translateX(0)' : 'translateX(-100%)',
        width: '12rem',
        maxHeight: '100vh',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 20,
        boxShadow: showThumbnails ? '2px 0 10px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      {showThumbnails && (
        <div className="flex justify-center items-center">
          <Document
            file={decodeURIComponent(pdfUrl)}
            onLoadSuccess={() => {}}
            loading={
              <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
                <div className="w-6 h-6 animate-spin text-gray-500" />
                <p className="text-sm text-gray-600 font-medium">Loading thumbnails...</p>
              </div>
            }
          >
            {Array.from({ length: numPages || 0 }, (_, index) => {
              const pageNum = index + 1;
              const isThumbnailRendered = thumbnailRendered[pageNum];
              return (
                <div
                  key={`thumbnail-${pageNum}`}
                  className={`mb-2 cursor-pointer rounded border-2 ${pageNumber === pageNum ? 'border-[#ff6347]' : 'border-transparent'} transition-colors`}
                  onClick={() => goToPage(pageNum)}
                >
                  <div className="relative">
                    {!isThumbnailRendered && (
                      <div className="w-full h-32 flex items-center justify-center bg-gray-200">
                        <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
                          <div className="w-6 h-6 animate-spin text-gray-500" />
                          <p className="text-sm text-gray-600 font-medium">Page {pageNum}</p>
                        </div>
                      </div>
                    )}
                    <Page
                      pageNumber={pageNum}
                      scale={thumbnailScale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      onRenderSuccess={() => onThumbnailRenderSuccess(pageNum)}
                      customTextRenderer={({ str }) => {
                        if (!searchText) return str;

                        const lowerStr = str.toLowerCase();
                        const lowerSearch = searchText.toLowerCase();

                        if (!lowerStr.includes(lowerSearch)) {
                          return str;
                        }

                        const parts = [];
                        let lastIndex = 0;

                        while (true) {
                          const index = lowerStr.indexOf(lowerSearch, lastIndex);
                          if (index === -1) {
                            parts.push(str.slice(lastIndex));
                            break;
                          }

                          if (index > lastIndex) {
                            parts.push(str.slice(lastIndex, index));
                          }

                          parts.push(
                            <mark key={index} style={{ backgroundColor: 'yellow', color: 'black', padding: 0 }}>
                              {str.slice(index, index + searchText.length)}
                            </mark>
                          );

                          lastIndex = index + searchText.length;
                        }

                        return parts;
                      }}
                      className={`transition-opacity duration-300 ${isThumbnailRendered ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <div className="absolute bottom-1 left-1 bg-gray-800 text-white text-xs px-1 rounded">
                      {pageNum}
                    </div>
                  </div>
                </div>
              );
            })}
          </Document>
        </div>
      )}
    </div>
  );
}

export default React.memo(PdfSidebar);