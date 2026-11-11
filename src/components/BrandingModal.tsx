import React, { useRef } from 'react';
import { X, Upload, RotateCcw, Palette, Image as ImageIcon, Check } from 'lucide-react';
import { BrandingConfig } from '../types';

interface BrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingConfig;
  onUpdateBranding: (updated: BrandingConfig) => void;
  onResetBranding: () => void;
}

const PRESET_COLORS = [
  { name: 'Forest Green (Default)', hex: '#0d472b' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Deep Navy', hex: '#0f172a' },
  { name: 'Royal Blue', hex: '#1d4ed8' },
  { name: 'Burgundy', hex: '#881337' },
  { name: 'Uganda Yellow/Amber', hex: '#d97706' },
];

export const BrandingModal: React.FC<BrandingModalProps> = ({
  isOpen,
  onClose,
  branding,
  onUpdateBranding,
  onResetBranding,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Please choose an image under 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        onUpdateBranding({
          ...branding,
          logoUrl: reader.result as string,
          logoType: 'image',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Edit Workspace & Logo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize company name, branch badge, logo, and colors
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Company Logo
          </label>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt="Company Logo"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center text-white font-black text-sm"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  <span>FW</span>
                  <span className="text-[8px] font-normal tracking-tight">UG</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Custom Logo
                </button>
                {branding.logoUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateBranding({ ...branding, logoUrl: null, logoType: 'text' })
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition cursor-pointer"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Recommended: square PNG or SVG with transparent background
              </p>
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Top Subtitle / Operation Area
            </label>
            <input
              type="text"
              value={branding.subtitle}
              onChange={(e) => onUpdateBranding({ ...branding, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. UGANDA OPERATIONS"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Workspace / Company Name
            </label>
            <input
              type="text"
              value={branding.companyName}
              onChange={(e) => onUpdateBranding({ ...branding, companyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Field Workspace"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Branch / Location Badge
            </label>
            <input
              type="text"
              value={branding.branchTag}
              onChange={(e) => onUpdateBranding({ ...branding, branchTag: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. SHENJEN UG"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Currency Symbol
            </label>
            <input
              type="text"
              value={branding.currency}
              onChange={(e) => onUpdateBranding({ ...branding, currency: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. UGX"
            />
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Theme Button & Accent Color
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onUpdateBranding({ ...branding, primaryColor: c.hex })}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                    branding.primaryColor === c.hex
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="truncate">{c.name.split(' ')[0]}</span>
                  {branding.primaryColor === c.hex && (
                    <Check className="w-3.5 h-3.5 ml-auto text-emerald-700" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mandatory Agency Credit */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider">
              Agency Rights Credit (Required)
            </label>
            <input
              type="text"
              value={branding.agencyCreditText}
              onChange={(e) =>
                onUpdateBranding({ ...branding, agencyCreditText: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-amber-800">
              As requested, this credit appears on the screen footer and on all generated receipts.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onResetBranding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
