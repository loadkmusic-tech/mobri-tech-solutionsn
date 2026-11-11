import React from 'react';
import {
  X,
  Sliders,
  Palette,
  History,
  Sparkles,
  RotateCcw,
  Building2,
  FileText,
  Shield,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { BrandingConfig } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  branding: BrandingConfig;
  onOpenBranding: () => void;
  onOpenFieldEditor: () => void;
  onOpenHistory: () => void;
  onLoadPreset: () => void;
  onClearForm: () => void;
  receiptCount: number;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  branding,
  onOpenBranding,
  onOpenFieldEditor,
  onOpenHistory,
  onLoadPreset,
  onClearForm,
  receiptCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center overflow-hidden shrink-0">
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.companyName}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-emerald-800 font-extrabold text-sm">UG</span>
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                {branding.companyName}
              </h3>
              <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                {branding.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Branch Pill */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-700">Active Node:</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white text-emerald-900 text-xs font-bold border border-slate-200 shadow-2xs">
            {branding.branchTag}
          </span>
        </div>

        {/* Nav Options */}
        <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-3 py-1">
            Workspace Settings
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenBranding();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-semibold transition text-left cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 transition">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Edit Logo & Branding</div>
              <div className="text-[11px] text-slate-400 font-normal">
                Upload logo, change titles, colors
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenFieldEditor();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-semibold transition text-left cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 transition">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Edit Form Fields</div>
              <div className="text-[11px] text-slate-400 font-normal">
                Rename labels, add custom fields
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenHistory();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-semibold transition text-left cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 transition">
              <History className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold">Receipt History</span>
                {receiptCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                    {receiptCount}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-normal">
                View previous generated receipts
              </div>
            </div>
          </button>

          <div className="pt-4 text-[10px] font-bold tracking-wider uppercase text-slate-400 px-3 py-1">
            Quick Form Presets
          </div>

          <button
            onClick={() => {
              onLoadPreset();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-amber-50 text-slate-700 hover:text-amber-900 text-xs font-semibold transition text-left cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-700 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Load Screenshot Data</div>
              <div className="text-[11px] text-slate-400 font-normal">
                A07s, 351555..., 726000, Tier 1
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              onClearForm();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 text-xs font-semibold transition text-left cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-rose-100 text-slate-600 group-hover:text-rose-700 transition">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold">Clear All Fields</div>
              <div className="text-[11px] text-slate-400 font-normal">
                Reset input values to empty
              </div>
            </div>
          </button>
        </div>

        {/* Mandatory Agency Credit Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>AUTHENTIC WORKSPACE</span>
          </div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900">
            {branding.agencyCreditText || 'ALL RIGHT REVOLVED BY MPENDO DIGITAL AGENCY'}
          </div>
        </div>
      </div>
    </div>
  );
};
