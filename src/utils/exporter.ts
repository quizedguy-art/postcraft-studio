import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';
import type { AspectRatio } from '../types';

export interface ExportProgress {
  current: number;
  total: number;
  status: string;
}

export const triggerConfetti = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981'],
  });
};

export const exportSingleSlideAsPng = async (
  elementId: string,
  fileName: string = 'slide.png'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Slide element not found');

  const dataUrl = await htmlToImage.toPng(element, {
    pixelRatio: 2.5,
    quality: 1,
    cacheBust: true,
  });

  saveAs(dataUrl, fileName);
  triggerConfetti();
};

export const exportCarouselAsPdf = async (
  slideIds: string[],
  aspectRatio: AspectRatio,
  fileName: string = 'carousel.pdf',
  onProgress?: (p: ExportProgress) => void
): Promise<void> => {
  const total = slideIds.length;
  if (total === 0) return;

  // Aspect ratio dimensions in mm
  let pdfWidth = 210;
  let pdfHeight = 262.5; // 4:5 ratio default for LinkedIn
  if (aspectRatio === '1:1') {
    pdfWidth = 200;
    pdfHeight = 200;
  } else if (aspectRatio === '16:9') {
    pdfWidth = 297;
    pdfHeight = 167;
  } else if (aspectRatio === '9:16') {
    pdfWidth = 167;
    pdfHeight = 297;
  }

  const pdf = new jsPDF({
    orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [pdfWidth, pdfHeight],
    compress: true,
  });

  for (let i = 0; i < total; i++) {
    const id = slideIds[i];
    const element = document.getElementById(id);
    if (!element) continue;

    onProgress?.({
      current: i + 1,
      total,
      status: `Rendering slide ${i + 1} of ${total}...`,
    });

    const dataUrl = await htmlToImage.toJpeg(element, {
      pixelRatio: 2.2,
      quality: 0.95,
      cacheBust: true,
    });

    if (i > 0) {
      pdf.addPage([pdfWidth, pdfHeight], pdfWidth > pdfHeight ? 'landscape' : 'portrait');
    }

    pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  }

  onProgress?.({
    current: total,
    total,
    status: 'Compiling PDF document...',
  });

  pdf.save(fileName);
  triggerConfetti();
};

export const exportCarouselAsZip = async (
  slideIds: string[],
  baseName: string = 'carousel-slides',
  onProgress?: (p: ExportProgress) => void
): Promise<void> => {
  const zip = new JSZip();
  const folder = zip.folder(baseName) || zip;
  const total = slideIds.length;

  for (let i = 0; i < total; i++) {
    const id = slideIds[i];
    const element = document.getElementById(id);
    if (!element) continue;

    onProgress?.({
      current: i + 1,
      total,
      status: `Capturing image ${i + 1} of ${total}...`,
    });

    const dataUrl = await htmlToImage.toPng(element, {
      pixelRatio: 2.5,
      quality: 1,
      cacheBust: true,
    });

    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const slideNumber = String(i + 1).padStart(2, '0');
    folder.file(`slide-${slideNumber}.png`, base64Data, { base64: true });
  }

  onProgress?.({
    current: total,
    total,
    status: 'Generating ZIP archive...',
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${baseName}.zip`);
  triggerConfetti();
};
