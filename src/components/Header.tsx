import React, { useState } from 'react';
import { Menu, Edit3, Check, Upload, Palette } from 'lucide-react';
import { BrandingConfig } from '../types';

interface HeaderProps {
  branding: BrandingConfig;
  onOpenDrawer: () => void;
  onOpenBranding: () => void;
  onUpdateBranding: (branding: BrandingConfig) => void;
  isQuickEditMode: boolean;
  onToggleQuickEditMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  branding,
  onOpenDrawer,
  onOpenBranding,
  onUpdateBranding,
  isQuickEditMode,
  onToggleQuickEditMode,
}) => {
  const [inlineEditing, setInlineEditing] = useState<string | null>(null);
  const [tempSubtitle, setTempSubtitle] = useState(branding.subtitle);
  const [tempTitle, setTempTitle] = useState(branding.companyName);
  const [tempBadge, setTempBadge] = useState(branding.branchTag);

  const saveInline = (field: 'subtitle' | 'title' | 'badge') => {
    if (field === 'subtitle') {
      onUpdateBranding({ ...branding, subtitle: tempSubtitle.trim() || 'UGANDA OPERATIONS' });
    } else if (field === 'title') {
      onUpdateBranding({ ...branding, companyName: tempTitle.trim() || 'Field Workspace' });
    } else if (field === 'badge') {
      onUpdateBranding({ ...branding, branchTag: tempBadge.trim() || 'SHENJEN UG' });
    }
    setInlineEditing(null);
  };

  return (
    <div className="relative pt-6 pb-4 px-6 select-none">
      {/* Top row with Hamburger Menu & Quick Controls */}
      <div className="flex items-start gap-4">
        {/* Left Hamburger Button matching screenshot */}
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-label="Open menu"
          className="w-14 h-14 rounded-2xl bg-white border border-[#e5e1d5] shadow-sm flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-95 transition cursor-pointer shrink-0"
        >
          <span className="w-5 h-[2.5px] rounded-full bg-[#0d472b]" />
          <span className="w-5 h-[2.5px] rounded-full bg-[#0d472b]" />
          <span className="w-5 h-[2.5px] rounded-full bg-[#0d472b]" />
        </button>

        {/* Header Titles & Branding */}
        <div className="flex-1 min-w-0">
          {/* Logo display if custom image uploaded */}
          {branding.logoUrl && (
            <div className="mb-2 flex items-center gap-2">
              <img
                src={branding.logoUrl}
                alt="Logo"
                className="h-9 max-w-[140px] object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={onOpenBranding}
                className="text-[10px] text-slate-400 hover:text-emerald-700 underline"
              >
                Change logo
              </button>
            </div>
          )}

          {/* Subtitle: UGANDA OPERATIONS */}
          <div className="flex items-center gap-2 group">
            {inlineEditing === 'subtitle' ? (
              <div className="flex items-center gap-1 my-0.5">
                <input
                  type="text"
                  value={tempSubtitle}
                  onChange={(e) => setTempSubtitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveInline('subtitle')}
                  autoFocus
                  className="px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-md bg-white border border-emerald-500 text-emerald-950 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => saveInline('subtitle')}
                  className="p-1 rounded bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setTempSubtitle(branding.subtitle);
                  setInlineEditing('subtitle');
                }}
                title="Click to edit subtitle"
                className="cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-[#14472f] hover:text-emerald-600 transition"
              >
                <span>{branding.subtitle}</span>
                <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-80 text-emerald-600 transition" />
              </div>
            )}
          </div>

          {/* Main Title: Field Workspace */}
          <div className="group mt-0.5 flex items-center gap-2">
            {inlineEditing === 'title' ? (
              <div className="flex items-center gap-1 my-0.5 w-full">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveInline('title')}
                  autoFocus
                  className="px-2 py-1 text-xl font-extrabold rounded-md bg-white border border-emerald-500 text-slate-900 focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => saveInline('title')}
                  className="p-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <h1
                onClick={() => {
                  setTempTitle(branding.companyName);
                  setInlineEditing('title');
                }}
                title="Click to edit company name"
                className="cursor-pointer text-2xl sm:text-[28px] font-black tracking-tight text-[#161c24] hover:text-emerald-900 transition flex items-center gap-2"
              >
                <span>{branding.companyName}</span>
                <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 text-slate-400 transition" />
              </h1>
            )}
          </div>

          {/* Gradient underline accent bar matching screenshot */}
          <div className="mt-1 h-[3.5px] w-24 rounded-full bg-gradient-to-r from-[#0d472b] via-[#e5b22f] to-[#e76f51]" />

          {/* Pill Badge: SHENJEN UG */}
          <div className="mt-2.5 flex items-center gap-2 group">
            {inlineEditing === 'badge' ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tempBadge}
                  onChange={(e) => setTempBadge(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveInline('badge')}
                  autoFocus
                  className="px-2 py-0.5 text-xs font-bold rounded-full bg-white border border-emerald-500 text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => saveInline('badge')}
                  className="p-1 rounded-full bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setTempBadge(branding.branchTag);
                  setInlineEditing('badge');
                }}
                title="Click to edit branch"
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 border border-[#e2decb] shadow-2xs text-xs font-bold text-slate-800 hover:border-emerald-600 transition cursor-pointer"
              >
                <span>{branding.branchTag}</span>
                <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-70 text-slate-400 transition" />
              </div>
            )}
          </div>
        </div>

        {/* Quick Edit Branding Button */}
        <button
          type="button"
          onClick={onOpenBranding}
          title="Customize Branding & Upload Logo"
          className="p-2.5 rounded-2xl bg-white/80 border border-[#e5e1d5] shadow-xs text-slate-600 hover:text-emerald-800 hover:bg-white active:scale-95 transition cursor-pointer shrink-0"
        >
          <Palette className="w-4 h-4 text-emerald-800" />
        </button>
      </div>
    </div>
  );
};
