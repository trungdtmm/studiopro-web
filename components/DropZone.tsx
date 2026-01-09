import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, FileWarning, RefreshCw } from 'lucide-react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  currentImage?: string; // Optional URL of currently selected image
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, currentImage, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size is too large. Max 10MB.');
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  }, [disabled, onFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcess(e.target.files[0]);
    }
  };

  // Render logic for when we have an image
  if (currentImage) {
    return (
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="w-full h-full relative group rounded-2xl overflow-hidden bg-slate-50 shadow-inner"
      >
         <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={handleInputChange}
          disabled={disabled}
          accept="image/*"
        />
        
        {/* The Image Preview */}
        <div className="absolute inset-0 p-4">
            <img 
                src={currentImage} 
                alt="Source" 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-95 opacity-80 group-hover:opacity-40" 
            />
        </div>

        {/* Overlay Instructions */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 z-10 
            ${isDragging ? 'bg-indigo-50/90 opacity-100' : 'bg-white/80 opacity-0 group-hover:opacity-100'}`}>
            <RefreshCw className={`w-10 h-10 text-indigo-600 mb-2 ${isDragging || disabled ? 'animate-spin' : ''}`} />
            <p className="text-slate-700 font-semibold">Drop new image to replace</p>
        </div>
      </div>
    );
  }

  // Default Empty State
  return (
    <div className="w-full h-full min-h-[400px]">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full h-full flex flex-col items-center justify-center
          border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleInputChange}
          disabled={disabled}
          accept="image/*"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className={`p-5 rounded-full transition-colors duration-300 ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
            <Upload className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-700">
              {isDragging ? 'Drop it here!' : 'Upload Product Image'}
            </h3>
            <p className="text-sm text-slate-500 max-w-[200px] mx-auto leading-relaxed">
              Drag & drop or click to browse. <br/>
              <span className="text-slate-400 text-xs">Supports JPG, PNG, WEBP</span>
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center text-red-500 text-sm animate-fade-in pointer-events-none font-medium">
          <FileWarning className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};