/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Sliders,
  Sparkles,
  History,
  CheckCircle2,
  FileText,
  RotateCcw,
  Smartphone,
  Monitor,
  Palette,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { CustomFormField, BrandingConfig, ReceiptRecord } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SidebarDrawer } from './components/SidebarDrawer';
import { BrandingModal } from './components/BrandingModal';
import { FieldEditorModal } from './components/FieldEditorModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ReceiptHistoryModal } from './components/ReceiptHistoryModal';

const DEFAULT_BRANDING: BrandingConfig = {
  companyName: 'Field Workspace',
  subtitle: 'UGANDA OPERATIONS',
  branchTag: 'SHENJEN UG',
  logoUrl: null,
  logoType: 'text',
  primaryColor: '#0d472b',
  accentGradient: 'from-[#0d472b] via-[#e5b22f] to-[#e76f51]',
  currency: 'UGX',
  footerText: 'Official Field Operations receipt system',
  showAgencyCredit: true,
  agencyCreditText: 'ALL RIGHT REVOLVED BY MPENDO DIGITAL AGENCY',
};

const DEFAULT_FIELDS: CustomFormField[] = [
  {
    id: 'customerNationalId',
    label: 'Customer National ID *',
    placeholder: 'Customer National ID *',
    type: 'text',
    required: true,
    visible: true,
  },
  {
    id: 'customerName',
    label: 'Customer Full Name *',
    placeholder: 'Customer Full Name *',
    type: 'text',
    required: true,
    visible: true,
  },
  {
    id: 'customerPhone',
    label: 'Customer Number *',
    placeholder: 'Customer Number *',
    type: 'tel',
    required: true,
    visible: true,
  },
  {
    id: 'tier',
    label: 'Tier Category',
    placeholder: 'Select Tier',
    type: 'select',
    required: true,
    options: ['Tier 1', 'Tier 2', 'Tier 3', 'Wholesale Partner', 'VIP Customer'],
    defaultValue: 'Tier 1',
    visible: true,
  },
  {
    id: 'deviceModel',
    label: 'Device Model / Description',
    placeholder: 'A07s 64GB/4GB',
    type: 'text',
    required: true,
    defaultValue: 'A07s 64GB/4GB',
    visible: true,
  },
  {
    id: 'imeiNumber',
    label: 'IMEI / Serial Number',
    placeholder: '351555817172073',
    type: 'text',
    required: true,
    defaultValue: '351555817172073',
    visible: true,
  },
  {
    id: 'amount',
    label: 'Price / Amount',
    placeholder: '726000',
    type: 'number',
    required: true,
    defaultValue: '726000',
    visible: true,
  },
];

const INITIAL_FORM_VALUES: Record<string, string> = {
  customerNationalId: '',
  customerName: '',
  customerPhone: '',
  tier: 'Tier 1',
  deviceModel: 'A07s 64GB/4GB',
  imeiNumber: '351555817172073',
  amount: '726000',
};

export default function App() {
  // Branding state
  const [branding, setBranding] = useState<BrandingConfig>(() => {
    try {
      const saved = localStorage.getItem('field_app_branding');
      return saved ? JSON.parse(saved) : DEFAULT_BRANDING;
    } catch {
      return DEFAULT_BRANDING;
    }
  });

  // Fields schema state
  const [fields, setFields] = useState<CustomFormField[]>(() => {
    try {
      const saved = localStorage.getItem('field_app_fields');
      return saved ? JSON.parse(saved) : DEFAULT_FIELDS;
    } catch {
      return DEFAULT_FIELDS;
    }
  });

  // Current Form values
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('field_app_form_values');
      return saved ? JSON.parse(saved) : INITIAL_FORM_VALUES;
    } catch {
      return INITIAL_FORM_VALUES;
    }
  });

  // Receipt History
  const [history, setHistory] = useState<ReceiptRecord[]>(() => {
    try {
      const saved = localStorage.getItem('field_app_receipt_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBrandingOpen, setIsBrandingOpen] = useState(false);
  const [isFieldEditorOpen, setIsFieldEditorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptRecord | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // View mode: 'mobile' mockup container vs 'fluid' responsive
  const [viewMode, setViewMode] = useState<'mobile' | 'fluid'>('mobile');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('field_app_branding', JSON.stringify(branding));
    } catch (e) {
      console.warn('Failed to save branding', e);
    }
  }, [branding]);

  useEffect(() => {
    try {
      localStorage.setItem('field_app_fields', JSON.stringify(fields));
    } catch (e) {
      console.warn('Failed to save fields', e);
    }
  }, [fields]);

  useEffect(() => {
    try {
      localStorage.setItem('field_app_form_values', JSON.stringify(formData));
    } catch (e) {
      console.warn('Failed to save form values', e);
    }
  }, [formData]);

  useEffect(() => {
    try {
      localStorage.setItem('field_app_receipt_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save receipt history', e);
    }
  }, [history]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleLoadScreenshotData = () => {
    setFormData({
      customerNationalId: 'CM93041103M7KL',
      customerName: 'Robert K. Mukasa',
      customerPhone: '+256 772 491 802',
      tier: 'Tier 1',
      deviceModel: 'A07s 64GB/4GB',
      imeiNumber: '351555817172073',
      amount: '726000',
    });
  };

  const handleClearForm = () => {
    const cleared: Record<string, string> = {};
    fields.forEach((f) => {
      cleared[f.id] = f.type === 'select' ? (f.options?.[0] || '') : '';
    });
    setFormData(cleared);
  };

  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate formatted receipt record
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const receiptNum = `UG-REC-${new Date().getFullYear()}-${randomDigits}`;

    const newRecord: ReceiptRecord = {
      id: `rec_${Date.now()}`,
      receiptNumber: receiptNum,
      createdAt: new Date().toISOString(),
      customerNationalId: formData.customerNationalId || 'N/A',
      customerName: formData.customerName || 'Field Customer',
      customerPhone: formData.customerPhone || 'N/A',
      tier: formData.tier || 'Tier 1',
      deviceModel: formData.deviceModel || 'A07s 64GB/4GB',
      imeiNumber: formData.imeiNumber || '351555817172073',
      amount: parseFloat(formData.amount) || 726000,
      currency: branding.currency || 'UGX',
      branch: branding.branchTag || 'SHENJEN UG',
      paymentMethod: 'Field Cash / Mobile Money',
      brandingSnapshot: {
        companyName: branding.companyName,
        subtitle: branding.subtitle,
        branchTag: branding.branchTag,
        logoUrl: branding.logoUrl,
      },
    };

    setHistory((prev) => [newRecord, ...prev]);
    setActiveReceipt(newRecord);
    setIsReceiptModalOpen(true);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#f3efe4] text-slate-900 font-sans flex flex-col items-center justify-start sm:p-4 md:p-6 transition-colors">
      {/* Top utility control bar for desktop view */}
      <header className="w-full max-w-md md:max-w-xl mx-auto flex items-center justify-between px-4 py-2 text-xs text-slate-600 print:hidden">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Field Workspace</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-emerald-800 font-semibold">{branding.branchTag}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick preset button */}
          <button
            type="button"
            onClick={handleLoadScreenshotData}
            title="Load sample customer data matching screenshot"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-700 hover:text-emerald-800 border border-slate-200 shadow-2xs font-medium transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Fill Sample</span>
          </button>

          {/* Customize Fields Modal trigger */}
          <button
            type="button"
            onClick={() => setIsFieldEditorOpen(true)}
            title="Customize Fields"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-700 hover:text-emerald-800 border border-slate-200 shadow-2xs font-medium transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Fields</span>
          </button>

          {/* View mode toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'mobile' ? 'fluid' : 'mobile')}
            title="Toggle between Mobile mockup and full width"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-2xs font-medium transition cursor-pointer"
          >
            {viewMode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Expand</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Mobile</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container - can be phone mockup shell or full fluid */}
      <main
        className={`w-full transition-all duration-300 relative ${
          viewMode === 'mobile'
            ? 'max-w-[420px] rounded-[44px] shadow-2xl border-[9px] border-[#22272a] bg-[#faf8f2] overflow-hidden my-1 sm:my-3'
            : 'max-w-md sm:max-w-lg md:max-w-xl rounded-3xl shadow-xl bg-[#faf8f2] border border-slate-200 overflow-hidden my-2'
        }`}
      >
        {/* Mobile Status Bar (Simulated when in mobile frame mode) */}
        {viewMode === 'mobile' && (
          <div className="pt-3 pb-1 px-7 flex items-center justify-between text-xs font-semibold text-slate-800 select-none bg-gradient-to-b from-[#f2efe6] to-[#faf8f2]">
            <span className="font-bold tracking-tight text-sm">02:08</span>
            <div className="w-20 h-4 rounded-full bg-slate-800/10 mx-auto" />
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-mono text-[10px]">4G</span>
              <div className="w-3 h-3 rounded-full border border-slate-600 flex items-center justify-center text-[7px] font-bold">
                W
              </div>
              <div className="px-1 py-0.2 rounded-sm bg-slate-300 text-slate-800 text-[9px] font-bold">
                11
              </div>
            </div>
          </div>
        )}

        {/* Top Header with Hamburger and Uganda Operations */}
        <Header
          branding={branding}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onOpenBranding={() => setIsBrandingOpen(true)}
          onUpdateBranding={setBranding}
          isQuickEditMode={false}
          onToggleQuickEditMode={() => setIsFieldEditorOpen(true)}
        />

        {/* Main White Card matching screenshot */}
        <div className="mt-2 bg-white rounded-t-[34px] p-6 shadow-sm border-t border-slate-100/80 min-h-[580px] flex flex-col justify-between">
          <form onSubmit={handleGenerateReceipt} className="space-y-4">
            {/* Card Title */}
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-[26px] font-extrabold text-[#111827] tracking-tight">
                Generate Receipt
              </h2>
              <button
                type="button"
                onClick={() => setIsFieldEditorOpen(true)}
                title="Edit field names and placeholders"
                className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 transition flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>Customize</span>
              </button>
            </div>

            {/* Dynamic & Configurable Fields */}
            <div className="space-y-3.5 pt-1">
              {fields
                .filter((f) => f.visible)
                .map((field) => {
                  const currentValue = formData[field.id] ?? '';

                  if (field.type === 'select') {
                    return (
                      <div key={field.id} className="relative">
                        <select
                          value={currentValue}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="w-full h-14 pl-4 pr-10 text-[15px] font-medium text-slate-800 bg-white rounded-2xl border border-[#e2e8f0] focus:border-emerald-600 focus:outline-none transition shadow-2xs appearance-none cursor-pointer"
                        >
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    );
                  }

                  return (
                    <div key={field.id} className="relative group">
                      <input
                        type={field.type === 'number' ? 'number' : field.type === 'tel' ? 'tel' : 'text'}
                        value={currentValue}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full h-14 px-4 text-[15px] font-medium text-slate-900 placeholder:text-slate-400/90 bg-white rounded-2xl border border-[#e2e8f0] focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition shadow-2xs"
                      />
                    </div>
                  );
                })}
            </div>

            {/* Action Button: Generate Receipt */}
            <div className="pt-2">
              <button
                type="submit"
                style={{ backgroundColor: branding.primaryColor || '#0d472b' }}
                className="w-full h-14 rounded-2xl text-white font-bold text-[16px] tracking-wide shadow-md hover:brightness-110 active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Generate Receipt</span>
              </button>
            </div>
          </form>

          {/* Quick presets & action chips */}
          <div className="pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={handleLoadScreenshotData}
              className="hover:text-emerald-800 font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Fill Sample Data</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-emerald-800 font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>History ({history.length})</span>
            </button>

            <button
              type="button"
              onClick={handleClearForm}
              className="hover:text-rose-600 font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Clear</span>
            </button>
          </div>

          {/* Required Agency Footer */}
          <Footer
            creditText={branding.agencyCreditText}
            onOpenBranding={() => setIsBrandingOpen(true)}
          />
        </div>

        {/* Mobile Navigation Bar Indicator (Simulated in mobile view mode) */}
        {viewMode === 'mobile' && (
          <div className="py-2.5 bg-white flex justify-center">
            <div className="w-32 h-1 rounded-full bg-slate-300" />
          </div>
        )}
      </main>

      {/* Floating Action Button for Branding and Quick Settings */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 print:hidden">
        <button
          type="button"
          onClick={() => setIsBrandingOpen(true)}
          title="Edit Logo & Branding"
          className="p-3.5 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 active:scale-95 transition cursor-pointer flex items-center gap-2 text-xs font-bold border border-slate-700"
        >
          <Palette className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Edit Logo & Colors</span>
        </button>
      </div>

      {/* Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        branding={branding}
        onOpenBranding={() => setIsBrandingOpen(true)}
        onOpenFieldEditor={() => setIsFieldEditorOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onLoadPreset={handleLoadScreenshotData}
        onClearForm={handleClearForm}
        receiptCount={history.length}
      />

      {/* Branding & Logo Modal */}
      <BrandingModal
        isOpen={isBrandingOpen}
        onClose={() => setIsBrandingOpen(false)}
        branding={branding}
        onUpdateBranding={setBranding}
        onResetBranding={() => setBranding(DEFAULT_BRANDING)}
      />

      {/* Field Editor Modal */}
      <FieldEditorModal
        isOpen={isFieldEditorOpen}
        onClose={() => setIsFieldEditorOpen(false)}
        fields={fields}
        onUpdateFields={setFields}
        onResetFields={() => setFields(DEFAULT_FIELDS)}
      />

      {/* Generated Receipt Modal */}
      <ReceiptModal
        receipt={activeReceipt}
        branding={branding}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      {/* History Modal */}
      <ReceiptHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        branding={branding}
        onSelectReceipt={(rec) => {
          setActiveReceipt(rec);
          setIsReceiptModalOpen(true);
        }}
        onDeleteReceipt={handleDeleteHistory}
        onClearAllHistory={handleClearAllHistory}
      />
    </div>
  );
}
