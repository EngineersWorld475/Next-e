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
  selectedPenColor, // Added prop for pen color
}) {
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [highlightedText, setHighlightedText] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const canvasRefs = useRef({});
  const scrollSpeedFactor = 0.3;

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
      }
    };

    const handleMouseUp = (e) => {
      if (tool === 'hand') {
        setIsPanning(false);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      } else if (tool === 'pen') {
        setIsDrawing(false);
        setLastPoint(null);
      } else if (tool === 'highlight') {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        console.log('Highlight MouseUp - Selected Text:', selectedText);
        if (selectedText) {
          const anchorNode = selection.anchorNode;
          const pageElement = anchorNode?.parentElement?.closest(
            '[data-page-number]'
          );
          const pageNum = pageElement
            ? parseInt(pageElement.getAttribute('data-page-number'))
            : null;
          console.log(
            'Highlight MouseUp - Page Number:',
            pageNum,
            'Color:',
            selectedColor
          );
          if (pageNum) {
            setHighlightedText((prev) => [
              ...prev,
              {
                id: Date.now(),
                text: selectedText,
                page: pageNum,
                color: selectedColor,
              },
            ]);
            console.log('Highlight Added:', {
              id: Date.now(),
              text: selectedText,
              page: pageNum,
              color: selectedColor,
            });
            selection.removeAllRanges();
          } else {
            console.warn('Could not determine page number for highlight.');
            showToast({
              title: 'Highlight Error',
              description: 'Unable to identify page for highlighting.',
              variant: 'error',
            });
          }
        }
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

    const disablePointerEvents = () => {
      const canvases = container.querySelectorAll('.react-pdf__Page__canvas');
      const textLayers = container.querySelectorAll(
        '.react-pdf__Page__textLayer'
      );
      canvases.forEach((canvas) => (canvas.style.pointerEvents = 'none'));
      textLayers.forEach(
        (textLayer) =>
        (textLayer.style.pointerEvents =
          tool === 'highlight' || tool === 'text' ? 'auto' : 'none')
      );
    };

    const restorePointerEvents = () => {
      const canvases = container.querySelectorAll('.react-pdf__Page__canvas');
      const textLayers = container.querySelectorAll(
        '.react-pdf__Page__textLayer'
      );
      canvases.forEach((canvas) => (canvas.style.pointerEvents = 'auto'));
      textLayers.forEach((textLayer) => (textLayer.style.pointerEvents = 'auto'));
    };

    if (tool === 'hand' || tool === 'highlight' || tool === 'text' || tool === 'pen') {
      if (tool === 'hand' || tool === 'pen') {
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
        container.removeEventListener('mousedown', handleMouseDown, {
          capture: true,
        });
        container.removeEventListener('mousemove', handleMouseMove, {
          capture: true,
        });
        container.removeEventListener('mouseup', handleMouseUp, {
          capture: true,
        });
        container.removeEventListener('mouseleave', handleMouseUp, {
          capture: true,
        });
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [tool, isPanning, isDrawing, lastPoint, pdfContainerRef, scrollMode, selectedColor, selectedPenColor, showToast]);

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

      // Initialize canvas for drawing
      const canvas = canvasRefs.current[pageNumber];
      if (canvas) {
        const pageElement = canvas.closest('[data-page-number]');
        const pdfCanvas = pageElement.querySelector('.react-pdf__Page__canvas');
        if (pdfCanvas) {
          canvas.width = pdfCanvas.width;
          canvas.height = pdfCanvas.height;
        }
      }
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
              : 'cursor-default'
        }`}
      style={{
        maxHeight: 'calc(100vh - 60px)',
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
                      className={`w-[210mm] h-[297mm] max-w-[90vw] bg-white border border-gray-300 rounded-md shadow-md flex flex-col justify-center items-center p-6 mx-auto ${isRendered ? 'hidden' : 'block'
                        }`}
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
                      className={`transition-opacity duration-300 ${isRendered ? 'opacity-100' : 'opacity-0'
                        } relative`}
                    >
                      <Page
                        pageNumber={pageNum}
                        canvasBackground="#f2f2f2"
                        renderTextLayer={true}
                        renderAnnotationLayer={!isZoomingRef.current}
                        scale={scale}
                        rotate={rotation}
                        onRenderSuccess={() => onPageRenderSuccess(pageNum)}
                        customTextRenderer={({ str }) => {
                          let result = str;

                          // Apply search highlights
                          if (searchText && searchResults.length > 0) {
                            const searchTextForMatch = matchCase
                              ? searchText
                              : searchText.toLowerCase();
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

                                console.log(
                                  `Applying search highlight on page ${pageNum}:`,
                                  {
                                    text: matchText,
                                    isActive: match.matchIndex === currentMatch,
                                    style: highlightStyle,
                                    matchIndex: match.matchIndex,
                                    absoluteStartIndex,
                                  }
                                );

                                if (highlightStyle) {
                                  parts.push(str.slice(index, searchIndex));
                                  parts.push(
                                    `<mark class="search-match${match.matchIndex === currentMatch
                                      ? ' active-match'
                                      : ''
                                    }" data-match-index="${match.matchIndex
                                    }" style="${highlightStyle}">${matchText}</mark>`
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

                          // Apply manual highlights
                          highlightedText.forEach((highlight) => {
                            if (highlight.page === pageNum) {
                              const escapedText = highlight.text.replace(
                                /[.*+?^${}()|[\]\\]/g,
                                '\\$&'
                              );
                              const regex = new RegExp(`(${escapedText})`, 'g');
                              result = result.replace(
                                regex,
                                `<mark class="manual-highlight" style="background-color: ${highlight.color}; color: black; padding: 2px 4px;">$1</mark>`
                              );
                              console.log(
                                `Applying manual highlight on page ${pageNum}:`,
                                {
                                  text: highlight.text,
                                  color: highlight.color,
                                }
                              );
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
                          pointerEvents: tool === 'pen' ? 'auto' : 'none',
                          opacity: tool === 'pen' ? 1 : 0,
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