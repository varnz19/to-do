import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Moon,
  Sun,
  Laptop,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Keyboard,
  CheckCircle2,
  Sliders,
  Terminal,
  FileText
} from 'lucide-react';

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    exportData,
    importData,
    resetToSampleData,
    clearAllData,
    tasks,
    codingChallenges,
    jobs,
    notes,
    addToast
  } = useApp();

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result;
      if (typeof content === 'string') {
        importData(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const SHORTCUTS = [
    { key: '⌘ + K / Ctrl + K', description: 'Open Quick Jump Command Palette from anywhere' },
    { key: 'Enter', description: 'Submit Quick-Add input or commit inline editing' },
    { key: 'Escape', description: 'Close Command Palette or cancel inline editing' },
    { key: '↑ / ↓ Arrow Keys', description: 'Navigate through Command Palette results' },
    { key: 'Indent Handle', description: 'Nest a task as a subtask under the preceding item' },
    { key: 'Drag & Drop', description: 'Move application cards between Kanban stage columns' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-1 border-b border-notion-border/80 pb-4">
        <h1 className="text-3xl font-display font-semibold text-notion-text tracking-tight">
          Settings & Local Data Studio
        </h1>
        <p className="text-xs text-notion-muted italic">
          Configure visual palettes, manage portable JSON backups, and review keyboard shortcuts.
        </p>
      </div>

      {/* Theme Settings Section */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-notion-text">Appearance & Workspace Theme</h2>
          <p className="text-xs text-notion-muted italic">A calibrated warm palette designed for long focus sessions.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-lg">
          {[
            { id: 'light', label: 'Luminous Cream', icon: Sun, desc: 'Warm off-white base with terracotta' },
            { id: 'dark', label: 'Warm Espresso', icon: Moon, desc: 'Calm charcoal & warm ivory text' },
            { id: 'system', label: 'System Adaptive', icon: Laptop, desc: 'Follows operating system' },
          ].map(opt => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`p-3 rounded-lg border text-left flex flex-col gap-1.5 transition-all ${
                  isSelected
                    ? 'border-terracotta bg-terracotta/5 ring-1 ring-terracotta shadow-warm-sm'
                    : 'border-notion-border hover:bg-notion-hover'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={16} className={isSelected ? 'text-terracotta' : 'text-notion-muted'} />
                  {isSelected && <CheckCircle2 size={13} className="text-terracotta" />}
                </div>
                <span className="text-xs font-semibold text-notion-text">{opt.label}</span>
                <span className="text-[10px] text-notion-muted italic">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Management & Backup Section */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-notion-text">Data Persistence & Backups</h2>
          <p className="text-xs text-notion-muted italic">
            State persists automatically in browser LocalStorage. Export regular backups to portable JSON.
          </p>
        </div>

        {/* Database Status Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-notion-bg border border-notion-border rounded-lg text-xs">
          <div>
            <div className="text-notion-muted">To-Do Items</div>
            <div className="text-base font-display font-bold text-notion-text">{tasks.length}</div>
          </div>
          <div>
            <div className="text-notion-muted">Coding Problems</div>
            <div className="text-base font-display font-bold text-terracotta">{codingChallenges.length}</div>
          </div>
          <div>
            <div className="text-notion-muted">Job Applications</div>
            <div className="text-base font-display font-bold text-forest">{jobs.length}</div>
          </div>
          <div>
            <div className="text-notion-muted">Workspace Notes</div>
            <div className="text-base font-display font-bold text-notion-text">{notes.length}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
          <button
            onClick={exportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-terracotta text-white font-semibold shadow-warm-sm hover:bg-terracotta-dark transition-colors"
          >
            <Download size={13} />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-notion-card border border-notion-border hover:bg-notion-hover text-notion-text font-semibold shadow-warm-sm transition-colors"
          >
            <Upload size={13} className="text-forest" />
            <span>Restore from Backup</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => {
              if (window.confirm('Reset database to curated sample career data (Google, Stripe, Ramp, Linear)?')) {
                resetToSampleData();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-notion-card border border-notion-border hover:bg-notion-hover text-notion-text font-semibold shadow-warm-sm transition-colors"
          >
            <RefreshCw size={13} className="text-[#8A5B18] dark:text-[#E5B564]" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                clearAllData();
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-notion-card border border-rose-300 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-rose-600 dark:text-rose-400 shadow-warm-sm transition-colors"
          >
            <Trash2 size={13} />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-notion-border/60">
          <Keyboard size={16} className="text-terracotta" />
          <h2 className="text-sm font-semibold text-notion-text">Keyboard Shortcuts & Navigation</h2>
        </div>

        <div className="divide-y divide-notion-border/60">
          {SHORTCUTS.map(sc => (
            <div key={sc.key} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-notion-muted italic">{sc.description}</span>
              <kbd className="px-2 py-0.5 rounded bg-notion-bg border border-notion-border text-notion-text font-mono font-medium shadow-warm-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
