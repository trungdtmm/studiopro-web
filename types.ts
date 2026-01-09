export type ProcessingStage = 'idle' | 'removing_background' | 'composing' | 'complete' | 'error';

export type ProductStrategy = 'PRESERVE_CONTENT' | 'REJECT_BACKGROUND' | 'GENERIC';

export interface ProcessedResult {
  originalUrl: string;
  processedUrl: string; // The final 800x800 white BG image (JPEG)
  maskUrl?: string; // Transparent PNG of the subject
  fileName: string;
  productType?: string;
  strategy?: ProductStrategy;
}

export interface ProcessingError {
  message: string;
  details?: string;
}

export const TARGET_DIMENSION = 800;
export const PADDING = 60; // 60px padding means 680x680 content area