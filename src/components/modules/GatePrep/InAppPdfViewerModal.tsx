import React, { useState } from 'react';
import { GateResource } from '../../../types/gate';
import {
  X,
  Download,
  Bookmark,
  BookmarkCheck,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  FileText,
  Check,
  Share2,
  Info
} from 'lucide-react';

interface InAppPdfViewerModalProps {
  resource: GateResource | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onDownload: (id: string) => void;
}

export const InAppPdfViewerModal: React.FC<InAppPdfViewerModalProps> = ({
  resource,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onDownload
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !resource) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(50, prev - 25));

  const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formattedFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl flex flex-col w-full overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'h-full w-full rounded-none border-none' : 'max-w-6xl h-[92vh]'
      }`}>
        
        {/* Top Viewer Control Bar */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* File Meta */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-2xl bg-red-500/20 text-red-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-white truncate max-w-xs sm:max-w-md">
                {resource.title}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                GATE {resource.gatePaper} • {resource.subject} • {formattedFileSize(resource.fileSize)} • v{resource.version}
              </p>
            </div>
          </div>

          {/* Center Navigation & Zoom Toolbar */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 text-xs font-bold">
            
            {/* Page Controls */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-xl hover:bg-slate-700 disabled:opacity-30 transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-[11px] font-mono text-slate-300">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-xl hover:bg-slate-700 disabled:opacity-30 transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="h-4 w-[1px] bg-slate-700 my-auto" />

            {/* Zoom Controls */}
            <button onClick={handleZoomOut} className="p-1.5 rounded-xl hover:bg-slate-700 transition" title="Zoom Out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-blue-400 w-10 text-center">{zoomLevel}%</span>
            <button onClick={handleZoomIn} className="p-1.5 rounded-xl hover:bg-slate-700 transition" title="Zoom In">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Search in PDF toggle */}
            <div className="hidden md:flex items-center bg-slate-800/80 rounded-xl px-2.5 py-1 border border-slate-700 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <input
                type="text"
                placeholder="Find in document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-28"
              />
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(resource.id)}
              className={`p-2 rounded-xl transition ${
                isBookmarked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Bookmark PDF"
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Share link */}
            <button
              onClick={handleCopyShare}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              title="Share PDF Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Info toggle */}
            <button
              onClick={() => setShowInfoPanel(!showInfoPanel)}
              className={`p-2 rounded-xl transition ${
                showInfoPanel ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Resource Info"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              onClick={() => onDownload(resource.id)}
              className="p-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body with Sidebar Metadata option */}
        <div className="flex-1 flex overflow-hidden relative bg-slate-950">
          
          {/* PDF Rendering Canvas / Iframe */}
          <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-start scrollbar-thin scrollbar-thumb-slate-800">
            
            <div
              style={{ width: `${zoomLevel}%` }}
              className="max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 transition-all duration-200 min-h-[800px] relative space-y-6"
            >
              {/* Simulated Watermark & Header */}
              <div className="flex items-center justify-between border-b pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>CKCET CAMPRO GATE ARCHIVE</span>
                <span>GATE {resource.gatePaper} • PAGE {currentPage}</span>
              </div>

              {/* PDF Document Title & Content Preview */}
              <div className="space-y-4 pt-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase">
                  {resource.resourceType.replace(/_/g, ' ')}
                </span>
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  {resource.title}
                </h1>
                <p className="text-sm text-slate-600 italic border-l-4 border-blue-600 pl-3 py-1">
                  {resource.description}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 font-mono text-slate-700">
                  <div className="flex justify-between">
                    <span>Subject: <strong>{resource.subject}</strong></span>
                    <span>Topic: <strong>{resource.topic}</strong></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Year: <strong>{resource.year || '2025'}</strong></span>
                    <span>Difficulty: <strong>{resource.difficulty}</strong></span>
                  </div>
                </div>

                {/* Simulated Document Pages Body */}
                <div className="pt-6 space-y-4 text-sm text-slate-800 leading-relaxed font-sans">
                  <h3 className="text-base font-bold text-slate-900 border-b pb-1">
                    Section {currentPage}: {resource.topic} Fundamentals & Practice Sets
                  </h3>
                  <p>
                    This educational archive document contains verified GATE reference materials curated by senior departmental faculty. Key equations, analytical concepts, and previous year solution procedures are formatted according to standard GATE examination benchmarks.
                  </p>
                  
                  <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">Key Analytical Equation / Property</span>
                    <div className="font-mono text-xs bg-white p-3 rounded-xl border border-blue-200 text-blue-950 font-bold">
                      H(s) = Y(s) / X(s) = ∑ [ b_k s^k ] / ∑ [ a_k s^k ]
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 pt-8 border-t text-center">
                    Document End of Page {currentPage} • Official Institutional Copy • {resource.uploadedByName} ({resource.uploadedByRole})
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Side Panel */}
          {showInfoPanel && (
            <div className="w-80 bg-slate-900 border-l border-slate-800 p-5 space-y-5 overflow-y-auto animate-slideInRight shrink-0 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span>Resource Metadata</span>
                </h4>
                <button onClick={() => setShowInfoPanel(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">Title</span>
                  <p className="font-semibold text-white">{resource.title}</p>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">GATE Paper / Branch</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">GATE {resource.gatePaper}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">Resource Category</span>
                  <span className="font-medium text-slate-300">{resource.resourceType.replace(/_/g, ' ')}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">Uploaded By</span>
                  <p className="font-medium text-slate-200">{resource.uploadedByName} ({resource.uploadedByRole})</p>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">Version History</span>
                  <p className="font-mono text-emerald-400">Current Version: v{resource.version}</p>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block">Views & Downloads</span>
                  <p className="text-slate-300 font-bold">{resource.viewCount} views • {resource.downloadCount} downloads</p>
                </div>

                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
