import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { parseQuickAdd } from '../../lib/nlpParser';
import {
  Calendar as CalendarIcon,
  Tag,
  Clock,
  ArrowRight,
  Briefcase,
  CheckSquare,
  AlertCircle,
  Terminal
} from 'lucide-react';

const POPULAR_TAGS = ['#coding', '#dsa', '#interview', '#systems', '#urgent', '#resume', '#stripe', '#oa'];

export default function QuickAddBar({ placeholder = "Type naturally: 'Apply to Google SWE intern tomorrow #applied !high' or 'Implement LC 23 min-heap #coding'..." }) {
  const [input, setInput] = useState('');
  const [showTagMenu, setShowTagMenu] = useState(false);
  const { executeQuickAdd, addCodingChallenge } = useApp();

  const parsed = useMemo(() => {
    return parseQuickAdd(input);
  }, [input]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    // If marked with #coding, also add to coding challenges if relevant
    if (parsed && parsed.tags.includes('#coding')) {
      addCodingChallenge({
        title: parsed.title,
        category: 'DSA',
        difficulty: parsed.priority === 'urgent' ? 'Hard' : 'Medium',
        pattern: 'General'
      });
    }

    executeQuickAdd(input);
    setInput('');
    setShowTagMenu(false);
  };

  const handleAppendTag = (tag) => {
    setInput(prev => `${prev.trim()} ${tag} `);
    setShowTagMenu(false);
  };

  return (
    <div className="w-full bg-notion-card border border-notion-border rounded-xl p-3 shadow-warm-sm transition-all focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/15">
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-notion-text placeholder:text-notion-muted text-xs sm:text-sm outline-none font-medium"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTagMenu(prev => !prev)}
            className="text-notion-muted hover:text-notion-text p-1.5 rounded-md hover:bg-notion-hover text-xs flex items-center gap-1 transition-colors"
            title="Add tag"
          >
            <Tag size={14} />
          </button>

          {showTagMenu && (
            <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-notion-card border border-notion-border rounded-lg shadow-warm-modal p-1.5 z-20 text-xs">
              <div className="px-2 py-1 text-notion-muted text-[10px] font-bold uppercase tracking-wider">
                Quick Tags
              </div>
              <div className="space-y-0.5 mt-1">
                {POPULAR_TAGS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleAppendTag(t)}
                    className="w-full text-left px-2 py-1 rounded hover:bg-notion-hover text-notion-text transition-colors flex items-center gap-1.5 font-mono text-[11px]"
                  >
                    <span className="text-terracotta font-medium">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!input.trim()}
          className="px-3.5 py-1.5 rounded-lg bg-terracotta text-white text-xs font-semibold hover:bg-terracotta-dark disabled:opacity-30 transition-all flex items-center gap-1 shrink-0 shadow-warm-sm"
        >
          <span>Add</span>
          <ArrowRight size={13} />
        </button>
      </form>

      {/* Live NLP Chip Preview */}
      {parsed && (
        <div className="mt-2.5 pt-2 border-t border-notion-border/70 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-notion-muted text-[11px] font-bold uppercase tracking-wider mr-1">
            Detected:
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-notion-hover border border-notion-border text-notion-text font-medium text-[11px]">
            {parsed.type === 'job' ? <Briefcase size={12} className="text-terracotta" /> : <CheckSquare size={12} className="text-forest" />}
            {parsed.type === 'job' ? 'Job Tracker Entry' : 'Task'}
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-notion-hover text-notion-text text-[11px] max-w-[200px] truncate">
            "{parsed.title}"
          </span>

          {parsed.dueDate && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-[11px] border border-sky-200 dark:border-sky-800">
              <CalendarIcon size={12} />
              {parsed.dueDate}
            </span>
          )}

          {parsed.dueTime && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 font-semibold text-[11px] border border-purple-200 dark:border-purple-800">
              <Clock size={12} />
              {parsed.dueTime}
            </span>
          )}

          {parsed.priority && parsed.priority !== 'medium' && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border ${
              parsed.priority === 'urgent'
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}>
              <AlertCircle size={11} />
              {parsed.priority}
            </span>
          )}

          {parsed.tags.map(t => (
            <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 text-[11px] font-mono border border-indigo-200 dark:border-indigo-800">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
