import { ReceiptRecord, BrandingConfig } from '../types';

/**
 * Generates a high-resolution PNG receipt image using HTML5 Canvas and triggers a file download.
 */
export async function downloadReceiptAsImage(
  receipt: ReceiptRecord,
  branding: BrandingConfig
): Promise<void> {
  const scale = 2; // Retina sharpness
  const width = 480 * scale;
  const height = 780 * scale;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Decorative top green bar
  ctx.fillStyle = branding.primaryColor || '#0d472b';
  ctx.fillRect(0, 0, width, 14 * scale);

  // Subtitle / Header
  ctx.fillStyle = '#1e3a2b';
  ctx.font = `bold ${10 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '2px';
  ctx.fillText((branding.subtitle || 'UGANDA OPERATIONS').toUpperCase(), width / 2, 45 * scale);

  // Company Name
  ctx.fillStyle = '#0f172a';
  ctx.font = `800 ${22 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.letterSpacing = '0px';
  ctx.fillText(branding.companyName || 'Field Workspace', width / 2, 75 * scale);

  // Branch badge
  const branchText = branding.branchTag || 'SHENJEN UG';
  ctx.font = `600 ${11 * scale}px "Plus Jakarta Sans", sans-serif`;
  const branchMetrics = ctx.measureText(branchText);
  const pillW = branchMetrics.width + 24 * scale;
  const pillH = 22 * scale;
  const pillX = width / 2 - pillW / 2;
  const pillY = 90 * scale;

  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 11 * scale);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.fillText(branchText, width / 2, pillY + 15 * scale);

  // Title: Official Receipt
  ctx.fillStyle = '#047857';
  ctx.font = `700 ${13 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('OFFICIAL DEVICE PURCHASE RECEIPT', width / 2, 136 * scale);

  // Receipt Number & Date
  ctx.fillStyle = '#64748b';
  ctx.font = `500 ${11 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText(`RECEIPT #: ${receipt.receiptNumber}`, width / 2, 155 * scale);
  ctx.fillText(`DATE: ${new Date(receipt.createdAt).toLocaleString()}`, width / 2, 172 * scale);

  // Dashed separator line
  ctx.strokeStyle = '#e2e8f0';
  ctx.setLineDash([6 * scale, 4 * scale]);
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(30 * scale, 190 * scale);
  ctx.lineTo(width - 30 * scale, 190 * scale);
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash

  // Customer Information Section
  let currentY = 215 * scale;
  ctx.fillStyle = '#0f172a';
  ctx.font = `700 ${12 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('CUSTOMER DETAILS', 30 * scale, currentY);

  currentY += 20 * scale;
  const drawRow = (label: string, value: string) => {
    ctx.font = `500 ${11 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#64748b';
    ctx.fillText(label, 30 * scale, currentY);

    ctx.font = `600 ${12 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'right';
    ctx.fillText(value || 'N/A', width - 30 * scale, currentY);
    ctx.textAlign = 'left';
    currentY += 22 * scale;
  };

  drawRow('Customer Name', receipt.customerName || 'N/A');
  drawRow('National ID / NIN', receipt.customerNationalId || 'N/A');
  drawRow('Customer Number', receipt.customerPhone || 'N/A');
  drawRow('Customer Tier', receipt.tier || 'Tier 1');

  // Device Details Section
  currentY += 8 * scale;
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(30 * scale, currentY);
  ctx.lineTo(width - 30 * scale, currentY);
  ctx.stroke();

  currentY += 22 * scale;
  ctx.fillStyle = '#0f172a';
  ctx.font = `700 ${12 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('DEVICE SPECIFICATIONS', 30 * scale, currentY);

  currentY += 20 * scale;
  drawRow('Item / Model', receipt.deviceModel || 'A07s 64GB/4GB');
  drawRow('IMEI / Serial No', receipt.imeiNumber || '351555817172073');
  drawRow('Payment Method', receipt.paymentMethod || 'Cash / Mobile Money');

  // Amount box
  currentY += 10 * scale;
  const boxHeight = 58 * scale;
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(30 * scale, currentY, width - 60 * scale, boxHeight, 8 * scale);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = `600 ${11 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('TOTAL AMOUNT PAID', 45 * scale, currentY + 34 * scale);

  ctx.fillStyle = branding.primaryColor || '#0d472b';
  ctx.font = `800 ${18 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'right';
  const formattedAmount = `${receipt.currency || 'UGX'} ${receipt.amount.toLocaleString()}`;
  ctx.fillText(formattedAmount, width - 45 * scale, currentY + 36 * scale);
  ctx.textAlign = 'left';

  // Barcode visualization
  currentY += boxHeight + 30 * scale;
  ctx.fillStyle = '#0f172a';
  const barcodeHeight = 36 * scale;
  const barcodeWidth = width - 120 * scale;
  const barcodeX = 60 * scale;

  // Simple deterministic barcode pattern
  const code = (receipt.imeiNumber || '351555817172073') + (receipt.receiptNumber || '0000');
  let bx = barcodeX;
  for (let i = 0; i < code.length && bx < barcodeX + barcodeWidth; i++) {
    const digit = parseInt(code[i], 36) || 1;
    const barW = ((digit % 3) + 1) * scale;
    const gap = ((digit % 2) + 1) * scale;
    ctx.fillRect(bx, currentY, barW, barcodeHeight);
    bx += barW + gap;
  }

  currentY += barcodeHeight + 14 * scale;
  ctx.font = `500 ${10 * scale}px "JetBrains Mono", monospace`;
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'center';
  ctx.fillText(`* ${receipt.imeiNumber || '351555817172073'} *`, width / 2, currentY);

  // Official Stamp (Digital Seal)
  const stampX = width - 85 * scale;
  const stampY = 240 * scale;
  ctx.save();
  ctx.translate(stampX, stampY);
  ctx.rotate(-0.15); // subtle angle
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 2 * scale;
  ctx.setLineDash([4 * scale, 2 * scale]);
  ctx.beginPath();
  ctx.arc(0, 0, 38 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = `bold ${8 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = '#059669';
  ctx.fillText('VERIFIED & ISSUED', 0, -8 * scale);
  ctx.font = `800 ${10 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(branchText.substring(0, 14), 0, 6 * scale);
  ctx.font = `600 ${7 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('OFFICIAL STAMP', 0, 18 * scale);
  ctx.restore();

  // Footer: Required agency credit and terms
  currentY = height - 42 * scale;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 ${9 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('Thank you for your business. Keep this receipt for warranty claims.', width / 2, currentY);

  currentY += 18 * scale;
  ctx.fillStyle = '#0f172a';
  ctx.font = `700 ${10 * scale}px "Plus Jakarta Sans", sans-serif`;
  ctx.letterSpacing = '0.5px';
  // REQUIRED NOTICE:
  ctx.fillText(branding.agencyCreditText || 'ALL RIGHT REVOLVED BY MPENDO DIGITAL AGENCY', width / 2, currentY);

  // Trigger download
  const imageUri = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `Receipt-${receipt.receiptNumber}-${receipt.customerName ? receipt.customerName.replace(/\s+/g, '_') : 'Customer'}.png`;
  link.href = imageUri;
  link.click();
}
