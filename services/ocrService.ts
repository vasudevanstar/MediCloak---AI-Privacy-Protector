// This service uses Tesseract.js and PDF.js loaded from a CDN.
// We declare them here to satisfy TypeScript.
declare var Tesseract: any;
declare var pdfjsLib: any;

interface ProgressLogger {
  (p: { status: string; progress: number }): void;
}

/**
 * Extracts text from a given file (PDF, image, or text).
 * @param file The file to process.
 * @param logger A callback function to report progress.
 * @returns A promise that resolves with the extracted text.
 */
export const extractText = async (file: File, logger: ProgressLogger): Promise<string> => {
  switch (file.type) {
    case 'image/jpeg':
    case 'image/png':
      return await ocrImage(file, logger);
    case 'application/pdf':
      return await ocrPdf(file, logger);
    case 'text/plain':
      return await file.text();
    default:
      throw new Error('Unsupported file type.');
  }
};

const ocrImage = async (file: File, logger: ProgressLogger): Promise<string> => {
  let worker: any;
  try {
    logger({ status: 'Initializing OCR engine...', progress: 0 });
    worker = await Tesseract.createWorker({ logger });
    logger({ status: 'Recognizing text from image...', progress: 0.2 });
    const { data: { text } } = await worker.recognize(file);
    return text;
  } catch (error) {
    console.error("Error during image OCR:", error);
    throw new Error("Failed to recognize text from the image. It might be in an unsupported format or too complex.");
  } finally {
    if (worker) {
        await worker.terminate();
    }
  }
};

const ocrPdf = async (file: File, logger: ProgressLogger): Promise<string> => {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
        fileReader.onload = async (ev) => {
            let worker: any;
            try {
                if (!ev.target?.result) {
                    throw new Error('Failed to read PDF file content.');
                }
                const typedarray = new Uint8Array(ev.target.result as ArrayBuffer);
                
                let pdf;
                try {
                    pdf = await pdfjsLib.getDocument(typedarray).promise;
                } catch (pdfError) {
                    console.error("PDF.js loading error:", pdfError);
                    throw new Error("Failed to load the PDF. The file may be corrupt or in an unsupported format.");
                }

                const numPages = pdf.numPages;
                let fullText = '';
                
                let tesseractProgressHandler = (m: any) => {
                    if (m.status === 'recognizing text') return;
                    logger(m);
                };
                
                logger({ status: 'Initializing OCR engine...', progress: 0 });
                worker = await Tesseract.createWorker({ 
                    logger: (m: any) => tesseractProgressHandler(m) 
                });

                for (let i = 1; i <= numPages; i++) {
                    const pageNum = i;

                    tesseractProgressHandler = (m: any) => {
                        if (m.status === 'recognizing text' && typeof m.progress === 'number') {
                            const pageProgress = m.progress;
                            const overallProgress = ((pageNum - 1) + pageProgress) / numPages;
                            logger({
                                status: `Recognizing text on page ${pageNum} of ${numPages}`,
                                progress: overallProgress
                            });
                        }
                    };

                    const pageProgressStart = (pageNum - 1) / numPages;
                    logger({ status: `Preparing page ${pageNum} of ${numPages} for OCR...`, progress: pageProgressStart });
                    
                    try {
                        const page = await pdf.getPage(pageNum);
                        const viewport = page.getViewport({ scale: 3.0 }); // Higher scale improves OCR accuracy but may reduce performance.
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        
                        if(!context){
                            throw new Error('Could not get 2D canvas context for PDF rendering.');
                        }
                        
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        const { data: { text } } = await worker.recognize(canvas); 
                        fullText += text + '\n\n';
                    } catch(pageError) {
                        console.error(`Error processing page ${pageNum}:`, pageError);
                        throw new Error(`Failed to process page ${pageNum}. The page may be damaged or contain unsupported content.`);
                    }
                }

                logger({ status: 'Processing complete.', progress: 1 });
                resolve(fullText);

            } catch (error) {
                if (error instanceof Error) {
                    reject(error);
                } else {
                    reject(new Error("An unknown error occurred during PDF processing."));
                }
            } finally {
                if (worker) {
                    await worker.terminate();
                }
            }
        };

        fileReader.onerror = (error) => {
            console.error("FileReader error:", error);
            reject(new Error("An error occurred while reading the file from your disk."));
        };

        fileReader.readAsArrayBuffer(file);
    });
};