import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CVDocument } from '../types/cv';

/**
 * 1) 즉시 `.pdf` 파일로 직접 다운로드 (고해상도 3x 캔버스 렌더링 + 멀티페이지 A4 분할 지원)
 */
export async function downloadResumePdfFile(doc: CVDocument): Promise<boolean> {
  const sourceEl = document.getElementById('maxcv-printable-sheet');
  if (!sourceEl) return false;

  // 페이지 경계선 가이드(.no-print)를 임시로 숨기고, 부모 scale 영향을 받지 않는 복제 노드로 캡처
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '-99999px';
  wrapper.style.left = '0';
  wrapper.style.zIndex = '-100';
  wrapper.style.background = '#ffffff';
  wrapper.style.width = doc.design.paperSize === 'LETTER' ? '215.9mm' : '210mm';

  const clone = sourceEl.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.boxShadow = 'none';
  clone.style.margin = '0';

  // 복제본 내부의 .no-print 요소 제거
  clone.querySelectorAll('.no-print').forEach((el) => el.remove());

  // html2canvas 렌더링 시 텍스트 베이스라인이 SVG 아이콘보다 아래로 내려가는 현상 보정 (수직 중앙 정렬)
  clone.querySelectorAll('.cv-inline-icon').forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.position = 'relative';
    htmlEl.style.top = '3.5px';
  });
  clone.querySelectorAll('.cv-section-header').forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.paddingBottom = '8px';
  });

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    // 웹폰트가 완전히 로드될 때까지 대기
    if ((document as any).fonts && (document as any).fonts.ready) {
      await (document as any).fonts.ready;
    }

    const canvas = await html2canvas(clone, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const isLetter = doc.design.paperSize === 'LETTER';
    const pdfWidthMm = isLetter ? 215.9 : 210;
    const pdfHeightMm = isLetter ? 279.4 : 297;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: isLetter ? 'letter' : 'a4',
      compress: true,
    });

    const imgProps = pdf.getImageProperties(imgData);
    const renderedHeightMm = (imgProps.height * pdfWidthMm) / imgProps.width;

    let heightLeft = renderedHeightMm;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidthMm, renderedHeightMm, undefined, 'FAST');
    heightLeft -= pdfHeightMm;

    // 1페이지를 초과하는 경우 자동으로 다음 A4 페이지 추가
    while (heightLeft > 4) {
      position = heightLeft - renderedHeightMm;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidthMm, renderedHeightMm, undefined, 'FAST');
      heightLeft -= pdfHeightMm;
    }

    const safeFileName = (doc.personal.fullName || doc.name || 'MaxCV_이력서')
      .replace(/[^a-zA-Z0-9가-힣_-]/g, '_')
      .replace(/_+/g, '_');

    pdf.save(`${safeFileName}.pdf`);
    return true;
  } finally {
    document.body.removeChild(wrapper);
  }
}

/**
 * 2) 빈 페이지가 절대 뜨지 않는 클린 iframe 기반 벡터 PDF 인쇄 (드래그/링크 클릭 가능)
 */
export function printVectorPdfClean(doc: CVDocument): void {
  const sourceEl = document.getElementById('maxcv-printable-sheet');
  if (!sourceEl) {
    window.print();
    return;
  }

  const clone = sourceEl.cloneNode(true) as HTMLElement;
  clone.style.transform = 'none';
  clone.style.boxShadow = 'none';
  clone.style.margin = '0 auto';
  clone.querySelectorAll('.no-print').forEach((el) => el.remove());

  // 현재 페이지의 모든 <link rel="stylesheet"> 와 <style> 태그를 수집하여 한국어 폰트 & Tailwind 완벽 유지
  const stylesHtml = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style')
  )
    .map((node) => node.outerHTML)
    .join('\n');

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    window.print();
    return;
  }

  const pageSizeCss = doc.design.paperSize === 'LETTER' ? 'letter portrait' : 'A4 portrait';

  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>${doc.personal.fullName || doc.name || 'MaxCV'}</title>
  ${stylesHtml}
  <style>
    @page {
      size: ${pageSizeCss};
      margin: 0;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    #maxcv-printable-sheet {
      box-shadow: none !important;
      margin: 0 !important;
      transform: none !important;
    }
  </style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`);
  iframeDoc.close();

  // 폰트 및 스타일시트 로딩 후 인쇄 실행
  setTimeout(async () => {
    try {
      if ((iframe.contentDocument as any)?.fonts?.ready) {
        await (iframe.contentDocument as any).fonts.ready;
      }
    } catch {
      // ignore
    }
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2000);
  }, 550);
}
