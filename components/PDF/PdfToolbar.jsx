
'use client';
import { Button } from '../ui/button';
import { Bookmark, Check, ChevronFirst, ChevronLast, ChevronsRight, Copy, DownloadIcon, Expand, Eye, FileUp, Minimize2, Printer, Search, Share, ZoomIn, ZoomOut, Image, SquareArrowUp, SquareArrowDown, RotateCw, RotateCcw, MousePointer, Hand, Rows3, Columns3, StretchHorizontal, PencilLine } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupsByUserId } from '@/store/group-slice';
import useUserId from '@/hooks/useUserId';
import { Document, Page, pdfjs } from 'react-pdf';
import { Checkbox } from '../ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPen } from 'react-icons/fa';
import { MdHighlight } from 'react-icons/md';
import { FaEraser } from 'react-icons/fa';
import { FaHandPointer } from 'react-icons/fa';

const PdfToolbar = ({
  pageNumber,
  numPages,
  scale,
  setScale,
  rotation,
  setRotation,
  isFullScreen,
  setIsFullScreen,
  showSearchInput,
  setShowSearchInput,
  searchText,
  setSearchText,
  searchResults,
  currentMatch,
  setCurrentMatch,
  tool,
  setTool,
  showThumbnails,
  toggleThumbnails,
  pdfUrl,
  fileInputRef,
  handleFileSelect,
  searchInputRef,
  goToNextMatch,
  goToPage,
  groupList,
  user,
  containerRef,
  showToast,
  scrollMode,
  setScrollMode,
  highlightAll,
  setHighlightAll,
  matchCase,
  setMatchCase,
  selectedColor,
  setSelectedColor,
  selectedPenColor,
  setSelectedPenColor,
  clearAllAnnotations,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [radioItem, setRadioItem] = useState('group');
  const [toggleNotesBar, setToggleNotesBar] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPenColorPalette, setShowPenColorPalette] = useState(false);
  const dispatch = useDispatch();
  const userId = useUserId();

  const colors = [
    { name: 'Orange', value: '#FF4F0F', bgClass: 'bg-orange-500/20', borderClass: 'border-orange-400/50' },
    { name: 'Green', value: '#03A791', bgClass: 'bg-green-600/20', borderClass: 'border-green-400/50' },
    { name: 'Yellow', value: '#FFC107', bgClass: 'bg-yellow-600/20', borderClass: 'border-yellow-300/50' },
    { name: 'Purple', value: '#725CAD', bgClass: 'bg-purple-500/20', borderClass: 'border-purple-300/50' },
  ];

  const penColors = [
    '#000000', '#FF0000', '#00FF00', '#87CEEB', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000',
    '#FF69B4', '#8B4513', '#808080', '#FFB6C1', '#40E0D0',
    '#DDA0DD', '#98FB98', '#F0E68C', '#FF6347', '#4682B4'
  ];

  const selectedColorClasses = colors.find((color) => color.value === selectedColor) || colors[0];

  const togglePenColorPalette = () => {
    setShowPenColorPalette((prev) => !prev);
    setTool('pen');
  };

  const handlePenColorSelect = (color) => {
    setSelectedPenColor(color);
    console.log(`Selected pen color: ${color}`);
    setShowPenColorPalette(false);
  };

  const selectEraserTool = () => {
    setTool('eraser');
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      goToPage(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      goToPage(pageNumber + 1);
    }
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(numPages);
  };

  const zoomIn = () => {
    const zoomLevels = [1.0, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0,
      2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0]
    const currentIndex = zoomLevels.findIndex((z) => z === scale);
    if (currentIndex < zoomLevels.length - 1) {
      setScale(zoomLevels[currentIndex + 1]);
    }
  };

  const zoomOut = () => {
    const zoomLevels = [1.0, 1.5, 2.0, 2.5, 3.0];
    const currentIndex = zoomLevels.findIndex((z) => z === scale);
    if (currentIndex > 0) {
      setScale(zoomLevels[currentIndex - 1]);
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

  const handlePrintPDF = () => {
    if (!pdfUrl) {
      showToast({
        title: 'No PDF Loaded',
        description: 'Please load a PDF to print',
        variant: 'error',
      });
      return;
    }

    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.style.top = '-9999px';
    printContainer.style.display = 'flex';
    printContainer.style.justifyContent = 'center';
    printContainer.style.alignItems = 'center';
    printContainer.style.width = '100vw';
    printContainer.style.height = '100vh';
    document.body.appendChild(printContainer);

    const printStyles = document.createElement('style');
    printStyles.setAttribute('id', 'print-styles');
    printStyles.innerHTML = `
      @media print {
        body > *:not(#print-container) {
          display: none !important;
        }
        #print-container {
          display: flex !important;
          position: static !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        #print-container .react-pdf__Page {
          margin: 0 auto !important;
          box-shadow: none !important;
          background: white !important;
        }
        #print-container .react-pdf__Page__canvas {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 0 auto !important;
        }
      }
    `;
    document.head.appendChild(printStyles);

    const renderPage = async () => {
      try {
        const pdf = await pdfjs.getDocument(decodeURIComponent(pdfUrl)).promise;
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.0 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        const context = canvas.getContext('2d');

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        printContainer.appendChild(canvas);

        window.print();

        setTimeout(() => {
          document.body.removeChild(printContainer);
          document.head.removeChild(printStyles);
        }, 1000);
      } catch (error) {
        console.error('Error rendering page for print:', error);
        showToast({
          title: 'Print Error',
          description: 'Failed to print the selected page',
          variant: 'error',
        });
      }
    };

    renderPage();
  };

  const handleCopy = async () => {
    const link = "https://ui.shadcn.com/docs/installation";
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    showToast({
      title: 'Copied',
      description: 'Annotation link copied to clipboard',
      variant: 'success',
    });
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    if (user?.token && userId) {
      dispatch(getGroupsByUserId({ userId, authToken: user?.token }))
        .catch((err) => {
          console.error('Failed to fetch groups:', err);
          showToast({
            title: 'Error',
            description: 'Failed to fetch groups',
            variant: 'error',
          });
        });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleToggleNotesbar = () => {
    setToggleNotesBar(!toggleNotesBar);
  };

  return (
    <>
      <AnimatePresence>
        {toggleNotesBar && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 w-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl z-20"
          >
            <div className="flex flex-col items-center gap-6 pt-24 px-2">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group p-3 rounded-xl ${showPenColorPalette
                    ? 'bg-blue-600/20 border border-blue-400/50'
                    : 'bg-slate-800/60 hover:bg-blue-600/20 border border-slate-600/50 hover:border-blue-400/50'
                    } transition-all duration-300 backdrop-blur-sm`}
                  onClick={togglePenColorPalette}
                >
                  <FaPen className="w-5 h-5" style={{ color: selectedPenColor }} />
                </motion.button>
                {showPenColorPalette && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-14 top-0 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-lg shadow-xl p-3 z-50"
                  >
                    <div className="grid grid-cols-5 gap-2 w-40">
                      {penColors.map((color, index) => (
                        <button
                          key={index}
                          className="w-6 h-6 rounded-full hover:ring-2 hover:ring-white/50 transition-all border border-slate-600/30"
                          style={{ backgroundColor: color }}
                          onClick={() => handlePenColorSelect(color)}
                          title={`Color ${index + 1}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`group p-3 rounded-xl ${tool === 'eraser'
                  ? 'bg-red-600/20 border border-red-400/50'
                  : 'bg-slate-800/60 hover:bg-red-600/20 border border-slate-600/50 hover:border-red-400/50'
                  } transition-all duration-300 backdrop-blur-sm`}
                onClick={selectEraserTool}
                title="Eraser Tool"
              >
                <FaEraser className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`group p-3 rounded-xl ${tool === 'hand'
                  ? 'bg-green-600/20 border border-green-400/50'
                  : 'bg-slate-800/60 hover:bg-green-600/20 border border-slate-600/50 hover:border-green-400/50'
                  } transition-all duration-300 backdrop-blur-sm`}
                onClick={selectHandTool}
              >
                <FaHandPointer className="w-5 h-5 text-slate-400 group-hover:text-green-400 transition-colors" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`group p-3 rounded-xl ${tool === 'text'
                  ? 'bg-blue-600/20 border border-blue-400/50'
                  : 'bg-slate-800/60 hover:bg-blue-600/20 border border-slate-600/50 hover:border-blue-400/50'
                  } transition-all duration-300 backdrop-blur-sm`}
                onClick={selectTextTool}
              >
                <MousePointer className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="sticky top-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-slate-700/50 shadow-sm z-30"
      >
        <div className="px-6 py-4">
          <div className="flex justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-600/50 backdrop-blur-sm">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Toggle Thumbnails"
                  onClick={toggleThumbnails}
                  className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
                >
                  <Image size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </motion.button>
                <div className="relative" ref={searchInputRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Find in Document"
                    onClick={toggleSearchInput}
                    className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
                  >
                    <Search size={18} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
                  </motion.button>
                  {showSearchInput && (
                    <div className="absolute top-16 left-0 w-64 md:w-[620px] lg:w-[620px] bg-white dark:bg-gray-600 dark:text-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-200 ease-in-out">
                      <div className="flex items-center p-2 gap-2 w-full">
                        <Search size={16} className="text-gray-500 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Search document..."
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          className="px-2 py-1 text-sm text-gray-800 dark:bg-gray-800 dark:text-white dark:rounded-lg border-none focus:outline-none placeholder-gray-400 truncate"
                        />
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button className="p-1 hover:bg-gray-300 rounded" onClick={() => setCurrentMatch((prev) => Math.max(prev - 1, 0))} disabled={searchResults.length === 0}>
                            <ChevronFirst size={16} className="cursor-pointer text-black" />
                          </button>
                          <button className="p-1 hover:bg-gray-300 rounded" onClick={goToNextMatch} disabled={searchResults.length === 0}>
                            <ChevronLast size={16} className="cursor-pointer text-black" />
                          </button>
                          <div className='flex flex-row items-center gap-2'>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="highlight" checked={highlightAll}
                                onCheckedChange={(checked) => setHighlightAll(checked)} />
                              <label htmlFor="highlight" className="text-xs font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Highlight all</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="match" checked={matchCase}
                                onCheckedChange={(checked) => setMatchCase(checked)} />
                              <label htmlFor="match" className="text-xs font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Match case</label>
                            </div>
                          </div>
                          <span className="text-black text-xs px-2 py-1 rounded border border-black dark:border-white dark:text-white whitespace-nowrap">
                            {searchResults.length ? `${currentMatch + 1} of ${searchResults.length} matches` : 'No matches'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-600/50 backdrop-blur-sm">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="First Page"
                  className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group disabled:opacity-50"
                  onClick={goToFirstPage}
                  disabled={pageNumber <= 1}
                >
                  <SquareArrowUp size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Previous Page"
                  className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group disabled:opacity-50"
                  onClick={goToPreviousPage}
                  disabled={pageNumber <= 1}
                >
                  <ChevronFirst size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </motion.button>
                <div className="px-3 py-1 bg-slate-700/60 rounded-lg">
                  <span className="text-sm font-medium text-slate-200">
                    {pageNumber} / {numPages || '?'}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Next Page"
                  className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group disabled:opacity-50"
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                >
                  <ChevronLast size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Last Page"
                  className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group disabled:opacity-50"
                  onClick={goToLastPage}
                  disabled={pageNumber >= numPages}
                >
                  <SquareArrowDown size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </motion.button>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-600/50 backdrop-blur-sm">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Zoom Out"
                className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
                onClick={zoomOut}
              >
                <ZoomOut size={18} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
              </motion.button>
              <div className="px-3 py-1 bg-slate-700/60 rounded-lg min-w-[80px] text-center">
                <span className="text-sm font-medium text-slate-200">
                  {(scale * 100).toFixed(0)}%
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Zoom In"
                className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
                onClick={zoomIn}
              >
                <ZoomIn size={18} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
              </motion.button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/40 border border-slate-600/50 backdrop-blur-sm">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="My Annotations"
                  className="p-2 hover:bg-orange-600/20 rounded-lg transition-all duration-200 group"
                >
                  <Eye size={18} className="text-orange-400 group-hover:text-orange-300 transition-colors" />
                </motion.button>
                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Open File"
                    className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileUp size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </motion.button>
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Print PDF"
                  className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
                  onClick={handlePrintPDF}
                >
                  <Printer size={18} className="text-slate-300 group-hover:text-purple-400 transition-colors" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Download"
                  onClick={handleDownload}
                  className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
                >
                  <DownloadIcon size={18} className="text-slate-300 group-hover:text-green-400 transition-colors" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Add notes"
                  onClick={handleToggleNotesbar}
                  className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group disabled:opacity-50"
                  disabled={!pdfUrl}
                >
                  <PencilLine size={18} className={`${toggleNotesBar ? 'text-yellow-400' : 'text-slate-300 group-hover:text-yellow-400 transition-colors'}`} />
                </motion.button>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/40 border border-slate-600/50 backdrop-blur-sm">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
                    >
                      <ChevronsRight size={18} className="text-slate-300 group-hover:text-purple-400 transition-colors" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white/95 dark:bg-slate-800/95 border border-slate-200/50 dark:border-slate-600/50">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={rotateClockwise}>
                        <RotateCw className="mr-2 h-4 w-4" />
                        <span>Rotate Clockwise</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={rotateCounterclockwise}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        <span>Rotate Counterclockwise</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setScrollMode('vertical')}>
                        <Rows3 className="mr-2 h-4 w-4" />
                        <span>Vertical Scroll</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setScrollMode('horizontal')}>
                        <Columns3 className="mr-2 h-4 w-4" />
                        <span>Horizontal Scroll</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setScrollMode('wrapped')}>
                        <StretchHorizontal className="mr-2 h-4 w-4" />
                        <span>Wrapped Scroll</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                  if (open) handleDialogOpen();
                  else handleDialogClose();
                }}>
                  <DialogTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-orange-600/20 rounded-lg transition-all duration-200 group"
                    >
                      <Share size={18} className="text-orange-400 group-hover:text-orange-300 transition-colors" />
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 border border-slate-200/50 dark:border-slate-600/50" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Share Annotation
                      </DialogTitle>
                      <DialogDescription className="text-slate-600 dark:text-slate-400">
                        Share your annotation to group or individual.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">Link</Label>
                          <Input id="link" value="https://ui.shadcn.com/docs/installation" readOnly className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
                        </div>
                        <Button type="button" size="sm" className="px-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" onClick={handleCopy}>
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <RadioGroup
                        defaultValue="group"
                        value={radioItem}
                        className="flex gap-6"
                        onValueChange={(value) => setRadioItem(value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="group" id="r1" />
                          <Label htmlFor="r1" className="font-medium">Group</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="individual" id="r2" />
                          <Label htmlFor="r2" className="font-medium">Individual</Label>
                        </div>
                      </RadioGroup>
                      {radioItem === 'group' ? (
                        <div className="space-y-2">
                          <Label className="font-medium">Group</Label>
                          <Select>
                            <SelectTrigger className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600">
                              <SelectValue placeholder="Select Group" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600">
                              <SelectGroup>
                                {groupList && groupList.length > 0 ? (
                                  groupList.map((group) => (
                                    <SelectItem key={group.GroupId} value={group.GroupName} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700">
                                      {group.GroupName}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="no-groups" disabled>
                                    No groups available
                                  </SelectItem>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label className="font-medium">Email</Label>
                          <Input placeholder="Enter E-mail address" className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
                        </div>
                      )}
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <Button type="button" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Send
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Toggle Fullscreen"
                  onClick={toggleFullScreen}
                  className="p-2 hover:bg-slate-700/60 rounded-lg transition-all duration-200 group"
                >
                  {isFullScreen ?
                    <Minimize2 size={18} className="text-slate-300 group-hover:text-red-400 transition-colors" /> :
                    <Expand size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                  }
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PdfToolbar;
