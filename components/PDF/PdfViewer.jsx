'use client';
import { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '../ui/button';
import { Bookmark, Check, ChevronFirst, ChevronLast, ChevronsRight, Copy, DownloadIcon, Expand, Eye, FileUp, Minimize2, Printer, Search, Share, X, ZoomIn, ZoomOut } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'pdfjs-dist/web/pdf_viewer.css';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupsByUserId } from '@/store/group-slice';
import useUserId from '@/hooks/useUserId';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [hasTextLayer, setHasTextLayer] = useState(true);
  const [radioItem, setRadioItem] = useState('group')
  const [copied, setCopied] = useState(false)
  const searchInputRef = useRef(null);
  const textLayerRef = useRef({});
  const pageRefs = useRef([]);
  const dispatch = useDispatch();
  const { groupList } = useSelector((state) => state.group);
  const userId = useUserId();
  const { user } = useSelector((state) => state.auth);


  // Annotation Link(dummy)
  const link = "https://ui.shadcn.com/docs/installation"


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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    pageRefs.current = Array(numPages).fill().map((_, i) => pageRefs.current[i] || null);
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

  // Rendering groups when page loads
  useEffect(() => {
    dispatch(getGroupsByUserId({ userId, authToken: user?.token }))
  }, [dispatch])

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
      matchPage.scrollIntoView({ behavior: 'smooth' });
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

  // copy annotation link
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!isClient || !pdfUrl) {
    return <p className="text-center mt-10">Loading pdf...</p>;
  }

  console.log('.....radioItem', radioItem)


  return (
    <div className="relative w-full h-screen overflow-auto">
      {hasTextLayer === false && (
        <div className="fixed top-4 left-4 bg-yellow-200 text-black p-2 rounded shadow z-50">
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
          <button title="Open File" className="p-1 hover:bg-gray-700 rounded">
            <FileUp size={18} className="cursor-pointer" />
          </button>
          <button title="Print" className="p-1 hover:bg-gray-700 rounded">
            <Printer size={18} className="cursor-pointer" />
          </button>
          <button title="Download" onClick={handleDownload} className="p-1 hover:bg-gray-700 rounded">
            <DownloadIcon size={18} className="cursor-pointer" />
          </button>
          <button title="Current view(copy or open in new window)" className="p-1 hover:bg-gray-700 rounded">
            <Bookmark size={18} className="cursor-pointer" />
          </button>
          {/* share annotation */}
          <Dialog>
            <DialogTrigger>
              <Share size={24} className="cursor-pointer text-[#ff6347] p-1 hover:bg-gray-700 rounded" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => {
              e.preventDefault(); // Prevent default autofocus
            }}>
              <DialogHeader>
                <DialogTitle>Share Annotation</DialogTitle>
                <DialogDescription>
                  Share your annotation to group or individual.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    value={link}
                    readOnly
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="px-3"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <RadioGroup defaultValue="group" value={radioItem} className="flex gap-3 mx-2" onValueChange={(value) => setRadioItem(value)}>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="group" id="r1" />
                  <Label htmlFor="r1">Group</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="individual" id="r1" />
                  <Label htmlFor="r1">Individual</Label>
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
                        {groupList && groupList.length > 0 && groupList.map((group) => {
                          return (
                            <SelectItem key={group.GroupId} value={group.GroupName} className='cursor-pointer'>{group.GroupName}</SelectItem>
                          )
                        })}
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
                <Button type="button">
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <button title="Switch to Presentation Mode" onClick={toggleFullScreen} className="p-1 hover:bg-gray-700 rounded">
            {isFullScreen ? (
              <Minimize2 size={18} className="cursor-pointer" />
            ) : (
              <Expand size={18} className="cursor-pointer" />
            )}
          </button>
          <button title="Tools" className="p-1 hover:bg-gray-700 rounded">
            <ChevronsRight size={22} className="cursor-pointer" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center py-3 overflow-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>
        <Document
          file={decodeURIComponent(pdfUrl)}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center"
          loading={<p>Loading PDF...</p>}
        >
          {Array.from({ length: numPages || 0 }, (_, index) => (
            <div
              key={index + 1}
              ref={(el) => (pageRefs.current[index] = el)}
              data-page-number={index + 1}
              className="mb-4"
            >
              <Page
                pageNumber={index + 1}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                scale={scale}
                onRenderSuccess={() => {
                  onPageRenderSuccess(index + 1);
                  highlightMatches(index + 1);
                }}
              />
            </div>
          ))}
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
      `}</style>
    </div>
  );
}