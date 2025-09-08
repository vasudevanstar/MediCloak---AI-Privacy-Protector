import React, { useState, useCallback, useRef } from 'react';
import { extractText } from '../services/ocrService';
import { redactText } from '../services/piiService';
import { UploadIcon, DocumentTextIcon, ShieldCheckIcon, DownloadIcon, CpuChipIcon } from '../components/icons/Icons';

declare var pdfjsLib: any;

type ProgressState = { status: string; progress: number };

const SAMPLE_ORIGINAL_TEXT = `Patient Name: John Doe
DOB: 15/08/1985
Address: 123 Health St, Wellness City, 400001
Phone: +91 9876543210
Aadhaar: 1234 5678 9012

Diagnosis: Type 2 Diabetes.
Chief Complaint: Patient reports persistent fatigue.
Prescription: Metformin 500mg, once daily.
Follow-up: 3 months.
Doctor: Dr. Emily Carter`;

const SAMPLE_REDACTED_TEXT = `Patient Name: [REDACTED]
DOB: [REDACTED]
Address: [REDACTED]
Phone: [REDACTED]
Aadhaar: [REDACTED]

Diagnosis: Type 2 Diabetes.
Chief Complaint: Patient reports persistent fatigue.
Prescription: Metformin 500mg, once daily.
Follow-up: 3 months.
Doctor: [REDACTED]`;


export const DemoPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const [redactedText, setRedactedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<ProgressState>({ status: '', progress: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    setOriginalText('');
    setRedactedText('');
    setIsProcessing(false);
    setError('');
    setProgress({ status: '', progress: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const generatePreview = async (fileToPreview: File) => {
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    if (fileToPreview.type.startsWith('image/')) {
      const url = URL.createObjectURL(fileToPreview);
      setFilePreview(url);
    } else if (fileToPreview.type === 'text/plain') {
      const text = await fileToPreview.text();
      setFilePreview(text);
    } else if (fileToPreview.type === 'application/pdf') {
      setFilePreview('pdf-preview'); // Show icon while loading.
      try {
        const fileReader = new FileReader();
        fileReader.onload = async (ev) => {
          if (!ev.target?.result) {
            setError("Failed to read PDF file for preview.");
            return;
          };
          const typedarray = new Uint8Array(ev.target.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.0 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) {
            setError("Could not create canvas context for PDF preview.");
            return;
          }
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;
          setFilePreview(canvas.toDataURL());
        };
        fileReader.onerror = () => {
          setError("Error reading PDF file for preview.");
        }
        fileReader.readAsArrayBuffer(fileToPreview);
      } catch (e) {
        console.error("Error generating PDF preview:", e);
        setError("Could not generate PDF preview.");
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      resetState();
      if (['application/pdf', 'image/jpeg', 'image/png', 'text/plain'].includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
        generatePreview(selectedFile);
      } else {
        setError('Unsupported file type. Please upload a PDF, JPG, PNG, or TXT file.');
        setFile(null);
        setFilePreview(null);
      }
    }
  };

  const handleProcess = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setOriginalText('');
    setRedactedText('');
    setProgress({ status: 'Starting process...', progress: 0 });

    try {
      const logger = (p: ProgressState) => {
        setProgress({
          status: p.status,
          progress: Math.round(p.progress * 100),
        });
      };
      
      const extracted = await extractText(file, logger);
      setOriginalText(extracted);

      setProgress({ status: 'Analyzing with AI to redact PII...', progress: 99 });
      await new Promise(resolve => setTimeout(resolve, 100)); // UI update grace period

      const redacted = await redactText(extracted);
      setRedactedText(redacted);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during processing.');
      console.error(err);
    } finally {
      setIsProcessing(false);
      setProgress({ status: 'Completed', progress: 100 });
    }
  }, [file]);
  
  const downloadRedactedText = () => {
    if (!redactedText) return;
    const blob = new Blob([redactedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redacted_${file?.name.split('.')[0] || 'document'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadOriginalFile = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          MediCloak Demo
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
          Upload your medical document to see our AI in action.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Upload Document</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <label htmlFor="file-upload" className="mt-2 block text-sm font-medium text-teal-600 hover:text-teal-500 cursor-pointer">
                  <span>{file ? 'Change file' : 'Upload a file'}</span>
                  <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.txt" />
                </label>
                <p className="mt-1 text-xs text-gray-500">PDF, PNG, JPG or TXT</p>
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Preview</h2>
              <div className="border border-gray-200 rounded-lg h-48 bg-gray-50 p-2 flex items-center justify-center overflow-auto">
                {!file && <p className="text-gray-500">Your file preview will appear here</p>}
                {file && file.type === 'text/plain' && filePreview && <pre className="text-xs whitespace-pre-wrap">{filePreview}</pre>}
                {file && (file.type.startsWith('image/') || file.type === 'application/pdf') && filePreview && filePreview !== 'pdf-preview' && (
                    <img src={filePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                )}
                {file && file.type === 'application/pdf' && filePreview === 'pdf-preview' && (
                    <div className="text-center">
                        <DocumentTextIcon className="h-20 w-20 text-gray-400 mx-auto" />
                        <p className="text-xs text-gray-500 mt-2">Generating PDF preview...</p>
                    </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full md:w-auto inline-flex items-center justify-center px-12 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all"
            >
              <CpuChipIcon className="h-5 w-5 mr-2" />
              {isProcessing ? 'Processing...' : 'Redact with AI'}
            </button>
             {file && <button onClick={resetState} className="ml-4 text-sm text-gray-600 hover:text-gray-800">Clear</button>}
            <p className="text-xs text-gray-500 mt-3">Powered by Google Gemini</p>
          </div>
        </div>

        {isProcessing && !originalText && (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Processing Your Document...</h3>
              <p className="text-sm text-gray-500">Here's a sample of how redaction works:</p>
            </div>
             <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-2"><DocumentTextIcon className="h-5 w-5 mr-2" /> Sample Original</h3>
                <div className="border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto bg-gray-50 text-xs">
                  <pre className="whitespace-pre-wrap break-words font-sans">{SAMPLE_ORIGINAL_TEXT}</pre>
                </div>
              </div>
              <div>
                <h3 className="flex items-center text-lg font-semibold text-green-700 mb-2"><ShieldCheckIcon className="h-5 w-5 mr-2" /> Sample Redacted</h3>
                <div className="border border-green-300 rounded-lg p-4 h-64 overflow-y-auto bg-green-50 text-xs">
                  <pre className="whitespace-pre-wrap break-words font-sans">{SAMPLE_REDACTED_TEXT}</pre>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">{progress.status}</h3>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${progress.progress}%` }}></div>
            </div>
          </div>
        )}
        
        {originalText && (
          <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-bold text-gray-800">Results</h2>
               <div className="flex items-center gap-x-3">
                 {file && (
                    <button
                        onClick={downloadOriginalFile}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        <DownloadIcon className="h-5 w-5 mr-2" />
                        Download Original
                    </button>
                 )}
                 {redactedText && (
                   <button 
                      onClick={downloadRedactedText}
                      className="inline-flex items-center px-4 py-2 border border-teal-600 text-sm font-medium rounded-md text-teal-700 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                   >
                     <DownloadIcon className="h-5 w-5 mr-2" />
                     Download Redacted Text
                   </button>
                 )}
               </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-2"><DocumentTextIcon className="h-5 w-5 mr-2" /> Original</h3>
                <div className="border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto bg-gray-50 text-sm">
                  <pre className="whitespace-pre-wrap break-words font-sans">{originalText}</pre>
                </div>
              </div>
              <div>
                <h3 className="flex items-center text-lg font-semibold text-green-700 mb-2"><ShieldCheckIcon className="h-5 w-5 mr-2" /> Redacted (Safe Copy)</h3>
                <div className="border border-green-300 rounded-lg p-4 h-96 overflow-y-auto bg-green-50 text-sm">
                  {isProcessing && !redactedText ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-teal-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                      <p className="mt-2">AI is redacting PII...</p>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap break-words font-sans">{redactedText}</pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
