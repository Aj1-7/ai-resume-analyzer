import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    const file = acceptedFiles[0] || null;

    return (
        <div className="w-full">
            <div {...getRootProps()} className="uploader-drag-area">
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-dark-300 truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-dark-200">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button 
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFileSelect?.(null);
                                }}
                            >
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/30 group-hover:border-primary/50 transition-colors duration-300">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-dark-300 mb-1">
                                    {isDragActive ? 'Drop your resume here' : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-sm text-dark-200">PDF files only (max {formatSize(maxFileSize)})</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
