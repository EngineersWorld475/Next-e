'use client';
import { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '../ui/button';
import { Bookmark, Check, ChevronFirst, ChevronLast, ChevronsRight, Copy, DownloadIcon, Expand, Eye, FileUp, Minimize2, Printer, Search, Share, X, ZoomIn, ZoomOut, Loader2, SquareArrowUp, SquareArrowDown, RotateCw, RotateCcw, MousePointer, Hand } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupsByUserId } from '@/store/group-slice';
import useUserId from '@/hooks/useUserId';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useCustomToast } from '@/hooks/useCustomToast';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// Reusable LoadingSpinner Component
function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <Loader2 className={`animate-spin text-gray-500 ${sizeClasses[size]}`} />
      <p className="text-sm text-gray-600 font-medium">{message}</p>
    </div>
  );
}

export default function PDFViewer({ pdfUrl: initialPdfUrl }) {
  const [selectedText, setSelectedText] = useState('');
  const [question, setQuestion] = useState('');
  const [showBox, setShowBox] = useState(false);
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
  const [radioItem, setRadioItem] = useState('group');
  const [copied, setCopied] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(initialPdfUrl);
  const [renderedPages, setRenderedPages] = useState({});
  const [tool, setTool] = useState('text');
  const { showToast } = useCustomToast();
  const searchInputRef = useRef(null);
  const textLayerRef = useRef({});
  const pageRefs = useRef([]);
  const fileInputRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const dispatch = useDispatch();
  const { groupList } = useSelector((state) => state.group);
  const userId = useUserId();
  const { user } = useSelector((state) => state.auth);
  const visibleRange = 2;
  const scrollSpeedFactor = 0.3; // handle the scrolling speed

  // Panning state for hand tool
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Annotation Link (dummy)
  const link = "https://ui.shadcn.com/docs/installation";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!pdfUrl) setShowBox(false);
  }, [pdfUrl]);

  // Restore view from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pdfParam = params.get('pdf');
    const pageParam = params.get('page');
    const scrollParam = params.get('scroll');
    const scaleParam = params.get('scale');
    const rotationParam = params.get('rotation');

    if (pdfParam) {
      // Sanitize and validate URL
      try {
        const decodedUrl = decodeURIComponent(pdfParam);
        new URL(decodedUrl); // Throws if invalid
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

    // Wait for pages to render before restoring page and scroll
    if (numPages && pageRefs.current.length === numPages) {
      if (pageParam) {
        const pageNum = parseInt(pageParam, 10);
        if (!isNaN(pageNum) && pageNum > 0 && pageNum <= numPages) {
          setPageNumber(pageNum);
          const pageEl = pageRefs.current[pageNum - 1];
          if (pageEl) {
            pageEl.scrollIntoView({ behavior: 'smooth' });
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
  }, [numPages]);

  // Handle file selection
  const handleFileSelect = (event) => {
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
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (tool === 'text') {
        const selection = window.getSelection().toString();
        if (selection.length > 0) {
          setSelectedText(selection);
          setShowBox(true);
        }
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [tool]);

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

  // Track visible page during scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.getAttribute('data-page-number'));
            setPageNumber(pageNum);
          }
        });
      },
      { threshold: 0.5 }
    );

    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      pageRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [numPages]);

  // Handle panning for hand tool
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
        container.scrollLeft += dx;
        container.scrollTop += dy;
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
  }, [tool, isPanning]);


  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    pageRefs.current = Array(numPages).fill().map((_, i) => pageRefs.current[i] || null);
    setRenderedPages({});
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      const prevPage = pageRefs.current[pageNumber - 2];
      if (prevPage) {
        prevPage.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      const nextPage = pageRefs.current[pageNumber];
      if (nextPage) {
        nextPage.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const goToFirstPage = () => {
    const firstPage = pageRefs.current[0];
    if (firstPage) {
      firstPage.scrollIntoView({ behavior: 'smooth' });
      setPageNumber(1);
    }
  };

  const goToLastPage = () => {
    const lastPage = pageRefs.current[numPages - 1];
    if (lastPage) {
      lastPage.scrollIntoView({ behavior: 'smooth' });
      setPageNumber(numPages);
    }
  };

  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterclockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const selectTextTool = () => {
    setTool('text');
  };

  const selectHandTool = () => {
    setTool('hand');
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0));
  }
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

  const toggleSearchInput = () => {
    setShowSearchInput((prev) => !prev);
    if (!showSearchInput) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
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

  // Handle current view
  const handleCurrentView = () => {
    if (!pdfUrl) {
      showToast({
        title: 'No PDF Loaded',
        description: 'Please load a PDF to share the current view',
        variant: 'error',
      });
      return;
    }

    const scrollY = containerRef.current?.scrollTop || 0;
    const params = new URLSearchParams({
      pdf: encodeURIComponent(pdfUrl),
      page: pageNumber.toString(),
      scroll: scrollY.toFixed(2),
      scale: scale.toFixed(2),
      rotation: rotation.toString(),
    });

    const currentViewUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    navigator.clipboard.writeText(currentViewUrl).then(() => {
      console.log('Current view URL copied to clipboard:', currentViewUrl);
      showToast({
        title: 'Copied',
        description: 'Current view URL copied to clipboard',
        variant: 'success',
      });
    }).catch((err) => {
      console.error('Failed to copy URL:', err);
      showToast({
        title: 'Copy Failed',
        description: 'Failed to copy current view URL',
        variant: 'error',
      });
    });
  };

  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0]?.includes?.('AbortException: TextLayer task cancelled')) return;
      originalWarn(...args);
    };
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    dispatch(getGroupsByUserId({ userId, authToken: user?.token }));
  }, [dispatch, userId, user?.token]);

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
    const lowerSearchText = text.toLowerCase();

    Object.keys(textLayerRef.current).forEach((pageNum) => {
      const pageText = textLayerRef.current[pageNum].toLowerCase();
      let index = 0;
      while (index !== -1) {
        index = pageText.indexOf(lowerSearchText, index);
        if (index !== -1) {
          matches.push({
            page: parseInt(pageNum),
            startIndex: index,
            endIndex: index + text.length,
          });
          index += 1;
        }
      }
    });

    setSearchResults(matches);
    setCurrentMatch(0);
    console.log(`Found ${matches.length} matches for "${text}"`);

    if (matches.length > 0) {
      const firstMatchPage = pageRefs.current[matches[0].page - 1];
      if (firstMatchPage) {
        firstMatchPage.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const goToNextMatch = () => {
    if (searchResults.length === 0) return;
    const nextMatch = Math.min(currentMatch + 1, searchResults.length - 1);
    setCurrentMatch(nextMatch);
    const matchPage = pageRefs.current[searchResults[nextMatch].page - 1];
    if (matchPage) {
      matchPage.scrollIntoView({ behavior: 'smooth' });
    }
    scrollToMatch(searchResults[nextMatch]);
  };

  const goToPreviousMatch = () => {
    if (searchResults.length === 0) return;
    const prevMatch = Math.max(currentMatch - 1, 0);
    setCurrentMatch(prevMatch);
    const matchPage = pageRefs.current[searchResults[prevMatch].page - 1];
    if (matchPage) {
      pageRefs.current[prevMatch].scrollIntoView({ behavior: 'smooth' });
    }
    scrollToMatch(searchResults[prevMatch]);
  };

  const scrollToMatch = (match) => {
    const textLayer = document.querySelector(`.react-pdf__Page__textLayer[data-page-number="${match.page}"]`);
    if (textLayer) {
      const highlight = textLayer.querySelector(`[data-match-index="${match.startIndex}"]`);
      if (highlight) {
        highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.log(`Scrolled to match on page ${match.page}, index ${match.startIndex}`);
      } else {
        console.warn('Highlight not found for match:', match);
      }
    } else {
      console.warn(`Text layer not found for page ${match.page}`);
    }
  };

  useEffect(() => {
    searchInPDF(searchText);
  }, [searchText]);

  const highlightMatches = (pageNumber, retryCount = 0) => {
    const textLayer = document.querySelector(`.react-pdf__Page__textLayer[data-page-number="${pageNumber}"]`);
    if (!textLayer || !searchText) {
      if (!textLayer && retryCount < 5) {
        console.log(`Text layer not ready for page ${pageNumber}, retrying (${retryCount + 1}/5)...`);
        setTimeout(() => highlightMatches(pageNumber, retryCount + 1), 1000);
      } else {
        console.warn(`No text layer or search text for page ${pageNumber}`);
      }
      return;
    }

    textLayer.style.border = '2px solid red';

    const textNodes = textLayer.querySelectorAll('span');
    if (textNodes.length === 0) {
      console.warn(`No text nodes found in text layer for page ${pageNumber}`);
      if (retryCount < 5) {
        setTimeout(() => highlightMatches(pageNumber, retryCount + 1), 1000);
      }
      return;
    }

    console.log(`Found ${textNodes.length} text nodes on page ${pageNumber}`);
    textNodes.forEach((node) => {
      node.innerHTML = node.textContent;
      if (node.textContent.toLowerCase().includes(searchText.toLowerCase())) {
        const text = node.textContent;
        const startIndex = text.toLowerCase().indexOf(searchText.toLowerCase());
        if (startIndex !== -1) {
          const before = text.slice(0, startIndex);
          const matchText = text.slice(startIndex, startIndex + searchText.length);
          const after = text.slice(startIndex + searchText.length);
          node.innerHTML = `${before}<span class="highlight" data-match-index="${startIndex}" style="background-color: green !important; color: black !important;">${matchText}</span>${after}`;
          console.log(`Highlighted "${matchText}" on page ${pageNumber}`);
        }
      }
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    showToast({
      title: 'Copied',
      description: 'Annotation link copied to clipboard',
      variant: 'success',
    });
  };

  if (!isClient || !pdfUrl) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner message="Loading PDF viewer..." size="lg" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-auto" ref={containerRef}>
      {hasTextLayer === false && (
        <div className="fixed top-10 left-4 bg-yellow-200 text-black p-2 rounded shadow z-50">
          Warning: This PDF may lack a text layer. Search and highlighting may not work. Use a text-based PDF.
        </div>
      )}
      <div className="sticky top-0 bg-gray-dark text-white px-4 py-3 flex justify-between items-center gap-4 z-10">
        <div className="flex flex-row gap-5 items-center">
          <div className="relative" ref={searchInputRef}>
            <button
              title="Find in Document"
              onClick={toggleSearchInput}
              className="p-1 hover:bg-gray-700 rounded"
            >
              <Search size={16} className="cursor-pointer" />
            </button>
            {showSearchInput && (
              <div className="absolute top-10 left-0 w-64 md:w-[420px] lg:w-[420px] bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-200 ease-in-out">
                <div className="flex items-center p-2 gap-2 w-full">
                  <Search size={16} className="text-gray-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search document..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="px-2 py-1 text-sm text-gray-800 border-none focus:outline-none placeholder-gray-400 truncate"
                  />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="p-1 hover:bg-gray-300 rounded" onClick={goToPreviousMatch} disabled={searchResults.length === 0}>
                      <ChevronFirst size={16} className="cursor-pointer text-black" />
                    </button>
                    <button className="p-1 hover:bg-gray-300 rounded" onClick={goToNextMatch} disabled={searchResults.length === 0}>
                      <ChevronLast size={16} className="cursor-pointer text-black" />
                    </button>
                    <span className="text-black text-xs px-2 py-1 rounded border border-black whitespace-nowrap">
                      {searchResults.length ? `${currentMatch + 1} of ${searchResults.length} matches` : 'No matches'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-row gap-3 items-center">
            <button
              title="Previous Page"
              className="p-1 hover:bg-gray-700 rounded"
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
            >
              <ChevronFirst size={18} className="cursor-pointer" />
            </button>
            <span className="text-xs">
              {pageNumber} / {numPages || '?'}
            </span>
            <button
              title="Next Page"
              className="p-1 hover:bg-gray-700 rounded"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              <ChevronLast size={18} className="cursor-pointer" />
            </button>
          </div>
        </div>
        <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex flex-row gap-5 items-center">
          <button title="Zoom In" className="p-1 hover:bg-gray-700 rounded" onClick={zoomIn}>
            <ZoomIn size={18} className="cursor-pointer" />
          </button>
          <button title="Zoom Out" className="p-1 hover:bg-gray-700 rounded" onClick={zoomOut}>
            <ZoomOut size={18} className="cursor-pointer" />
          </button>
          <span className="text-xs">Zoom: {(scale * 100).toFixed(0)}%</span>
        </div>
        <div className="flex flex-row gap-5 md:gap-7 lg:gap-7 items-center">
          <button title="My Annotations" className="p-1 hover:bg-gray-700 rounded">
            <Eye size={18} className="cursor-pointer text-[#ff6347]" />
          </button>
          <div>
            <button
              title="Open File"
              className="p-1 hover:bg-gray-700 rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp size={18} className="cursor-pointer" />
            </button>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          <button title="Print" className="p-1 hover:bg-gray-700 rounded" onClick={() => window.print()}>
            <Printer size={18} className="cursor-pointer" />
          </button>
          <button title="Download" onClick={handleDownload} className="p-1 hover:bg-gray-700 rounded">
            <DownloadIcon size={18} className="cursor-pointer" />
          </button>
          <button
            title="Copy current view"
            onClick={handleCurrentView}
            className="p-1 hover:bg-gray-700 rounded"
            disabled={!pdfUrl}
          >
            <Bookmark size={18} className="cursor-pointer" />
          </button>
          <Dialog>
            <DialogTrigger>
              <Share size={24} className="cursor-pointer text-[#ff6347] p-1 hover:bg-gray-700 rounded" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Share Annotation</DialogTitle>
                <DialogDescription>Share your annotation to group or individual.</DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">Link</Label>
                  <Input id="link" value={link} readOnly />
                </div>
                <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <RadioGroup
                defaultValue="group"
                value={radioItem}
                className="flex gap-3 mx-2"
                onValueChange={(value) => setRadioItem(value)}
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="group" id="r1" />
                  <Label htmlFor="r1">Group</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="individual" id="r2" />
                  <Label htmlFor="r2">Individual</Label>
                </div>
              </RadioGroup>
              {radioItem === 'group' ? (
                <div>
                  <Label>Group</Label>
                  <Select>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {groupList &&
                          groupList.length > 0 &&
                          groupList.map((group) => (
                            <SelectItem key={group.GroupId} value={group.GroupName} className="cursor-pointer">
                              {group.GroupName}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label>Email</Label>
                  <Input placeholder="Enter E-mail address" />
                </div>
              )}
              <DialogFooter className="sm:justify-start">
                <Button type="button">Send</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <button title="Switch to Presentation Mode" onClick={toggleFullScreen} className="p-1 hover:bg-gray-700 rounded">
            {isFullScreen ? <Minimize2 size={18} className="cursor-pointer" /> : <Expand size={18} className="cursor-pointer" />}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ChevronsRight size={22} className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer" onClick={goToFirstPage}>
                  <SquareArrowUp size={22} className="text-gray-500" />
                  <span className="text-gray-600 text-sm">Go to First Page</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={goToLastPage}>
                  <SquareArrowDown size={22} className="text-gray-500" />
                  <span className="text-gray-600 text-sm">Go to Last Page</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={rotateClockwise}>
                  <RotateCw size={22} className="text-gray-500" />
                  <span className="text-gray-600 text-sm">Rotate Clockwise</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={rotateCounterclockwise}>
                  <RotateCcw size={22} className="text-gray-500" />
                  <span className="text-gray-600 text-sm">Rotate Counterclockwise</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={selectTextTool}>
                  <MousePointer size={22} className="text-gray-500" />
                  <span className="text-gray-600 text-sm">Text Selection Tool</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={selectHandTool}>
                  <Hand size={22} className="text-gray-500" />
                  <span className="text-gray-600 text-sm">Hand Tool</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        ref={pdfContainerRef}
        className={`flex flex-col items-center py-3 overflow-auto ${tool === 'hand' ? (isPanning ? 'cursor-grabbing hand-tool-active' : 'cursor-grab hand-tool-active') : 'cursor-default'
          }`}
        style={{ maxHeight: 'calc(100vh - 60px)' }}
      >
        <Document
          file={decodeURIComponent(pdfUrl)}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center"
          loading={
            <div className="flex items-center justify-center h-screen">
              <LoadingSpinner message="Loading PDF document..." size="lg" />
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
                className="mb-6 relative"
              >
                {isInView ? (
                  <>
                    <Card
                      className={`w-[210mm] h-[297mm] max-w-[90vw] bg-white border border-gray-300 rounded-lg shadow-md flex flex-col justify-center items-center p-6 mx-auto ${isRendered ? 'hidden' : 'block'}`}
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
                          <LoadingSpinner message={`Loading page ${pageNum}...`} size="md" />
                        </div>
                      </CardContent>
                    </Card>
                    <div className={`transition-opacity duration-300 ${isRendered ? 'opacity-100' : 'opacity-0'}`}>
                      <Page
                        pageNumber={pageNum}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        scale={scale}
                        rotate={rotation}
                        onRenderSuccess={() => {
                          onPageRenderSuccess(pageNum);
                          highlightMatches(pageNum);
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div style={{ height: '297mm' }} />
                )}
              </div>
            );
          })}
        </Document>
      </div>
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
      <style jsx>{`
  .react-pdf__Page__textLayer {
    border: 2px solid red !important;
  }
  .highlight {
    background-color: green !important;
    color: black !important;
  }
  .hand-tool-active .react-pdf__Page__canvas,
  .hand-tool-active .react-pdf__Page__textLayer {
    cursor: inherit !important;
    user-select: none !important;
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`}</style>
    </div>
  );
}
