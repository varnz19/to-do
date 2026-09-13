import React, { useRef, useState } from 'react';
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
  FileText,
  AlertTriangle,
  X,
  Users2
} from 'lucide-react';

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    fontFamily = 'inter',
    setFontFamily,
    userName = 'Varnzz',
    setUserName,
    exportData,
    importData,
    resetToSampleData,
    clearAllData,
    tasks,
    codingChallenges,
    clubWork,
    jobs,
    notes,
    addToast
  } = useApp();

  const fileInputRef = useRef(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

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

  const handleExecuteClear = () => {
    clearAllData();
    setConfirmClearOpen(false);
  };

  const handleExecuteReset = () => {
    resetToSampleData();
    setConfirmResetOpen(false);
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      addToast(`Display name updated to "${nameInput.trim()}"`, 'success');
    }
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
        <h1 className="text-3xl font-bold text-notion-text tracking-tight">
          Settings & Local Data Studio
        </h1>
        <p className="text-xs text-notion-muted">
          Configure visual appearance, typography, display name, and portable JSON backups.
        </p>
      </div>

      {/* User Profile & Display Name Section */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-notion-text">Personal Identity & Display Name</h2>
            <p className="text-xs text-notion-muted">Your name is personalized on the dashboard greeting and workspace navigation.</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-warm-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>

        <form onSubmit={handleSaveName} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name..."
              className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-xs text-notion-text font-semibold outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-warm-xs transition-colors cursor-pointer shrink-0"
          >
            Save Display Name
          </button>
        </form>
      </div>

      {/* Typography & Font Family Section */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-notion-text">Workspace Typography & Font</h2>
          <p className="text-xs text-notion-muted">Select your preferred uniform font family across all headings and body text.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setFontFamily('inter')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              fontFamily === 'inter'
                ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-warm-sm'
                : 'border-notion-border bg-notion-bg hover:bg-notion-hover'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-notion-text">Inter (Default)</span>
              {fontFamily === 'inter' && <CheckCircle2 size={15} className="text-indigo-600 dark:text-indigo-400" />}
            </div>
            <p className="text-[11px] text-notion-muted font-sans">Modern, crisp, geometric interface typography.</p>
          </button>

          <button
            type="button"
            onClick={() => setFontFamily('jakarta')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              fontFamily === 'jakarta'
                ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-warm-sm'
                : 'border-notion-border bg-notion-bg hover:bg-notion-hover'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-notion-text">Plus Jakarta Sans</span>
              {fontFamily === 'jakarta' && <CheckCircle2 size={15} className="text-indigo-600 dark:text-indigo-400" />}
            </div>
            <p className="text-[11px] text-notion-muted font-sans">Sophisticated, clean contemporary grotesque sans.</p>
          </button>

          <button
            type="button"
            onClick={() => setFontFamily('system')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              fontFamily === 'system'
                ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-warm-sm'
                : 'border-notion-border bg-notion-bg hover:bg-notion-hover'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-notion-text">System Native</span>
              {fontFamily === 'system' && <CheckCircle2 size={15} className="text-indigo-600 dark:text-indigo-400" />}
            </div>
            <p className="text-[11px] text-notion-muted font-sans">San Francisco / Segoe UI native system fallback.</p>
          </button>
        </div>
      </div>

      {/* Theme Preference Section */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-notion-text">Appearance & Theme Palette</h2>
          <p className="text-xs text-notion-muted">Choose your preferred workspace aesthetic.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-warm-sm'
                : 'border-notion-border bg-notion-bg hover:bg-notion-hover'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-amber-500 flex items-center justify-center shadow-warm-xs">
                <Sun size={17} />
              </div>
              <div>
                <div className="font-semibold text-xs text-notion-text">Vibrant White (Light)</div>
                <div className="text-[11px] text-notion-muted">Pure white canvas with crisp borders</div>
              </div>
            </div>
            {theme === 'light' && <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />}
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-warm-sm'
                : 'border-notion-border bg-notion-bg hover:bg-notion-hover'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-indigo-400 flex items-center justify-center shadow-warm-xs">
                <Moon size={17} />
              </div>
              <div>
                <div className="font-semibold text-xs text-notion-text">Obsidian (Dark)</div>
                <div className="text-[11px] text-notion-muted">Low-strain dark studio interface</div>
              </div>
            </div>
            {theme === 'dark' && <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-notion-text">Data Persistence & Backups</h2>
          <p className="text-xs text-notion-muted">
            State persists automatically in browser LocalStorage. Export regular backups to portable JSON.
          </p>
        </div>

        {/* Database Status Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-notion-bg border border-notion-border rounded-lg text-xs">
          <div>
            <div className="text-notion-muted text-[11px]">Tasks</div>
            <div className="text-base font-bold text-notion-text">{tasks.length}</div>
          </div>
          <div>
            <div className="text-notion-muted text-[11px]">Coding Problems</div>
            <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">{(codingChallenges || []).length}</div>
          </div>
          <div>
            <div className="text-notion-muted text-[11px]">Club Initiatives</div>
            <div className="text-base font-bold text-blue-600 dark:text-blue-400">{(clubWork || []).length}</div>
          </div>
          <div>
            <div className="text-notion-muted text-[11px]">Job Applications</div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">{jobs.length}</div>
          </div>
          <div>
            <div className="text-notion-muted text-[11px]">Workspace Notes</div>
            <div className="text-base font-bold text-notion-text">{notes.length}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
          <button
            type="button"
            onClick={exportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-warm-sm transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span>Export Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-notion-card border border-notion-border hover:bg-notion-hover text-notion-text font-medium shadow-warm-sm transition-colors cursor-pointer"
          >
            <Upload size={13} className="text-emerald-600 dark:text-emerald-400" />
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
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-notion-card border border-notion-border hover:bg-notion-hover text-notion-text font-medium shadow-warm-sm transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmClearOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-notion-card border border-rose-300 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium text-rose-600 dark:text-rose-400 shadow-warm-sm transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-notion-border/60">
          <Keyboard size={16} className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-semibold text-notion-text">Keyboard Shortcuts & Navigation</h2>
        </div>

        <div className="divide-y divide-notion-border/60">
          {SHORTCUTS.map(sc => (
            <div key={sc.key} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-notion-muted">{sc.description}</span>
              <kbd className="px-2 py-0.5 rounded bg-notion-bg border border-notion-border text-notion-text font-mono font-medium shadow-warm-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Clear All Data Modal */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-notion-card border border-rose-200 dark:border-rose-900 rounded-xl shadow-warm-modal p-6 space-y-4 animate-slide-down">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 border border-rose-500/20">
                <AlertTriangle size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-notion-text">Clear All Workspace Data?</h3>
                <p className="text-xs text-notion-muted leading-relaxed">
                  This will permanently erase all tasks, club work, coding problems, jobs, notes, and activity history from your local browser storage. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-notion-border">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-notion-border bg-notion-bg hover:bg-notion-hover text-notion-muted text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteClear}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-warm-sm transition-colors cursor-pointer"
              >
                Yes, Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Demo Data Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-notion-card border border-notion-border rounded-xl shadow-warm-modal p-6 space-y-4 animate-slide-down">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <RefreshCw size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-notion-text">Reset Demo Sample Data?</h3>
                <p className="text-xs text-notion-muted leading-relaxed">
                  This will reload default curated career, coding, and club initiatives (GDGoC, IEEE CIS, Google, Stripe, Ramp) into your workspace.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-notion-border">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-notion-border bg-notion-bg hover:bg-notion-hover text-notion-muted text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-warm-sm transition-colors cursor-pointer"
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
