import React, { useState } from 'react';
import { X, Printer, Download, Share2, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { ReceiptRecord, BrandingConfig } from '../types';
import { Barcode } from './Barcode';
import { downloadReceiptAsImage } from '../utils/receiptCanvas';

interface ReceiptModalProps {
  receipt: ReceiptRecord | null;
  branding: BrandingConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  receipt,
  branding,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadReceiptAsImage(receipt, branding);
    } catch (err) {
      console.error('Error downloading receipt image', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopySummary = () => {
    const text = `
-----------------------------------------
${branding.companyName.toUpperCase()} - ${branding.subtitle}
Branch: ${receipt.branch}
Receipt No: ${receipt.receiptNumber}
Date: ${new Date(receipt.createdAt).toLocaleString()}
-----------------------------------------
Customer: ${receipt.customerName}
National ID: ${receipt.customerNationalId}
Phone: ${receipt.customerPhone}
Tier: ${receipt.tier}
-----------------------------------------
Device: ${receipt.deviceModel}
IMEI: ${receipt.imeiNumber}
Payment: ${receipt.paymentMethod}
TOTAL: ${receipt.currency} ${receipt.amount.toLocaleString()}
-----------------------------------------
${branding.agencyCreditText}
-----------------------------------------
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-6 print:shadow-none print:border-none print:m-0 print:max-w-none print:w-full">
        {/* Action bar (hidden on print) */}
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase">Receipt Generated</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopySummary}
              title="Copy Receipt Summary"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download Receipt PNG"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print Receipt"
              className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 sm:p-7 space-y-5 bg-white text-slate-900">
          {/* Top Brand & Header */}
          <div className="text-center space-y-2 pt-1">
            {branding.logoUrl ? (
              <div className="flex justify-center mb-2">
                <img
                  src={branding.logoUrl}
                  alt={branding.companyName}
                  className="h-12 max-w-[160px] object-contain"
                />
              </div>
            ) : (
              <div className="flex justify-center mb-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  UG
                </div>
              </div>
            )}

            <div className="text-[11px] font-bold tracking-widest uppercase text-emerald-800">
              {branding.subtitle || 'UGANDA OPERATIONS'}
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {branding.companyName || 'Field Workspace'}
            </h1>

            {/* Accent gradient bar */}
            <div className="w-24 h-1.5 mx-auto rounded-full bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-500" />

            <div className="inline-block mt-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {receipt.branch || branding.branchTag || 'SHENJEN UG'}
              </span>
            </div>
          </div>

          {/* Receipt Meta */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                Receipt Number
              </span>
              <span className="font-mono font-bold text-slate-800">
                {receipt.receiptNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                Date & Time
              </span>
              <span className="font-medium text-slate-700">
                {new Date(receipt.createdAt).toLocaleString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Customer Details Box */}
          <div className="space-y-2 border-t border-b border-dashed border-slate-200 py-3.5 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Customer Full Name:</span>
              <span className="font-bold text-slate-900 text-right">
                {receipt.customerName || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">National ID / NIN:</span>
              <span className="font-mono font-semibold text-slate-800 text-right">
                {receipt.customerNationalId || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Customer Phone Number:</span>
              <span className="font-mono font-medium text-slate-800 text-right">
                {receipt.customerPhone || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Customer Tier:</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                {receipt.tier || 'Tier 1'}
              </span>
            </div>
          </div>

          {/* Item / Device Specifications */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Item / Model:</span>
              <span className="font-bold text-slate-900">
                {receipt.deviceModel || 'A07s 64GB/4GB'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">IMEI / Serial Number:</span>
              <span className="font-mono font-bold text-slate-900 tracking-wider">
                {receipt.imeiNumber || '351555817172073'}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Payment Mode:</span>
              <span className="font-medium text-slate-700">
                {receipt.paymentMethod || 'Field Cash / Mobile Money'}
              </span>
            </div>

            {/* Custom fields if present */}
            {receipt.customFieldsData &&
              Object.entries(receipt.customFieldsData).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500 font-medium">{key}:</span>
                  <span className="font-semibold text-slate-800">{val}</span>
                </div>
              ))}
          </div>

          {/* Total Price Box */}
          <div className="p-4 rounded-2xl bg-emerald-950 text-white flex items-center justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-semibold text-emerald-300 block uppercase tracking-wider">
                Total Paid
              </span>
              <span className="text-xs text-emerald-200/80">Official Currency</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                {receipt.currency || 'UGX'} {receipt.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="pt-2 pb-1 text-center">
            <Barcode value={receipt.imeiNumber || '351555817172073'} height={36} />
          </div>

          {/* Official Verification Seal / Stamp */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-600/40 bg-emerald-50 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>OFFICIALLY VERIFIED & ISSUED • {receipt.branch || 'SHENJEN UG'}</span>
            </div>
          </div>

          {/* Mandatory Agency Credit Footer */}
          <div className="pt-4 border-t border-slate-200 text-center space-y-1">
            <p className="text-[10px] text-slate-400">
              Please present this original receipt for warranty claims & customer support.
            </p>
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-800">
              {branding.agencyCreditText || 'ALL RIGHT REVOLVED BY MPENDO DIGITAL AGENCY'}
            </p>
          </div>
        </div>

        {/* Modal Close Button for Mobile (hidden on print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
