'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, File, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { UploadedFile, SUPPORTED_FORMATS, MAX_FILE_SIZE } from '@/types';

interface FileUploadProps {
    files: UploadedFile[];
    onFilesChange: (files: UploadedFile[]) => void;
}

export default function FileUpload({ files, onFilesChange }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

    const validateFile = (file: File): string | null => {
        if (!Object.keys(SUPPORTED_FORMATS).includes(file.type)) {
            return `${file.name}: Unsupported file format. Please upload PDF, DOC, DOCX, JPG, or PNG files.`;
        }
        if (file.size > MAX_FILE_SIZE) {
            return `${file.name}: File size exceeds 50MB limit.`;
        }
        return null;
    };

    const processFiles = useCallback(
        async (fileList: FileList) => {
            setError('');
            const newFiles: UploadedFile[] = [];

            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                const validationError = validateFile(file);

                if (validationError) {
                    setError(validationError);
                    continue;
                }

                const fileId = `${Date.now()}-${i}`;

                // Simulate upload progress
                setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

                const uploadedFile: UploadedFile = {
                    id: fileId,
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    pages: 1,
                };

                // Create preview for images
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        uploadedFile.preview = e.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                }

                // Create preview and get actual page count for PDFs
                if (file.type === 'application/pdf') {
                    uploadedFile.preview = URL.createObjectURL(file);
                    try {
                        const arrayBuffer = await file.arrayBuffer();
                        const { pdfjs } = await import('react-pdf');
                        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
                        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
                        uploadedFile.pages = pdf.numPages;
                    } catch {
                        uploadedFile.pages = 1; // Fallback if PDF parsing fails
                    }
                }

                // Simulate upload progress
                for (let progress = 0; progress <= 100; progress += 20) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
                }

                newFiles.push(uploadedFile);
            }

            onFilesChange([...files, ...newFiles]);
            setUploadProgress({});
        },
        [files, onFilesChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            processFiles(e.dataTransfer.files);
        },
        [processFiles]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                processFiles(e.target.files);
            }
        },
        [processFiles]
    );

    const removeFile = useCallback(
        (fileId: string) => {
            onFilesChange(files.filter((f) => f.id !== fileId));
        },
        [files, onFilesChange]
    );

    const getFileIcon = (type: string) => {
        if (type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
        if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
        return <File className="w-8 h-8 text-gray-500" />;
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div className="space-y-6">
            {/* Upload Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`card border-2 border-dashed transition-all duration-300 cursor-pointer hover:border-primary-400 ${isDragging ? 'border-primary-500 bg-primary-50/50 scale-105' : 'border-slate-300'
                    }`}
            >
                <input
                    type="file"
                    multiple
                    accept={Object.keys(SUPPORTED_FORMATS).join(',')}
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block text-center py-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className={`p-4 rounded-full bg-primary-100 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                            <Upload className={`w-12 h-12 text-primary-600 ${isDragging ? 'animate-bounce' : ''}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {isDragging ? 'Drop files here' : 'Upload your files'}
                            </h3>
                            <p className="text-gray-600 mb-1">
                                Drag and drop or <span className="text-primary-600 font-semibold">browse</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Supported: PDF, DOC, DOCX, JPG, PNG (Max 50MB)
                            </p>
                        </div>
                    </div>
                </label>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-slide-up">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Uploaded Files List */}
            {files.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">Uploaded Files ({files.length})</h3>
                    <div className="space-y-2">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="card flex items-center gap-4 hover:shadow-lg transition-shadow duration-300 animate-slide-up"
                            >
                                {/* File Icon/Preview */}
                                <div className="flex-shrink-0">
                                    {file.preview ? (
                                        <img src={file.preview} alt={file.name} className="w-16 h-16 object-cover rounded-lg" />
                                    ) : (
                                        <div className="w-16 h-16 flex items-center justify-center bg-slate-100 rounded-lg">
                                            {getFileIcon(file.type)}
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-800 truncate">{file.name}</h4>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                        <span>{formatFileSize(file.size)}</span>
                                        {file.pages && (
                                            <>
                                                <span>•</span>
                                                <span>{file.pages} pages</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Upload Progress */}
                                    {uploadProgress[file.id] !== undefined && uploadProgress[file.id] < 100 && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress[file.id]}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                                    aria-label="Remove file"
                                >
                                    <X className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
