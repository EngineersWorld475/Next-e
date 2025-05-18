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

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PdfViewer = ({ pdfUrl: initialPdfUrl }) => {
  const [isClient, setIsClient] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [hasTextLayer, setHasTextLayer] = useState(true);
  const [tool, setTool] = useState('text');
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [renderedPages, setRenderedPages] = useState({});
  const [thumbnailRendered, setThumbnailRendered] = useState({});
  const [pdfUrl, setPdfUrl] = useState(initialPdfUrl);
  const [selectedText, setSelectedText] = useState('');
  const [question, setQuestion] = useState('');
  const [showBox, setShowBox] = useState(false);
  const [scrollMode, setScrollMode] = useState('vertical');
  const { showToast } = useCustomToast();
  const searchInputRef = useRef(null);
  const textLayerRef = useRef({});
  const pageRefs = useRef([]);
  const fileInputRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const containerRef = useRef(null);
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
    dispatch(getGroupsByUserId({ userId, authToken: user?.token }));
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

  const handleMouseUp = useCallback(() => {
    if (tool === 'text') {
      const selection = window.getSelection().toString();
      if (selection.length > 0) {
        setSelectedText(selection);
        setShowBox(true);
      }
    }
  }, [tool]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSearchInput(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowSearchInput(false);
        setSearchText('');
      }
      if (event.key === 'Enter' && showSearchInput) {
        goToNextMatch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearchInput]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(observerCallback, { threshold: 0.6 });

    pageRefs.current.forEach((ref) => {
      if (ref) observerRef.current.observe(ref);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [numPages, observerCallback]);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    pageRefs.current = Array(numPages).fill().map((_, i) => pageRefs.current[i] || null);
    setRenderedPages({});
    setThumbnailRendered({});
  }, []);

  const handleFileSelect = useCallback((event) => {
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
  }, [pdfUrl, showToast]);

  const toggleThumbnails = useCallback(() => {
    setShowThumbnails((prev) => !prev);
  }, []);

  const goToPage = useCallback((pageNum) => {
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
          const centeredScroll = scrollOffset - (container.clientHeight / 2) + (pageHeight / 2);
          container.scrollTo({
            top: centeredScroll,
            behavior: 'smooth',
          });
        } else if (scrollMode === 'horizontal') {
          const scrollOffset = pageEl.offsetLeft - container.offsetLeft;
          const centeredScroll = scrollOffset - (container.clientWidth / 2) + (pageWidth / 2);
          container.scrollTo({
            left: centeredScroll,
            behavior: 'smooth',
          });
        } else if (scrollMode === 'wrapped') {
          // For wrapped mode, scroll to ensure the page is visible
          pageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
        pageEl.classList.add('page-transition');
        setTimeout(() => pageEl.classList.remove('page-transition'), 300);
      };
      setTimeout(() => tryScroll(), 50);
    }
  }, [numPages, scrollMode]);

  const goToNextMatch = useCallback(() => {
    if (searchResults.length === 0) return;
    const nextMatch = Math.min(currentMatch + 1, searchResults.length - 1);
    setCurrentMatch(nextMatch);
    const matchPageNum = searchResults[nextMatch].page;
    goToPage(matchPageNum);
    setTimeout(() => scrollToMatch(searchResults[nextMatch]), 300);
  }, [searchResults, currentMatch, goToPage]);

  const visiblePages = useMemo(() => {
    if (!numPages) return [];
    const buffer = 2;
    const start = Math.max(1, pageNumber - buffer);
    const end = Math.min(numPages, pageNumber + buffer);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [numPages, pageNumber]);

  const scrollToMatch = useCallback((match, retryCount = 0) => {
    const maxRetries = 5;
    const retryDelay = 200;
    // Find the parent div with data-page-number
    const pageContainer = document.querySelector(`div[data-page-number="${match.page}"]`);
    if (!pageContainer) {
      if (retryCount < maxRetries) {
        console.warn(`Page container not found for page ${match.page}, retrying (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => scrollToMatch(match, retryCount + 1), retryDelay);
      } else {
        console.warn(`Page container not found for page ${match.page} after ${maxRetries} retries`);
        showToast({
          title: 'Search Error',
          description: `Could not find page container for page ${match.page}.`,
          variant: 'error',
        });
      }
      return;
    }
    // Find the textLayer within the page container
    const textLayer = pageContainer.querySelector('.react-pdf__Page__textContent.textLayer');
    console.log('...textLayer', textLayer, 'Visible pages:', visiblePages);
    if (textLayer) {
      const highlight = textLayer.querySelector(`[data-match-index="${match.matchIndex}"]`);
      console.log('....highlight', highlight);
      if (highlight) {
        highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.log(`Scrolled to match on page ${match.page}, index ${match.matchIndex}`);
      } else {
        console.warn('Highlight not found for match:', match);
        if (retryCount < maxRetries) {
          console.warn(`Retrying (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => scrollToMatch(match, retryCount + 1), retryDelay);
        } else {
          showToast({
            title: 'Search Error',
            description: `Could not find highlighted match on page ${match.page}.`,
            variant: 'error',
          });
        }
      }
    } else if (retryCount < maxRetries) {
      console.warn(`Text layer not found for page ${match.page}, retrying (${retryCount + 1}/${maxRetries})`);
      setTimeout(() => scrollToMatch(match, retryCount + 1), retryDelay);
    } else {
      console.warn(`Text layer not found for page ${match.page} after ${maxRetries} retries`);
      showToast({
        title: 'Search Error',
        description: `Could not find text layer for page ${match.page}.`,
        variant: 'error',
      });
    }
  }, [showToast, visiblePages]);

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
        <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
          <div className="w-12 h-12 animate-spin text-gray-500" />
          <p className="text-sm text-gray-600 font-medium">Loading PDF viewer...</p>
        </div>
      </div>
    );
  }

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
      />
      <div className="flex-1 h-screen overflow-auto" style={{ marginLeft: showThumbnails ? '12rem' : '0', transition: 'margin-left 0.3s ease-in-out' }} ref={containerRef}>
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
        />
        {showBox && (
          <div className="fixed bottom-6 left-6 p-4 bg-white border shadow-md rounded w-96 z-50 animate-fadeIn">
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
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Submit Question
            </button>
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
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .page-transition {
          transition: transform 0.2s ease-out;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

export default PdfViewer;