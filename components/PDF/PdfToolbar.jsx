'use client';
import { Button } from '../ui/button';
import { Bookmark, Check, ChevronFirst, ChevronLast, ChevronsRight, Copy, DownloadIcon, Expand, Eye, FileUp, Minimize2, Printer, Search, Share, ZoomIn, ZoomOut, Image, SquareArrowUp, SquareArrowDown, RotateCw, RotateCcw, MousePointer, Hand, Rows3, Columns3 } from 'lucide-react';
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
}) => {
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [radioItem, setRadioItem] = useState('group');
  const [dialogOpen, setDialogOpen] = useState(false);
  const link = "https://ui.shadcn.com/docs/installation";
  const dispatch = useDispatch();
  const userId = useUserId();

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
    const zoomLevels = [1.0, 1.5, 2.0, 2.5, 3.0];
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

    const printWindow = window.open(pdfUrl, '_blank');
    if (!printWindow) {
      showToast({
        title: 'Popup Blocked',
        description: 'Please allow popups to print the PDF',
        variant: 'error',
      });
      return;
    }

    printWindow.addEventListener('load', () => {
      printWindow.focus();
      printWindow.print();
    });
  };

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

  return (
    <div className="sticky top-0 bg-gray-dark text-white px-4 py-3 flex justify-between items-center gap-4 z-10">
      <div className="flex flex-row gap-5 items-center">
        <button
          title="Toggle Thumbnails"
          onClick={toggleThumbnails}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <Image size={16} className="cursor-pointer" />
        </button>
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
                  <button className="p-1 hover:bg-gray-300 rounded" onClick={() => setCurrentMatch((prev) => Math.max(prev - 1, 0))} disabled={searchResults.length === 0}>
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
          <span className="text-xs page-number-display">
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
        <button
          title="Print PDF"
          className="p-1 hover:bg-gray-700 rounded"
          onClick={() => {
            setIsPrinting(true);
            setTimeout(() => {
              window.print();
              setIsPrinting(false);
            }, 100);
          }}
        >
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
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (open) handleDialogOpen();
          else handleDialogClose();
        }}>
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
                      {groupList && groupList.length > 0 ? (
                        groupList.map((group) => (
                          <SelectItem key={group.GroupId} value={group.GroupName} className="cursor-pointer">
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
              <DropdownMenuItem className="cursor-pointer" onClick={() => setScrollMode('vertical')}>
                <Rows3 size={22} className="text-gray-500" />
                <span className="text-gray-600 text-sm">Vertical Scrolling</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => setScrollMode('horizontal')}>
                <Columns3 size={22} className="text-gray-500" />
                <span className="text-gray-600 text-sm">Horizontal Scrolling</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default React.memo(PdfToolbar);