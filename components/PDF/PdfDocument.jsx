'use client';
import { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent } from '../ui/card';
import { useCustomToast } from '@/hooks/useCustomToast';

export default function PdfDocument({
  pdfUrl,
  numPages,
  pageNumber,
  scale,
  rotation,
  tool,
  searchText,
  renderedPages,
  setRenderedPages,
  pageRefs,
  pdfContainerRef,
  onDocumentLoadSuccess,
  setHasTextLayer,
  textLayerRef,
  setSearchResults,
  setCurrentMatch,
  showToast,
  isZoomingRef,
  scrollMode,
  searchResults,
  currentMatch,
  scrollToMatch,
  highlightAll,
  matchCase,
}) {
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const scrollSpeedFactor = 0.3;
  const visibleRange = 4;

  useEffect(() => {
    const container = pdfContainerRef.current;
    if (!container || tool !== 'hand') return;

    let animationFrameId = null;

    const handleMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
      if (!isPanning) return;

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const dx = (panStart.x - e.clientX) * scrollSpeedFactor;
        const dy = (panStart.y - e.clientY) * scrollSpeedFactor;
        if (scrollMode === 'vertical') {
          container.scrollLeft += dx;
          container.scrollTop += dy;
        } else if (scrollMode === 'horizontal') {
          container.scrollLeft += dx;
          container.scrollTop = 0;
        } else if (scrollMode === 'wrapped') {
          container.scrollLeft += dx;
          container.scrollTop += dy;
        }
        setPanStart({ x: e.clientX, y: e.clientY });
      });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };

    const disablePointerEvents = () => {
      const canvases = container.querySelectorAll('.react-pdf__Page__canvas');
      const textLayers = container.querySelectorAll('.react-pdf__Page__textLayer');
      canvases.forEach((canvas) => (canvas.style.pointerEvents = 'none'));
      textLayers.forEach((textLayer) => (textLayer.style.pointerEvents = 'none'));
    };

    const restorePointerEvents = () => {
      const canvases = container.querySelectorAll('.react-pdf__Page__canvas');
      const textLayers = container.querySelectorAll('.react-pdf__Page__textLayer');
      canvases.forEach((canvas) => (canvas.style.pointerEvents = 'auto'));
      textLayers.forEach((textLayer) => (textLayer.style.pointerEvents = 'auto'));
    };

    if (tool === 'hand') {
      container.style.userSelect = 'none';
      disablePointerEvents();
      container.addEventListener('mousedown', handleMouseDown, { capture: true });
      container.addEventListener('mousemove', handleMouseMove, { capture: true });
      container.addEventListener('mouseup', handleMouseUp, { capture: true });
      container.addEventListener('mouseleave', handleMouseUp, { capture: true });
    }

    return () => {
      container.style.userSelect = 'auto';
      restorePointerEvents();
      container.removeEventListener('mousedown', handleMouseDown, { capture: true });
      container.removeEventListener('mousemove', handleMouseMove, { capture: true });
      container.removeEventListener('mouseup', handleMouseUp, { capture: true });
      container.removeEventListener('mouseleave', handleMouseUp, { capture: true });
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [tool, isPanning, pdfContainerRef, scrollMode]);

  const onPageRenderSuccess = async (pageNumber) => {
    try {
      const page = await pdfjs.getDocument(decodeURIComponent(pdfUrl)).promise.then((pdf) => pdf.getPage(pageNumber));
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item) => item.str).join(' ');
      textLayerRef.current[pageNumber] = text;
      console.log(`Text extracted for page ${pageNumber}:`, text.substring(0, 100) + '...');
      if (!text.trim()) {
        console.warn(`No text content found on page ${pageNumber}. PDF may lack text layer.`);
        setHasTextLayer(false);
      } else {
        setHasTextLayer(true);
      }
      setRenderedPages((prev) => ({ ...prev, [pageNumber]: true }));
    } catch (error) {
      console.error('Error extracting text:', error);
      setHasTextLayer(false);
    }
  };

  const searchInPDF = (text) => {
    if (!text) {
      setSearchResults([]);
      setCurrentMatch(0);
      return;
    }

    const matches = [];
    let globalMatchIndex = 0;

    Object.keys(textLayerRef.current).forEach((pageNum) => {
      const pageText = textLayerRef.current[pageNum] || '';
      let index = 0;
      while (index !== -1) {
        index = matchCase
          ? pageText.indexOf(text, index)
          : pageText.toLowerCase().indexOf(text.toLowerCase(), index);
        if (index !== -1) {
          matches.push({
            page: parseInt(pageNum),
            startIndex: index,
            endIndex: index + text.length,
            matchIndex: globalMatchIndex++,
          });
          index += text.length;
        }
      }
    });

    setSearchResults(matches);
    setCurrentMatch(0);
    console.log(`Found ${matches.length} matches for "${text}" (matchCase: ${matchCase})`);

    if (matches.length > 0) {
      const firstMatchPage = pageRefs.current[matches[0].page - 1];
      if (firstMatchPage) {
        firstMatchPage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => scrollToMatch(matches[0]), 500);
      }
    } else {
      console.log(`No matches found for "${text}"`);
    }
  };

  useEffect(() => {
    searchInPDF(searchText);
  }, [searchText, matchCase]);

  return (
    <div
      ref={pdfContainerRef}
      className={`flex dark:bg-gray-800 ${scrollMode === 'vertical'
        ? 'flex-col'
        : scrollMode === 'horizontal'
          ? 'flex-row'
          : 'flex-row flex-wrap'
        } items-center py-3 overflow-auto will-change-transform ${tool === 'hand' ? (isPanning ? 'cursor-grabbing hand-tool-active' : 'cursor-grab hand-tool-active') : 'cursor-default'
        }`}
      style={{
        maxHeight: 'calc(100vh - 60px)',
        ...(scrollMode === 'horizontal' ? { overflowY: 'hidden' } : {}),
        ...(scrollMode === 'wrapped' ? { justifyContent: 'center', gap: '1rem' } : {}),
      }}
    >
      <Document
        file={decodeURIComponent(pdfUrl)}
        onLoadSuccess={onDocumentLoadSuccess}
        className={`flex ${scrollMode === 'vertical'
          ? 'flex-col'
          : scrollMode === 'horizontal'
            ? 'flex-row'
            : 'flex-row flex-wrap'
          } items-center`}
        loading={
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
              <div className="w-12 h-12 animate-spin text-gray-500" />
              <p className="text-sm text-gray-600 font-medium">Loading PDF document...</p>
            </div>
          </div>
        }
        onLoadError={(error) => {
          console.error('PDF load error:', error);
          showToast({
            title: 'Error',
            description: 'Failed to load PDF',
            variant: 'error',
          });
        }}
      >
        {Array.from({ length: numPages || 0 }, (_, index) => {
          const pageNum = index + 1;
          const isRendered = renderedPages[pageNum];
          const isInView = Math.abs(pageNumber - pageNum) <= visibleRange;

          return (
            <div
              key={pageNum}
              ref={(el) => (pageRefs.current[index] = el)}
              data-page-number={pageNum}
              className={`mb-6 relative ${scrollMode === 'horizontal' ? 'mr-6' : scrollMode === 'wrapped' ? 'm-2' : ''
                }`}
              style={scrollMode === 'wrapped' ? { flex: '0 0 auto', maxWidth: '45%' } : {}}
            >
              {(isInView || renderedPages[pageNum]) ? (
                <>
                  <Card
                    className={`w-[210mm] h-[297mm] max-w-[90vw] bg-white border border-gray-300 rounded-lg shadow-md flex flex-col justify-center items-center p-6 mx-auto ${isRendered ? 'hidden' : 'block'
                      }`}
                    style={{ transition: 'opacity 0.3s ease' }}
                  >
                    <CardContent className="w-full relative z-10">
                      <div className="space-y-4 mt-4">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
                        <div className="h-5 bg-gray-200 rounded w-5/6 mx-auto animate-pulse" />
                        <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto animate-pulse" />
                        <div className="h-5 bg-gray-200 rounded w-4/5 mx-auto animate-pulse" />
                      </div>
                      <div className="mt-6 flex justify-center">
                        <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
                          <div className="w-8 h-8 animate-spin text-gray-500" />
                          <p className="text-sm text-gray-600 font-medium">Loading page {pageNum}...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className={`transition-opacity duration-300 ${isRendered ? 'opacity-100' : 'opacity-0'}`}>
                    <Page
                      pageNumber={pageNum}
                      canvasBackground='#f2f2f2'
                      renderTextLayer={true}
                      renderAnnotationLayer={!isZoomingRef.current}
                      scale={scale}
                      rotate={rotation}
                      onRenderSuccess={() => onPageRenderSuccess(pageNum)}
                      customTextRenderer={({ str }) => {
                        if (!searchText || !searchResults || searchResults.length === 0) return str;

                        let lowerStr = str;
                        const searchTextForMatch = matchCase ? searchText : searchText.toLowerCase();
                        let index = 0;
                        let parts = [];
                        let absoluteIndex = textLayerRef.current[pageNum]?.indexOf(str) || 0;

                        while (index !== -1) {
                          index = matchCase
                            ? str.indexOf(searchText, index)
                            : str.toLowerCase().indexOf(searchTextForMatch, index);
                          if (index === -1) {
                            if (parts.length === 0) return str;
                            break;
                          }

                          const absoluteStartIndex = absoluteIndex + index;
                          const match = searchResults.find(
                            (m) => m.page === pageNum && m.startIndex === absoluteStartIndex
                          );

                          if (match) {
                            const matchText = str.slice(index, index + searchText.length);
                            const highlightStyle =
                              highlightAll && match.matchIndex !== currentMatch
                                ? 'background-color: #FADADD; color: black; padding: 2px 4px;'
                                : match.matchIndex === currentMatch
                                  ? 'background-color: red; color: white; padding: 2px 4px;'
                                  : '';

                            if (highlightStyle) {
                              parts.push(str.slice(0, index));
                              parts.push(
                                `<mark class="search-match${match.matchIndex === currentMatch ? ' active-match' : ''}" data-match-index="${match.matchIndex}" style="${highlightStyle}">${matchText}</mark>`
                              );
                            } else {
                              parts.push(str.slice(0, index + searchText.length));
                            }
                          } else {
                            parts.push(str.slice(0, index + searchText.length));
                          }

                          str = str.slice(index + searchText.length);
                          lowerStr = lowerStr.slice(index + searchText.length);
                          absoluteIndex += index + searchText.length;
                          index = 0;
                        }

                        if (parts.length > 0) {
                          parts.push(str);
                          return parts.join('');
                        }

                        return str;
                      }}
                    />
                  </div>
                </>
              ) : (
                <div
                  className={`w-[210mm] h-[297mm] bg-gray-100 rounded animate-pulse ${scrollMode === 'horizontal' ? 'mr-6' : scrollMode === 'wrapped' ? 'm-2' : ''
                    }`}
                  style={scrollMode === 'wrapped' ? { flex: '0 0 auto', maxWidth: '45%' } : {}}
                />
              )}
            </div>
          );
        })}
      </Document>
    </div>
  );
}