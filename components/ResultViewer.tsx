import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle, FileCheck, PenLine } from 'lucide-react';
import { ProcessedResult } from '../types';
import { Button } from './Button';

interface ResultViewerProps {
    result: ProcessedResult;
}

// Utility to convert Vietnamese string to unsigned slug
const toSlug = (str: string): string => {
    // 1. Remove Accents
    let slug = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 2. Handle specific Vietnamese characters that might remain
    slug = slug.replace(/[đĐ]/g, 'd');

    // 3. Remove all special characters except spaces and hyphens
    slug = slug.replace(/[^a-zA-Z0-9\s-]/g, '');

    // 4. Replace spaces with hyphens
    slug = slug.trim().replace(/\s+/g, '-');

    // 5. Lowercase
    return slug.toLowerCase();
};

export const ResultViewer: React.FC<ResultViewerProps> = ({ result }) => {
    // Initialize filename from original file (without extension)
    const [fileName, setFileName] = useState(() => {
        return result.fileName.replace(/\.[^/.]+$/, "");
    });

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = result.processedUrl;

        // Format the filename: Unsigned, dashed, lowercase
        const finalName = toSlug(fileName) || "product-image";

        link.download = `${finalName}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full h-full flex flex-col animate-fade-in">
            {/* Status Bar */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex flex-col">
                    <div className="flex items-center text-emerald-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Processing Complete</span>
                    </div>
                    {result.productType && (
                        <div className="mt-1.5 flex items-center flex-wrap gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-7">AI SMART ANALYSIS:</span>
                            <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold border border-indigo-100 shadow-sm">
                                {result.productType}
                            </span>
                            {result.strategy && (
                                <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter border shadow-sm ${result.strategy === 'PRESERVE_CONTENT'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                    {result.strategy === 'PRESERVE_CONTENT' ? 'Preserve Mode' : 'Extraction Mode'}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center self-start text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 font-medium shadow-sm">
                    <FileCheck className="w-3 h-3 mr-1.5 text-slate-500" />
                    JPEG Optimized
                </div>
            </div>

            {/* Main Image Area */}
            <div className="relative flex-grow min-h-[300px] rounded-2xl overflow-hidden bg-white shadow-lg ring-1 ring-slate-200 group">
                {/* Checkerboard pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <img
                    src={result.processedUrl}
                    alt="Processed"
                    className="relative w-full h-full object-contain p-4 z-10"
                />
            </div>

            {/* Naming and Actions */}
            <div className="mt-6 space-y-4">
                {/* Filename Input */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PenLine className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter product name..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    />
                    <div className="text-[10px] text-slate-400 mt-1.5 px-1 text-right italic">
                        Will save as: <span className="font-mono text-indigo-500">{toSlug(fileName) || 'product-image'}.jpg</span>
                    </div>
                </div>

                <Button
                    onClick={handleDownload}
                    icon={<Download className="w-4 h-4" />}
                    className="w-full py-3 text-base shadow-xl shadow-indigo-100 hover:shadow-indigo-200"
                >
                    Download Image
                </Button>

                <p className="text-center text-xs text-slate-400 font-medium">
                    Ready for e-commerce (800x800px • JPEG)
                </p>
            </div>
        </div>
    );
};