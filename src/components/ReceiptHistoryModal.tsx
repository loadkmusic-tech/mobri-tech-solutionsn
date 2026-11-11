import React, { useState } from 'react';
import { X, Search, Trash2, Printer, Eye, Download, FileSpreadsheet } from 'lucide-react';
import { ReceiptRecord, BrandingConfig } from '../types';

interface ReceiptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ReceiptRecord[];
  branding: BrandingConfig;
  onSelectReceipt: (receipt: ReceiptRecord) => void;
  onDeleteReceipt: (id: string) => void;
  onClearAllHistory: () => void;
}

export const ReceiptHistoryModal: React.FC<ReceiptHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  branding,
  onSelectReceipt,
  onDeleteReceipt,
  onClearAllHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = history.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.customerNationalId && r.customerNationalId.toLowerCase().includes(q)) ||
      (r.customerPhone && r.customerPhone.toLowerCase().includes(q)) ||
      (r.deviceModel && r.deviceModel.toLowerCase().includes(q)) ||
      (r.imeiNumber && r.imeiNumber.toLowerCase().includes(q)) ||
      (r.receiptNumber && r.receiptNumber.toLowerCase().includes(q))
    );
  });

  const exportToCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'Receipt #',
      'Date',
      'Customer Name',
      'National ID',
      'Phone',
      'Tier',
      'Device Model',
      'IMEI',
      'Amount',
      'Currency',
      'Branch',
    ];

    const rows = history.map((r) => [
      `"${r.receiptNumber}"`,
      `"${new Date(r.createdAt).toISOString()}"`,
      `"${r.customerName || ''}"`,
      `"${r.customerNationalId || ''}"`,
      `"${r.customerPhone || ''}"`,
      `"${r.tier || ''}"`,
      `"${r.deviceModel || ''}"`,
      `"${r.imeiNumber || ''}"`,
      r.amount,
      `"${r.currency}"`,
      `"${r.branch}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `receipts_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Generated Receipts History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Saved locally on this device ({history.length} records)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar & Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name, NIN, IMEI, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={exportToCSV}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete all receipt records?')) {
                      onClearAllHistory();
                    }
                  }}
                  className="px-3 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        {/* Receipt Records List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
            <p className="text-sm font-bold text-slate-600">No receipts found</p>
            <p className="text-xs text-slate-400 mt-1">
              Receipts generated from the main form will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-800">
                      {item.receiptNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600">
                      {item.tier}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-slate-900">
                    {item.customerName || 'Unnamed Customer'}
                    <span className="font-normal text-xs text-slate-500 ml-2">
                      ({item.customerPhone || 'No phone'})
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>
                      Item: <strong className="text-slate-700">{item.deviceModel}</strong>
                    </span>
                    <span>
                      IMEI: <strong className="font-mono text-slate-700">{item.imeiNumber}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                  <span className="text-sm font-extrabold font-mono text-emerald-950">
                    {item.currency} {item.amount.toLocaleString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectReceipt(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteReceipt(item.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {branding.agencyCreditText}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
