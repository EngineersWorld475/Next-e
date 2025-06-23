'use client';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { pdfjs } from 'react-pdf';
import PdfToolbar from './PdfToolbar';
import PdfDocument from './PdfDocument';
import PdfSidebar from './PdfSidebar';
import { useCustomToast } from '@/hooks/useCustomToast';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupsByUserId } from '@/store/group-slice';
import useUserId from '@/hooks/useUserId';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { v4 as uuid } from 'uuid';
import { throttle } from 'lodash';
import { Copy, Highlighter, StickyNote } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PdfViewer = ({ pdfUrl: initialPdfUrl }) => {
  const [isClient, setIsClient] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.5);
  const [rotation, setRotation] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [hasTextLayer, setHasTextLayer] = useState(true);
  const [tool, setTool] = useState('text');
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [renderedPages, setRenderedPages] = useState({});
  const [matchCase, setMatchCase] = useState(false);
  const [thumbnailRendered, setThumbnailRendered] = useState({});
  const [pdfUrl, setPdfUrl] = useState(initialPdfUrl);
  const [selectedText, setSelectedText] = useState('');
  const [question, setQuestion] = useState('');
  const [showBox, setShowBox] = useState(false);
  const [scrollMode, setScrollMode] = useState('vertical');
  const [highlightAll, setHighlightAll] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#87CEEB');
  const [selectedPenColor, setSelectedPenColor] = useState('#87CEEB');
  const [annotations, setAnnotations] = useState([]); // Store annotations (highlights with notes)
  const [showNoteForm, setShowNoteForm] = useState(false); // State for showing note form
  const [currentHighlight, setCurrentHighlight] = useState(null); // Current highlighted text for note

  const { showToast } = useCustomToast();
  const searchInputRef = useRef(null);
  const textLayerRef = useRef({});
  const pageRefs = useRef([]);
  const fileInputRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const containerRef = useRef(null);
  const contextMenuRef = useRef(null); // Ref for context menu
  const dispatch = useDispatch();
  const { groupList } = useSelector((state) => state.group);
  const userId = useUserId();
  const { user } = useSelector((state) => state.auth);
  const observerRef = useRef(null);
  const isZoomingRef = useRef(false);

  const zoomLevels = useMemo(() => [1.0, 1.5, 2.0, 2.5, 3.0], []);

  const observerCallback = useMemo(
    () =>
      throttle((entries) => {
        if (isZoomingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.getAttribute('data-page-number'));
            setPageNumber(pageNum);
          }
        });
      }, 100),
    []
  );

  const clearAllAnnotations = useCallback(() => {
    setAnnotations([]); // Clear all annotations
    console.log('Clear all annotations function called');
  }, []);

  const handleAddNote = useCallback(() => {
    setShowNoteForm(true);
    setShowBox(false); // Hide the question box if shown
    const menu = contextMenuRef.current;
    if (menu) menu.style.display = 'none'; // Hide context menu
  }, []);

  const handleNoteSubmit = useCallback((note) => {
    if (currentHighlight) {
      setAnnotations((prev) => [
        ...prev,
        {
          id: uuid(),
          text: currentHighlight.text,
          page: currentHighlight.page,
          note: note,
          color: '#00FF00', // Set to green for notes
          position: currentHighlight.position,
        },
      ]);
      setShowNoteForm(false);
      setCurrentHighlight(null);
    }
  }, [currentHighlight]);

  useEffect(() => {
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args) => {
      if (args[0]?.includes?.('AbortException: TextLayer task cancelled')) return;
      originalWarn(...args);
    };

    console.error = (...args) => {
      if (args[0]?.includes?.('AbortException: TextLayer task cancelled')) return;
      originalError(...args);
    };

    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!pdfUrl) setShowBox(false);
  }, [pdfUrl]);

  useEffect(() => {
    if (userId && user?.token) {
      dispatch(getGroupsByUserId({ userId, authToken: user?.token }));
    }
  }, [dispatch, userId, user?.token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pdfParam = params.get('pdf');
    const pageParam = params.get('page');
    const scrollParam = params.get('scroll');
    const scaleParam = params.get('scale');
    const rotationParam = params.get('rotation');

    if (pdfParam) {
      try {
        const decodedUrl = decodeURIComponent(pdfParam);
        new URL(decodedUrl);
        setPdfUrl(decodedUrl);
      } catch (error) {
        console.error('Invalid PDF URL:', error);
        showToast({
          title: 'Error',
          description: 'Invalid PDF URL in query parameters',
          variant: 'error',
        });
      }
    }

    if (numPages && pageRefs.current.length === numPages) {
      if (pageParam) {
        const pageNum = parseInt(pageParam, 10);
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= numPages) {
          setPageNumber(pageNum);
          const pageEl = pageRefs.current[pageNum - 1];
          if (pageEl) {
            pageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
      if (scrollParam) {
        const scrollY = parseFloat(scrollParam);
        if (!isNaN(scrollY) && containerRef.current) {
          containerRef.current.scrollTop = scrollY;
        }
      }
    }

    if (scaleParam) {
      const newScale = parseFloat(scaleParam);
      if (!isNaN(newScale) && newScale >= 0.5 && newScale <= 3.0) {
        setScale(newScale);
      }
    }

    if (rotationParam) {
      const newRotation = parseInt(rotationParam, 10);
      if (!isNaN(newRotation) && [0, 90, 180, 270].includes(newRotation)) {
        setRotation(newRotation);
      }
    }
  }, [numPages, showToast]);

  const handleTextSelectionMouseUp = useCallback(() => {
    if (tool === 'text') {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (selectedText.length > 0 && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); 
        const rect = range.getBoundingClientRect();

        setSelectedText(selectedText);
        setCurrentHighlight({
          text: selectedText,
          page: pageNumber,
          position: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
        });

        const menu = contextMenuRef.current;
        if (menu) {
          menu.style.display = 'block';
          menu.style.position = 'absolute';
          menu.style.top = `${rect.top + window.scrollY - 40}px`;
          menu.style.left = `${rect.left + window.scrollX}px`;
        }

        setShowBox(false);
      } else {
        setShowBox(false);
      }
    }
  }, [tool, pageNumber]);


  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelectionMouseUp);
    return () => document.removeEventListener('mouseup', handleTextSelectionMouseUp);
  }, [handleTextSelectionMouseUp]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchInput(false);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        contextMenuRef.current.style.display = 'none';
      }
      if (showNoteForm && !event.target.closest('.note-form')) {
        setShowNoteForm(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchInput, showNoteForm]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowSearchInput(false);
        setSearchText('');
        setShowNoteForm(false);
        contextMenuRef.current.style.display = 'none';
      }
      if (event.key === 'Enter' && showSearchInput) {
        goToNextMatch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearchInput]);

  useEffect(() => {
  // Initialize IntersectionObserver
  observerRef.current = new IntersectionObserver(
    (entries) => {
      if (isZoomingRef.current) return;

      // Find the entry with the highest intersection ratio
      let maxRatio = 0;
      let visiblePageNum = pageNumber;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          visiblePageNum = parseInt(entry.target.getAttribute('data-page-number'));
        }
      });

      if (visiblePageNum !== pageNumber) {
        console.log(`Updating pageNumber to ${visiblePageNum}`);
        setPageNumber(visiblePageNum);
      }
    },
    {
      threshold: [0.3, 0.5, 0.7], // Multiple thresholds for smoother detection
      root: pdfContainerRef.current, // Observe within the PDF container
    }
  );

  // Observe all pageRefs
  pageRefs.current.forEach((ref) => {
    if (ref) observerRef.current.observe(ref);
  });

  // Cleanup
  return () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  };
}, [numPages, pageNumber]); // Re-run when numPages or pageNumber changes

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    pageRefs.current = Array(numPages)
      .fill()
      .map((_, i) => pageRefs.current[i] || null);
    setRenderedPages({});
    setThumbnailRendered({});
  }, []);

  const handleFileSelect = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        const fileUrl = URL.createObjectURL(file);
        setPdfUrl(fileUrl);
        if (pdfUrl && pdfUrl.startsWith('blob:')) {
          URL.revokeObjectURL(pdfUrl);
        }
      } else {
        showToast({
          title: 'Invalid File',
          description: 'Please select a valid PDF file',
          variant: 'error',
        });
      }
    },
    [pdfUrl, showToast]
  );

  const toggleThumbnails = useCallback(() => {
    setShowThumbnails((prev) => !prev);
  }, []);

  const goToPage = useCallback(
    (pageNum) => {
      if (pageNum >= 1 && pageNum <= numPages) {
        setPageNumber(pageNum);
        const tryScroll = (attempt = 0) => {
          const container = pdfContainerRef.current;
          const pageEl = pageRefs.current[pageNum - 1];
          if (!container || !pageEl || attempt > 10) return;
          const pageHeight = pageEl.offsetHeight;
          const pageWidth = pageEl.offsetWidth;
          if (pageHeight === 0 || pageWidth === 0) {
            setTimeout(() => tryScroll(attempt + 1), 100);
            return;
          }
          if (scrollMode === 'vertical') {
            const scrollOffset = pageEl.offsetTop - container.offsetTop;
            const centeredScroll =
              scrollOffset - container.clientHeight / 2 + pageHeight / 2;
            container.scrollTo({
              top: centeredScroll,
              behavior: 'smooth',
            });
          } else if (scrollMode === 'horizontal') {
            const scrollOffset = pageEl.offsetLeft - container.offsetLeft;
            const centeredScroll =
              scrollOffset - container.clientWidth / 2 + pageWidth / 2;
            container.scrollTo({
              left: centeredScroll,
              behavior: 'smooth',
            });
          } else if (scrollMode === 'wrapped') {
            pageEl.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'nearest',
            });
          }
          pageEl.classList.add('page-transition');
          setTimeout(() => pageEl.classList.remove('page-transition'), 300);
        };
        setTimeout(() => tryScroll(), 50);
      }
    },
    [numPages, scrollMode]
  );

  const scrollToMatch = useCallback(
    (match, retryCount = 0) => {
      const maxRetries = 10;
      const retryDelay = 300;
      const pageContainer = document.querySelector(
        `div[data-page-number="${match.page}"]`
      );
      if (!pageContainer) {
        if (retryCount < maxRetries) {
          console.warn(
            `Page container not found for page ${match.page}, retrying (${retryCount + 1}/${maxRetries})`
          );
          setTimeout(() => scrollToMatch(match, retryCount + 1), retryDelay);
        } else {
          console.warn(
            `Page container not found for page ${match.page} after ${maxRetries} retries`
          );
          showToast({
            title: 'Search Error',
            description: `Could not find page container for page ${match.page}.`,
            variant: 'error',
          });
        }
        return;
      }
      const textLayer = pageContainer.querySelector(
        '.react-pdf__Page__textContent.textLayer'
      );
      if (textLayer) {
        const highlight = textLayer.querySelector(
          `[data-match-index="${match.matchIndex}"]`
        );
        if (highlight) {
          highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
          console.log(
            `Scrolled to match on page ${match.page}, index ${match.matchIndex}`
          );
        } else if (retryCount < maxRetries) {
          console.warn(
            `Highlight not found for match on page ${match.page}, retrying (${retryCount + 1}/${maxRetries})`
          );
          setTimeout(() => scrollToMatch(match, retryCount + 1), retryDelay);
        } else {
          console.warn(
            `Highlight not found for match on page ${match.page} after ${maxRetries} retries`
          );
        }
      } else if (retryCount < maxRetries) {
        console.warn(
          `Text layer not found for page ${match.page}, retrying (${retryCount + 1}/${maxRetries})`
        );
        setTimeout(() => scrollToMatch(match, retryCount + 1), retryDelay);
      } else {
        console.warn(
          `Text layer not found for page ${match.page} after ${maxRetries} retries`
        );
        showToast({
          title: 'Search Error',
          description: `Could not find text layer for page ${match.page}.`,
          variant: 'error',
        });
      }
    },
    [showToast]
  );

  const goToNextMatch = useCallback(() => {
    if (searchResults.length === 0) return;
    const nextMatch = Math.min(currentMatch + 1, searchResults.length - 1);
    setCurrentMatch(nextMatch);
    const matchPageNum = searchResults[nextMatch].page;
    goToPage(matchPageNum);
    setTimeout(() => scrollToMatch(searchResults[nextMatch]), 500);
  }, [searchResults, currentMatch, goToPage, scrollToMatch]);

  const visiblePages = useMemo(() => {
    if (!numPages) return [];
    const buffer = 2;
    const start = Math.max(1, pageNumber - buffer);
    const end = Math.min(numPages, pageNumber + buffer);
    const nearbyPages = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
    const matchPages = searchResults.map((match) => match.page);
    return [...new Set([...nearbyPages, ...matchPages])].sort((a, b) => a - b);
  }, [numPages, pageNumber, searchResults]);

  const handleSubmit = useCallback(() => {
    const data = {
      id: uuid(),
      selectedText,
      question,
    };
    console.log('Submitted Question:', data);
    setShowBox(false);
    setQuestion('');
    setSelectedText('');
  }, [selectedText, question]);

  if (!isClient || !pdfUrl) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center gap-2" role="status" aria-live="polite">
          <div className="w-12 h-12 animate-spin text-gray-400" />
          <p className="text-sm font-medium text-gray-600">Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(selectedText);
    contextMenuRef.current.style.display = 'none';
  };

  const handleHighlight = () => {
    // Optional: Add highlight logic to `annotations`
    contextMenuRef.current.style.display = 'none';
  };
  console.log('...currentHighlight', currentHighlight);
  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      <PdfSidebar
        showThumbnails={showThumbnails}
        pdfUrl={pdfUrl}
        numPages={numPages}
        pageNumber={pageNumber}
        thumbnailRendered={thumbnailRendered}
        setThumbnailRendered={setThumbnailRendered}
        goToPage={goToPage}
        searchText={searchText}
        matchCase={matchCase}
      />
      <div
        className="flex-1 h-screen"
        style={{
          marginLeft: showThumbnails ? '12rem' : '0',
          transition: 'margin-left 0.3s ease-in-out',
        }}
        ref={containerRef}
      >
        {hasTextLayer === false && (
          <div className="fixed top-10 left-4 bg-yellow-200 text-black p-2 rounded shadow z-50 animate-fadeIn">
            Warning: This PDF may lack a text layer. Search and highlighting may not work. Use a text-based PDF.
          </div>
        )}
        <PdfToolbar
          pageNumber={pageNumber}
          numPages={numPages}
          scale={scale}
          setScale={setScale}
          rotation={rotation}
          setRotation={setRotation}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          showSearchInput={showSearchInput}
          setShowSearchInput={setShowSearchInput}
          searchText={searchText}
          setSearchText={setSearchText}
          searchResults={searchResults}
          currentMatch={currentMatch}
          setCurrentMatch={setCurrentMatch}
          tool={tool}
          setTool={setTool}
          showThumbnails={showThumbnails}
          toggleThumbnails={toggleThumbnails}
          pdfUrl={pdfUrl}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          searchInputRef={searchInputRef}
          goToNextMatch={goToNextMatch}
          goToPage={goToPage}
          groupList={groupList}
          user={user}
          containerRef={containerRef}
          showToast={showToast}
          scrollMode={scrollMode}
          setScrollMode={setScrollMode}
          highlightAll={highlightAll}
          setHighlightAll={setHighlightAll}
          matchCase={matchCase}
          setMatchCase={setMatchCase}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedPenColor={selectedPenColor}
          setSelectedPenColor={setSelectedPenColor}
          clearAllAnnotations={clearAllAnnotations}
        />
        <PdfDocument
          pdfUrl={pdfUrl}
          numPages={numPages}
          pageNumber={pageNumber}
          scale={scale}
          rotation={rotation}
          tool={tool}
          searchText={searchText}
          renderedPages={renderedPages}
          setRenderedPages={setRenderedPages}
          pageRefs={pageRefs}
          pdfContainerRef={pdfContainerRef}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          setHasTextLayer={setHasTextLayer}
          textLayerRef={textLayerRef}
          setSearchResults={setSearchResults}
          setCurrentMatch={setCurrentMatch}
          showToast={showToast}
          isZoomingRef={isZoomingRef}
          visiblePages={visiblePages}
          scrollMode={scrollMode}
          searchResults={searchResults}
          currentMatch={currentMatch}
          scrollToMatch={scrollToMatch}
          highlightAll={highlightAll}
          matchCase={matchCase}
          selectedColor={selectedColor}
          selectedPenColor={selectedPenColor}
          clearAllAnnotations={clearAllAnnotations}
          annotations={annotations}
        />
        <div
          ref={contextMenuRef}
          className="fixed bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-xl rounded-xl z-50 hidden p-1 flex items-center gap-1 transform -translate-x-1/2 -translate-y-1/4 min-w-fit"
        >
          <button
            className="group p-3 hover:bg-blue-50 active:bg-green-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300/50 focus:bg-green-50"
            onClick={handleAddNote}
            title="Add Note"
          >
            <StickyNote
              size={18}
              strokeWidth={1.5}
              className="text-gray-600 group-hover:text-green-600 transition-colors duration-200"
            />
            <span className="sr-only">Add Note</span>
          </button>

          <div className="h-px w-full bg-gray-200"></div>

          <button
            className="group p-3 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300/50 focus:bg-green-50"
            onClick={handleHighlight}
            title="Highlight"
          >
            <Highlighter
              size={18}
              strokeWidth={1.5}
              className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200"
            />
            <span className="sr-only">Highlight</span>
          </button>

          <div className="h-px w-full bg-gray-200"></div>

          <button
            className="group p-3 hover:bg-purple-50 active:bg-purple-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:bg-purple-50"
            onClick={handleCopyText}
            title="Copy"
          >
            <Copy
              size={18}
              strokeWidth={1.5}
              className="text-gray-600 group-hover:text-purple-600 transition-colors duration-200"
            />
            <span className="sr-only">Copy</span>
          </button>
        </div>
        {/* Note Input Form */}
        {showNoteForm && currentHighlight && (
          <div className="fixed bottom-6 right-6 bg-white border border-gray-200 shadow-lg rounded-lg w-80 z-50 overflow-hidden note-form">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-green-500">
              <h3 className="text-base font-medium text-white">Add Note</h3>
            </div>
            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Highlighted text with scrollbar */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 max-h-24 overflow-y-auto">
                <p className="text-xs text-gray-600 mb-1">Selected text:</p>
                <p className="text-sm text-gray-800 italic">
                  {currentHighlight.text}
                </p>
              </div>
              {/* Note textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your note
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Write your thoughts here..."
                />
              </div>
            </div>
            {/* Footer with buttons */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-row justify-end space-x-2">
              <button
                onClick={() => setShowNoteForm(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleNoteSubmit(question)}
                className="px-3 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .react-pdf__Page__textLayer {
          border: none !important;
        }
        .hand-tool-active .react-pdf__Page__canvas,
        .hand-tool-active .react-pdf__Page__textLayer {
          cursor: grab !important;
          user-select: none !important;
        }
        .zoom-transition .react-pdf__Page {
          transition: transform 0.2s ease-out;
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .page-transition {
          transition: transform 0.2s ease-out;
          transform: scale(1.02);
        }
        /* Style for highlights with notes */
        .highlight-with-note {
          position: relative;
          background-color: #aaffaa;
          border: none; /* Visual indicator for notes (e.g., purple border) */
        }
        .highlight-with-note::after {
          content: '📝';
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ff00ff;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        .context-menu {
          background: white;
          border-radius: 8px;
          padding: 4px 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          display: flex;
          gap: 8px;
        }
        .context-menu button {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default PdfViewer;