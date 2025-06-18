import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return new File([compressedFile], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

export const compressPDF = async (file: File): Promise<File> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Compress PDF by removing unnecessary metadata and optimizing images
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 20,
    });

    return new File([compressedPdfBytes], file.name, {
      type: 'application/pdf',
      lastModified: file.lastModified,
    });
  } catch (error) {
    console.error('Error compressing PDF:', error);
    throw error;
  }
};

export const compressDocument = async (file: File): Promise<File> => {
  // For DOC and PPT files, we'll use a simple size check
  // In a real application, you might want to use a more sophisticated compression library
  if (file.size > 5 * 1024 * 1024) { // 5MB
    throw new Error('Document size exceeds 5MB limit');
  }
  return file;
}; 