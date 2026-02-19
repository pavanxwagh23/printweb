'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { UploadedFile, PrintConfig } from '@/types';
import { FileText, Image as ImageIcon, ChevronLeft, ChevronRight, Eye, ZoomIn, ZoomOut, Palette, RotateCw, Copy, FileStack, Maximize } from 'lucide-react';

// Configure PDF.js worker - use local worker file
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface DocumentPreviewProps {
    files: UploadedFile[];
    config: PrintConfig;
}

export default function DocumentPreview({ files, config }: DocumentPreviewProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [pdfError, setPdfError] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateWidth = () => {
            if (previewContainerRef.current) {
                setContainerWidth(previewContainerRef.current.clientWidth - 32); // subtract padding
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    if (files.length === 0) {
        return null;
    }

    const selectedFile = files[selectedIndex];
    const isPDF = selectedFile.type === 'application/pdf';
    const isImage = selectedFile.type.startsWith('image/');

    const handlePrevious = () => {
        setSelectedIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : files.length - 1;
            setPageNumber(1);
            setPdfError(false);
            return newIndex;
        });
    };

    const handleNext = () => {
        setSelectedIndex((prev) => {
            const newIndex = prev < files.length - 1 ? prev + 1 : 0;
            setPageNumber(1);
            setPdfError(false);
            return newIndex;
        });
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
        setPdfError(false);
    };

    const onDocumentLoadError = () => {
        setPdfError(true);
    };

    const changePage = (offset: number) => {
        setPageNumber((prevPageNumber) => {
            const newPage = prevPageNumber + offset;
            return Math.max(1, Math.min(newPage, numPages || 1));
        });
    };

    const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.0));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

    return (
        <div className="card space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Document Preview</h2>
            </div>

            {/* Print Config Summary Bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1">Print Settings:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <Maximize className="w-3 h-3" />
                    {config.paperSize}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    <RotateCw className="w-3 h-3" />
                    {config.orientation === 'portrait' ? 'Portrait' : 'Landscape'}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.colorMode === 'color' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
                    }`}>
                    <Palette className="w-3 h-3" />
                    {config.colorMode === 'color' ? 'Color' : 'B&W'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    <Copy className="w-3 h-3" />
                    {config.sides === 'double' ? 'Double-sided' : 'Single-sided'}
                </span>
                {config.pagesPerSheet > 1 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                        <FileStack className="w-3 h-3" />
                        {config.pagesPerSheet}-up
                    </span>
                )}
                {config.copies > 1 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                        ×{config.copies} copies
                    </span>
                )}
            </div>

            {/* File Thumbnails */}
            {files.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {files.map((file, index) => (
                        <button
                            key={file.id}
                            onClick={() => setSelectedIndex(index)}
                            className={`flex-shrink-0 p-3 rounded-lg border-2 transition-all ${index === selectedIndex
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-slate-200 bg-white hover:border-primary-300'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {file.type === 'application/pdf' ? (
                                    <FileText className="w-5 h-5 text-red-600" />
                                ) : (
                                    <ImageIcon className="w-5 h-5 text-blue-600" />
                                )}
                                <div className="text-left">
                                    <p className="text-xs font-medium text-gray-800 truncate max-w-[120px]">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {file.pages ? `${file.pages} pages` : 'Image'}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Main Preview Area */}
            <div ref={previewContainerRef} className="relative bg-slate-50 rounded-lg overflow-hidden">
                {/* Navigation Buttons for Files */}
                {files.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                            aria-label="Previous file"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                            aria-label="Next file"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </>
                )}

                {/* Preview Content */}
                <div className="p-4" style={{ filter: config.colorMode === 'bw' ? 'grayscale(100%)' : 'none', transition: 'filter 0.3s ease' }}>
                    {isPDF ? (
                        <div className="bg-white rounded-lg shadow-inner">
                            {/* PDF Controls */}
                            {!pdfError && (
                                <div className="flex items-center justify-between gap-4 p-3 bg-slate-100 rounded-t-lg border-b">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => changePage(-1)}
                                            disabled={pageNumber <= 1}
                                            className="p-2 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-medium">
                                            Page {pageNumber} of {numPages || '?'}
                                        </span>
                                        <button
                                            onClick={() => changePage(1)}
                                            disabled={pageNumber >= (numPages || 1)}
                                            className="p-2 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Next page"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={zoomOut}
                                            disabled={scale <= 0.5}
                                            className="p-2 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Zoom out"
                                        >
                                            <ZoomOut className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
                                        <button
                                            onClick={zoomIn}
                                            disabled={scale >= 2.0}
                                            className="p-2 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Zoom in"
                                        >
                                            <ZoomIn className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PDF Document */}
                            <div className="flex justify-center bg-slate-100 p-4">
                                {selectedFile.preview ? (
                                    <Document
                                        file={selectedFile.preview}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={onDocumentLoadError}
                                        loading={
                                            <div className="flex items-center justify-center h-[400px]">
                                                <div className="text-gray-500">Loading PDF...</div>
                                            </div>
                                        }
                                        error={
                                            <div className="flex flex-col items-center justify-center h-[400px] gap-3">
                                                <FileText className="w-16 h-16 text-gray-300" />
                                                <p className="text-gray-500 font-medium">Unable to preview this PDF</p>
                                                <p className="text-sm text-gray-400">The file will still be printed correctly</p>
                                            </div>
                                        }
                                    >
                                        <Page
                                            pageNumber={pageNumber}
                                            width={containerWidth > 0 ? containerWidth * scale : undefined}
                                            className="shadow-lg"
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                        />
                                    </Document>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[400px] gap-3">
                                        <FileText className="w-16 h-16 text-gray-300" />
                                        <p className="text-gray-500 font-medium">PDF preview not available</p>
                                        <p className="text-sm text-gray-400">The file will still be printed correctly</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : isImage ? (
                        <div className="flex items-center justify-center bg-white rounded-lg shadow-inner p-4">
                            <img
                                src={selectedFile.preview}
                                alt={`Preview of ${selectedFile.name}`}
                                className="max-w-full object-contain rounded"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[400px] bg-white rounded-lg">
                            <div className="text-center text-gray-500">
                                <FileText className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                                <p>Preview not available for this file type</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>



            {/* File Counter */}
            {files.length > 1 && (
                <div className="text-center text-sm text-gray-600">
                    File {selectedIndex + 1} of {files.length}
                </div>
            )}
        </div>
    );
}
