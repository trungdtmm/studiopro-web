import React, { useState } from 'react';
import { Camera, Sparkles, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { DropZone } from './components/DropZone';
import { ResultViewer } from './components/ResultViewer';
import { processProductImage } from './services/processor';
import { ProcessingStage, ProcessedResult, ProcessingError } from './types';

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [error, setError] = useState<ProcessingError | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>("Initializing...");

  const handleFileSelect = async (file: File) => {
    try {
      // 1. Setup State for new process
      setIsProcessing(true);
      setError(null);

      const objectUrl = URL.createObjectURL(file);
      setOriginalImage(objectUrl);

      // 2. Start Processing
      const { processedUrl, maskUrl, productType, strategy } = await processProductImage(file, (msg) => {
        setProgressMessage(msg);
      });

      // 3. Set Results
      setResult({
        originalUrl: objectUrl,
        processedUrl,
        maskUrl,
        fileName: file.name,
        productType,
        strategy
      });

    } catch (err: any) {
      console.error(err);
      setError({
        message: "Processing Failed",
        details: err.message || "An unexpected error occurred."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-200">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              StudioPro
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-sm text-slate-500">
            <span className="flex items-center hover:text-indigo-600 transition-colors cursor-help font-medium" title="Local Processing">
              <Sparkles className="w-3 h-3 mr-1.5 text-indigo-500" />
              AI Enhanced
            </span>
          </div>
        </div>
      </header>

      {/* Main Content: Split Screen Layout */}
      <main className="relative z-10 flex-grow flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col lg:flex-row gap-6 lg:gap-8 h-full min-h-[600px]">

          {/* LEFT COLUMN: Input / Source */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-wider text-slate-500 font-bold">Source Image</h2>
              {!originalImage && <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-medium">Waiting for upload</span>}
            </div>

            <div className="flex-grow relative rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
              <DropZone
                onFileSelect={handleFileSelect}
                currentImage={originalImage || undefined}
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Mobile Separator / Desktop Arrow */}
          <div className="flex items-center justify-center lg:py-0 py-2">
            <ArrowRight className="w-6 h-6 text-slate-300 rotate-90 lg:rotate-0" />
          </div>

          {/* RIGHT COLUMN: Output / Result */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-wider text-slate-500 font-bold">Studio Result</h2>
              {isProcessing && <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full font-medium animate-pulse">Processing...</span>}
            </div>

            <div className="flex-grow relative rounded-3xl bg-white border border-slate-200 p-6 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center">

              {/* Empty State */}
              {!isProcessing && !result && !error && (
                <div className="text-center text-slate-400 p-8">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Sparkles className="w-8 h-8 opacity-40 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700">Ready to Create</h3>
                  <p className="text-sm mt-2 max-w-xs mx-auto text-slate-500">Upload an image on the left to automatically remove the background and center the product.</p>
                </div>
              )}

              {/* Loading State */}
              {isProcessing && (
                <div className="text-center animate-fade-in px-4">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{progressMessage}</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Using high-precision AI model. Large images may take a moment to analyze.
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && !isProcessing && (
                <div className="text-center animate-fade-in max-w-sm">
                  <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-slate-800 font-semibold mb-1">{error.message}</h3>
                  <p className="text-slate-500 text-sm">{error.details}</p>
                </div>
              )}

              {/* Success State */}
              {result && !isProcessing && (
                <ResultViewer result={result} />
              )}

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-200 bg-white/50 backdrop-blur-sm py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-xs">
          <p>&copy; {new Date().getFullYear()} StudioPro.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;