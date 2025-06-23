'use client';
import { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent } from '../ui/card';

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
  selectedColor,
  selectedPenColor,
  annotations
}) {
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const canvasRefs = useRef({});
  const drawingDataRefs = useRef({});
  const scrollSpeedFactor = 0.3;

  const saveCanvasData = (pageNum) => {
    const canvas = canvasRefs.current[pageNum];
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      drawingDataRefs.current[pageNum] = imageData;
    }
  };

  const restoreCanvasData = (pageNum) => {
    const canvas = canvasRefs.current[pageNum];
    const savedData = drawingDataRefs.current[pageNum];
    if (canvas && savedData) {
      const ctx = canvas.getContext('2d');
      ctx.putImageData(savedData, 0, 0);
    }
  };

  const initializeCanvas = (pageNum) => {
    const canvas = canvasRefs.current[pageNum];
    if (canvas) {
      const pageElement = canvas.closest('[data-page-number]');
      const pdfCanvas = pageElement?.querySelector('.react-pdf__Page__canvas');
      if (pdfCanvas) {
        canvas.width = pdfCanvas.width;
        canvas.height = pdfCanvas.height;
        canvas.style.width = pdfCanvas.style.width;
        canvas.style.height = pdfCanvas.style.height;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        restoreCanvasData(pageNum);
      }
    }
  };

  useEffect(() => {
    Object.keys(canvasRefs.current).forEach(pageNum => {
      restoreCanvasData(parseInt(pageNum));
    });
  }, [tool]);

  useEffect(() => {
    setTimeout(() => {
      Object.keys(canvasRefs.current).forEach(pageNum => {
        initializeCanvas(parseInt(pageNum));
      });
    }, 100);
  }, [scale]);

  useEffect(() => {
    const container = pdfContainerRef.current;
    if (!container) return;

    let animationFrameId = null;

    const handleMouseDown = (e) => {
      if (tool === 'hand') {
        e.preventDefault();
        e.stopPropagation();
        setIsPanning(true);
        setPanStart({ x: e.clientX, y: e.clientY });
      } else if (tool === 'pen') {
        const canvas = getCanvasForEvent(e);
        if (canvas) {
          setIsDrawing(true);
          const point = getCanvasCoordinates(e, canvas);
          setLastPoint(point);
        }
      } else if (tool === 'eraser') {
        const canvas = getCanvasForEvent(e);
        if (canvas) {
          setIsErasing(true);
          const point = getCanvasCoordinates(e, canvas);
          eraseAtPoint(canvas, point);
          setLastPoint(point);
        }
      }
    };

    const handleMouseMove = (e) => {
      if (tool === 'hand' && isPanning) {
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
      } else if (tool === 'pen' && isDrawing) {
        const canvas = getCanvasForEvent(e);
        if (canvas && lastPoint) {
          const ctx = canvas.getContext('2d');
          const currentPoint = getCanvasCoordinates(e, canvas);
          drawLine(ctx, lastPoint, currentPoint);
          setLastPoint(currentPoint);
        }
      } else if (tool === 'eraser' && isErasing) {
        const canvas = getCanvasForEvent(e);
        if (canvas && lastPoint) {
          const currentPoint = getCanvasCoordinates(e, canvas);
          eraseLineArea(canvas, lastPoint, currentPoint);
          setLastPoint(currentPoint);
        }
      }
    };

    const handleMouseUp = (e) => {
      if (tool === 'hand') {
        setIsPanning(false);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      } else if (tool === 'pen') {
        if (isDrawing) {
          const canvas = getCanvasForEvent(e);
          if (canvas) {
            const pageNum = parseInt(canvas.closest('[data-page-number]').getAttribute('data-page-number'));
            saveCanvasData(pageNum);
          }
        }
        setIsDrawing(false);
        setLastPoint(null);
      } else if (tool === 'eraser') {
        if (isErasing) {
          const canvas = getCanvasForEvent(e);
          if (canvas) {
            const pageNum = parseInt(canvas.closest('[data-page-number]').getAttribute('data-page-number'));
            saveCanvasData(pageNum);
          }
        }
        setIsErasing(false);
        setLastPoint(null);
      }
    };

    const getCanvasForEvent = (e) => {
      const pageElement = e.target.closest('[data-page-number]');
      if (!pageElement) return null;
      const pageNum = parseInt(pageElement.getAttribute('data-page-number'));
      return canvasRefs.current[pageNum];
    };

    const getCanvasCoordinates = (e, canvas) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      return { x, y };
    };

    const drawLine = (ctx, start, end) => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = selectedPenColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const eraseAtPoint = (canvas, point) => {
      const ctx = canvas.getContext('2d');
      const eraseRadius = 10;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(point.x, point.y, eraseRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    };

    const eraseLineArea = (canvas, start, end) => {
      const ctx = canvas.getContext('2d');
      const eraseRadius = 10;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.lineWidth = eraseRadius * 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    };

    const disablePointerEvents = () => {
      const canvases = container.querySelectorAll('.react-pdf__Page__canvas');
      const textLayers = container.querySelectorAll('.react-pdf__Page__textLayer');
      canvases.forEach((canvas) => (canvas.style.pointerEvents = 'none'));
      textLayers.forEach(
        (textLayer) => (textLayer.style.pointerEvents = tool === 'highlight' || tool === 'text' ? 'auto' : 'none')
      );
    };

    const restorePointerEvents = () => {
      const canvases = container.querySelectorAll('.react-pdf__Page__canvas');
      const textLayers = container.querySelectorAll('.react-pdf__Page__textLayer');
      canvases.forEach((canvas) => (canvas.style.pointerEvents = 'auto'));
      textLayers.forEach((textLayer) => (textLayer.style.pointerEvents = 'auto'));
    };

    if (tool === 'hand' || tool === 'highlight' || tool === 'text' || tool === 'pen' || tool === 'eraser') {
      if (tool === 'hand' || tool === 'pen' || tool === 'eraser') {
        container.style.userSelect = 'none';
        disablePointerEvents();
      } else {
        container.style.userSelect = 'auto';
        disablePointerEvents();
      }
      container.addEventListener('mousedown', handleMouseDown, { capture: true });
      container.addEventListener('mousemove', handleMouseMove, { capture: true });
      container.addEventListener('mouseup', handleMouseUp, { capture: true });
      container.addEventListener('mouseleave', handleMouseUp, { capture: true });
    }

    return () => {
      if (container) {
        container.style.userSelect = 'auto';
        restorePointerEvents();
        container.removeEventListener('mousedown', handleMouseDown, { capture: true });
        container.removeEventListener('mousemove', handleMouseMove, { capture: true });
        container.removeEventListener('mouseup', handleMouseUp, { capture: true });
        container.removeEventListener('mouseleave', handleMouseUp, { capture: true });
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [tool, isPanning, isDrawing, isErasing, lastPoint, pdfContainerRef, scrollMode, selectedColor, selectedPenColor, showToast, scale]);

  const onPageRenderSuccess = async (pageNumber) => {
    try {
      const page = await pdfjs
        .getDocument(decodeURIComponent(pdfUrl))
        .promise.then((pdf) => pdf.getPage(pageNumber));
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item) => item.str).join(' ');
      textLayerRef.current[pageNumber] = text;
      console.log(
        `Text extracted for page ${pageNumber}:`,
        text.substring(0, 100) + '...'
      );
      if (!text.trim()) {
        console.warn(`No text content found on page ${pageNumber}. PDF may lack text layer.`);
        setHasTextLayer(false);
      } else {
        setHasTextLayer(true);
      }
      setRenderedPages((prev) => ({ ...prev, [pageNumber]: true }));

      setTimeout(() => {
        initializeCanvas(pageNumber);
      });
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
            text: pageText.slice(index, index + text.length),
            matchIndex: globalMatchIndex++,
          });
          index += 1;
        }
      }
    });

    setSearchResults(matches);
    setCurrentMatch(0);
    console.log(
      `Found ${matches.length} matches for "${text}" (matchCase: ${matchCase})`
    );

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

  console.log('.....tool', tool)

  return (
    <div
      ref={pdfContainerRef}
      className={`flex dark:bg-gray-800 ${scrollMode === 'vertical'
        ? 'flex-col'
        : scrollMode === 'horizontal'
          ? 'flex-row'
          : 'flex-row flex-wrap'
        } items-center py-3 overflow-auto will-change-transform ${tool === 'hand'
          ? isPanning
            ? 'cursor-grabbing hand-tool-active'
            : 'cursor-grab hand-tool-active'
          : tool === 'highlight' || tool === 'text'
            ? 'cursor-text'
            : tool === 'pen'
              ? 'cursor-crosshair'
              : tool === 'eraser'
                ? 'cursor-pointer'
                : 'cursor-default'
        }`}
      style={{
        maxHeight: 'calc(100vh - 60px)',
        backgroundColor: '#e5e7eb',
        ...(scrollMode === 'horizontal' ? { overflowY: 'hidden' } : {}),
        ...(scrollMode === 'wrapped' ? { justifyContent: 'center', gap: '1rem' } : {}),
      }}
    >
      <div className="pdf-viewer" style={{ '--selected-color': selectedColor, color: 'black' }}>
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
              <div
                className="flex flex-col items-center justify-center gap-3"
                role="status"
                aria-live="alert"
              >
                <div className="w-12 h-12 animate-spin text-gray-500" />
                <p className="text-sm text-gray-600 font-medium">
                  Loading PDF document...
                </p>
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
            const isInView = true;

            // Find annotations for this page
            const pageAnnotations = annotations.filter((ann) => ann.page === pageNum);


            return (
              <div
                key={pageNum}
                ref={(el) => (pageRefs.current[index] = el)}
                data-page-number={pageNum}
                className={`mb-6 relative ${scrollMode === 'horizontal'
                  ? 'mr-6'
                  : scrollMode === 'wrapped'
                    ? 'm-2'
                    : ''
                  }`}
                style={scrollMode === 'wrapped' ? { flex: '0 0 auto', maxWidth: '45%' } : {}}
              >
                {(isInView || renderedPages[pageNum]) ? (
                  <>
                    <Card
                      className={`w-[210mm] h-[297mm] max-w-[90vw] bg-white border border-gray-300 rounded-md shadow-md flex flex-col justify-center items-center p-6 mx-auto ${isRendered ? 'hidden' : 'block'}`}
                      style={{ transition: 'opacity 0.3s ease' }}
                    >
                      <CardContent className="w-full relative z-10">
                        <div className="space-y-4 mt-4">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
                          <div className="h-5 bg-gray-200 rounded w-5/6 mx-auto animate-pulse" />
                          <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto animate-pulse" />
                        </div>
                      </CardContent>
                    </Card>
                    <div
                      className={`transition-opacity duration-300 ${isRendered ? 'opacity-100' : 'opacity-0'} relative`}
                    >
                      <Page
                        pageNumber={pageNum}
                        canvasBackground="#ffffff"
                        renderTextLayer={true}
                        renderAnnotationLayer={!isZoomingRef.current}
                        scale={scale}
                        rotate={rotation}
                        onRenderSuccess={() => onPageRenderSuccess(pageNum)}
                        customTextRenderer={({ str }) => {
                          let result = str;

                          // Handle search highlights
                          if (searchText && searchResults.length > 0) {
                            const searchTextForMatch = matchCase ? searchText : searchText.toLowerCase();
                            const parts = [];
                            let index = 0;
                            const pageText = textLayerRef.current[pageNum] || '';
                            let absoluteIndex = pageText.indexOf(str);

                            while (index < str.length) {
                              const searchIndex = matchCase
                                ? str.indexOf(searchText, index)
                                : str.toLowerCase().indexOf(searchTextForMatch, index);
                              if (searchIndex === -1) {
                                parts.push(str.slice(index));
                                break;
                              }

                              const absoluteStartIndex = absoluteIndex + searchIndex;
                              const match = searchResults.find(
                                (m) =>
                                  m.page === pageNum &&
                                  m.startIndex === absoluteStartIndex
                              );

                              if (match) {
                                const matchText = str.slice(
                                  searchIndex,
                                  searchIndex + searchText.length
                                );
                                const highlightStyle =
                                  highlightAll && match.matchIndex !== currentMatch
                                    ? 'background-color: #ADD8E6; color: black; padding: 2px 4px;'
                                    : match.matchIndex === currentMatch
                                      ? 'background-color: #4169E1; color: white; padding: 2px 4px;'
                                      : '';

                                if (highlightStyle) {
                                  parts.push(str.slice(index, searchIndex));
                                  parts.push(
                                    `<mark class="search-match${match.matchIndex === currentMatch
                                      ? ' active-match'
                                      : ''
                                    }" data-match-index="${match.matchIndex}" style="${highlightStyle}">${matchText}</mark>`
                                  );
                                } else {
                                  parts.push(
                                    str.slice(index, searchIndex + searchText.length)
                                  );
                                }
                              } else {
                                parts.push(
                                  str.slice(index, searchIndex + searchText.length)
                                );
                              }

                              index = searchIndex + searchText.length;
                              absoluteIndex += searchIndex + searchText.length;
                            }

                            if (parts.length > 0) {
                              result = parts.join('');
                            }
                          }
                          // Handle annotations with notes
                          pageAnnotations.forEach((ann) => {
                            const hasNote = typeof ann.note === 'string' && ann.note.trim().length > 0;
                            console.log('...annotation123', ann);
                            console.log('check', hasNote);
                            console.log('...str', str)
                            if (
                              hasNote &&
                              ann.text.includes(str) && // match fragment within annotation
                              str.length > 4 &&         // ignore short words
                              /\w/.test(str) &&         // must contain a letter/number
                              str.trim().length > 0     // not just whitespace
                            ) {
                              const style = `background-color: ${ann.color}; color: black;`;
                              result = `<span class="highlight-with-note" style="${style}">${str}</span>`;
                              console.log('...greenresult', result);
                            }

                          });

                          return result;
                        }}
                      />
                      <canvas
                        ref={(el) => (canvasRefs.current[pageNum] = el)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          pointerEvents: 'auto',
                          zIndex: tool === 'pen' || tool === 'eraser' ? 10 : 1,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div
                    className={`w-[210mm] h-[297mm] bg-gray-100 rounded animate-pulse ${scrollMode === 'horizontal'
                      ? 'mr-6'
                      : scrollMode === 'wrapped'
                        ? 'm-2'
                        : ''
                      }`}
                    style={scrollMode === 'wrapped' ? { flex: '0 0 auto', maxWidth: '45%' } : {}}
                  />
                )}
              </div>
            );
          })}
        </Document>
      </div>
    </div>
  );
}