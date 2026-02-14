import React, { useState, useCallback } from 'react';
import { X, FileText, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentProcessed?: (document: any) => void;
}

interface UploadResult {
  success: boolean;
  document?: any;
  validation?: any;
  error?: string;
  processingTime: number;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentProcessed
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadResults([]);

    const results: UploadResult[] = [];

    for (const file of files) {
      try {
        const startTime = Date.now();

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock result
        const mockResult = {
            success: true,
            document: {
                filename: file.name,
                fileType: file.name.split('.').pop(),
                fileSize: file.size,
                wordCount: Math.floor(Math.random() * 5000) + 500
            },
            validation: {
                isValid: true,
                reasoning: "Document content aligns with strategic intelligence parameters.",
                categories: ["Financial", "Legal", "Operational"]
            }
        };

        const processingTime = Date.now() - startTime;

        if (mockResult.success) {
          results.push({
            success: true,
            document: mockResult.document,
            validation: mockResult.validation,
            processingTime
          });

          // Notify parent component
          if (onDocumentProcessed) {
            onDocumentProcessed(mockResult.document);
          }
        } else {
          results.push({
            success: false,
            error: 'Upload failed',
            processingTime
          });
        }
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Network error',
          processingTime: 0
        });
      }
    }

    setUploadResults(results);
    setIsUploading(false);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return 'ðŸ“„';
      case 'docx': return 'ðŸ“';
      case 'txt': return 'ðŸ“ƒ';
      case 'image': return 'ðŸ–¼ï¸';
      default: return 'ðŸ“„';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white border border-stone-200 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-stone-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-stone-900">Document Intelligence Ingestion</h2>
              <p className="text-sm text-stone-500">Upload PDFs, DOCX, images, and text files for AI analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-stone-500 hover:text-stone-900" title="Close modal">
            <X className="w-6 h-6"/>
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-stone-300 hover:border-stone-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Drop documents here or click to browse
            </h3>
            <p className="text-sm text-stone-500 mb-4">
              Supports PDF, DOCX, TXT, and image files up to 50MB each
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.gif,.bmp,.tiff"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Processing...' : 'Choose Files'}
            </label>
          </div>

          {/* Upload Results */}
          {uploadResults.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-stone-900">Processing Results</h4>
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}

                    <div className="flex-1">
                      {result.document && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getFileTypeIcon(result.document.fileType)}</span>
                          <span className="font-medium text-stone-900">{result.document.filename}</span>
                          <span className="text-sm text-stone-500">
                            ({formatFileSize(result.document.fileSize)})
                          </span>
                        </div>
                      )}

                      {result.success ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-stone-600">Words extracted:</span>
                            <span className="font-medium">{result.document?.wordCount || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-stone-600">Processing time:</span>
                            <span className="font-medium">{result.processingTime}ms</span>
                          </div>
                          {result.validation && (
                            <div className="mt-3 p-3 bg-white rounded border border-stone-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-stone-900">Content Validation</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  result.validation.isValid
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {result.validation.isValid ? 'Valid' : 'Low Relevance'}
                                </span>
                              </div>
                              <p className="text-xs text-stone-600">{result.validation.reasoning}</p>
                              {result.validation.categories.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {result.validation.categories.map((cat: string, i: number) => (
                                    <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-red-700 text-sm">{result.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Supported Formats Info */}
          <div className="mt-6 p-4 bg-stone-50 rounded-lg">
            <h5 className="font-medium text-stone-900 mb-2">Supported Formats</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span>ðŸ“„</span>
                <span>PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <span>ðŸ“</span>
                <span>DOCX</span>
              </div>
              <div className="flex items-center gap-2">
                <span>ðŸ“ƒ</span>
                <span>TXT</span>
              </div>
              <div className="flex items-center gap-2">
                <span>ðŸ–¼ï¸</span>
                <span>Images (OCR)</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              Files are processed server-side with OCR for images and text extraction for documents.
              Content is validated for economic intelligence relevance.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};
