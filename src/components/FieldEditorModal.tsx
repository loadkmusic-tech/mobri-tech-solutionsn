import React, { useState } from 'react';
import { X, Plus, Trash2, Eye, EyeOff, RotateCcw, Check, Sparkles } from 'lucide-react';
import { CustomFormField } from '../types';

interface FieldEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: CustomFormField[];
  onUpdateFields: (fields: CustomFormField[]) => void;
  onResetFields: () => void;
}

export const FieldEditorModal: React.FC<FieldEditorModalProps> = ({
  isOpen,
  onClose,
  fields,
  onUpdateFields,
  onResetFields,
}) => {
  const [newLabel, setNewLabel] = useState('');
  const [newPlaceholder, setNewPlaceholder] = useState('');
  const [newType, setNewType] = useState<'text' | 'number' | 'select' | 'tel'>('text');
  const [newOptions, setNewOptions] = useState('Option 1, Option 2, Option 3');

  if (!isOpen) return null;

  const handleAddField = () => {
    if (!newLabel.trim()) return;
    const newField: CustomFormField = {
      id: `custom_${Date.now()}`,
      label: newLabel.trim(),
      placeholder: newPlaceholder.trim() || newLabel.trim(),
      type: newType,
      required: false,
      visible: true,
      options:
        newType === 'select'
          ? newOptions.split(',').map((o) => o.trim()).filter(Boolean)
          : undefined,
    };
    onUpdateFields([...fields, newField]);
    setNewLabel('');
    setNewPlaceholder('');
  };

  const handleUpdateField = (id: string, updates: Partial<CustomFormField>) => {
    onUpdateFields(
      fields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleDeleteField = (id: string) => {
    onUpdateFields(fields.filter((f) => f.id !== id));
  };

  const handleToggleVisibility = (id: string) => {
    onUpdateFields(
      fields.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Edit Form Fields
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize field labels, placeholders, dropdown items, or add new fields
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Fields List */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Current Fields Configuration ({fields.length})
          </label>
          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  field.visible
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-100/60 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                    #{idx + 1} • {field.type.toUpperCase()}
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(field.id)}
                      title={field.visible ? 'Hide field' : 'Show field'}
                      className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition"
                    >
                      {field.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteField(field.id)}
                      title="Delete field"
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                      Field Label
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                      Placeholder Text
                    </label>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) =>
                        handleUpdateField(field.id, { placeholder: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {field.type === 'select' && field.options && (
                  <div className="mt-2">
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                      Dropdown Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={field.options.join(', ')}
                      onChange={(e) =>
                        handleUpdateField(field.id, {
                          options: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Field Box */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
            <Plus className="w-4 h-4" />
            Add New Custom Field
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Field Label (e.g. Warranty Period)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white border border-emerald-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <input
              type="text"
              placeholder="Placeholder (optional)"
              value={newPlaceholder}
              onChange={(e) => setNewPlaceholder(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white border border-emerald-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="px-2.5 py-2 text-xs rounded-xl bg-white border border-emerald-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="text">Text Input</option>
              <option value="number">Number Input</option>
              <option value="tel">Phone / Tel</option>
              <option value="select">Dropdown Select</option>
            </select>
          </div>

          {newType === 'select' && (
            <input
              type="text"
              placeholder="Options separated by commas: e.g. Tier 1, Tier 2, Tier 3"
              value={newOptions}
              onChange={(e) => setNewOptions(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-emerald-300 text-slate-800 focus:outline-none"
            />
          )}

          <button
            type="button"
            onClick={handleAddField}
            disabled={!newLabel.trim()}
            className="w-full py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-40 transition cursor-pointer shadow-xs"
          >
            Insert Field
          </button>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onResetFields}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default Screenshot Fields
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-xs"
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
