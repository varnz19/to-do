import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  Calendar,
  FileText,
  Settings,
  Plus,
  Moon,
  Sun,
  Download,
  ArrowRight,
  Code2,
  Terminal
} from 'lucide-react';

export default function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    tasks,
    codingChallenges,
    jobs,
    notes,
    theme,
    setTheme,
    exportData,
    addTask,
    addJob
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const pages = [
    { id: 'p-dash', title: 'Dashboard Overview', category: 'Navigation', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'p-tasks', title: 'Tasks & Nested To-Dos', category: 'Navigation', icon: CheckSquare, path: '/tasks' },
    { id: 'p-coding', title: 'Coding Prep & DSA Tracker', category: 'Navigation', icon: Code2, path: '/coding' },
    { id: 'p-jobs', title: 'Job Application Tracker', category: 'Navigation', icon: Briefcase, path: '/jobs' },
    { id: 'p-cal', title: 'Unified Calendar', category: 'Navigation', icon: Calendar, path: '/calendar' },
    { id: 'p-notes', title: 'Workspace Notes', category: 'Navigation', icon: FileText, path: '/notes' },
    { id: 'p-sett', title: 'Settings & Data Backup', category: 'Navigation', icon: Settings, path: '/settings' },
  ];

  const quickActions = [
    {
      id: 'a-new-task',
      title: 'Quick create task: ' + (query.trim() || 'New Task'),
      category: 'Actions',
      icon: Plus,
      action: () => {
        if (query.trim()) {
          addTask({ title: query.trim() });
          navigate('/tasks');
        } else {
          navigate('/tasks');
        }
      }
    },
    {
      id: 'a-new-job',
      title: 'Add new job entry',
      category: 'Actions',
      icon: Briefcase,
      action: () => navigate('/jobs')
    },
    {
      id: 'a-coding',
      title: 'Open coding challenges',
      category: 'Actions',
      icon: Code2,
      action: () => navigate('/coding')
    },
    {
      id: 'a-toggle-theme',
      title: `Switch to ${theme === 'dark' ? 'Light' : 'Warm dark'} palette`,
      category: 'Actions',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => setTheme(theme === 'dark' ? 'light' : 'dark')
    },
    {
      id: 'a-export',
      title: 'Export backup (JSON)',
      category: 'Actions',
      icon: Download,
      action: () => exportData()
    }
  ];

  const q = query.toLowerCase().trim();

  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(q));
  
  const filteredCoding = q.length > 1
    ? (codingChallenges || []).filter(c => c.title.toLowerCase().includes(q) || c.pattern.toLowerCase().includes(q)).slice(0, 3).map(c => ({
        id: `coding-${c.id}`,
        title: `${c.title} (${c.difficulty} • ${c.status})`,
        category: 'Coding Prep',
        icon: Code2,
        action: () => navigate('/coding')
      }))
    : [];

  const filteredJobs = q.length > 1
    ? jobs.filter(j => j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q)).slice(0, 3).map(j => ({
        id: `job-${j.id}`,
        title: `${j.company} — ${j.role} (${j.stage.toUpperCase()})`,
        category: 'Job Applications',
        icon: Briefcase,
        action: () => navigate(`/jobs/${j.id}`)
      }))
    : [];

  const filteredTasks = q.length > 1
    ? tasks.filter(t => t.title.toLowerCase().includes(q)).slice(0, 3).map(t => ({
        id: `task-${t.id}`,
        title: `${t.completed ? '[Done] ' : ''}${t.title}`,
        category: 'Tasks',
        icon: CheckSquare,
        action: () => navigate('/tasks')
      }))
    : [];

  const filteredNotes = q.length > 1
    ? notes.filter(n => n.title.toLowerCase().includes(q)).slice(0, 3).map(n => ({
        id: `note-${n.id}`,
        title: n.title,
        category: 'Notes',
        icon: FileText,
        action: () => navigate('/notes')
      }))
    : [];

  const allResults = [
    ...filteredPages.map(p => ({ ...p, action: () => navigate(p.path) })),
    ...filteredCoding,
    ...filteredJobs,
    ...filteredTasks,
    ...filteredNotes,
    ...quickActions
  ];

  const handleSelect = (item) => {
    setCommandPaletteOpen(false);
    if (item.action) {
      item.action();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (allResults.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allResults.length) % (allResults.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        handleSelect(allResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-xl bg-notion-card border border-notion-border rounded-xl shadow-warm-modal overflow-hidden animate-slide-down flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-notion-border gap-3">
          <Search size={17} className="text-terracotta shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, coding problems, jobs, or jump to page..."
            className="w-full bg-transparent text-notion-text placeholder:text-notion-muted text-sm outline-none font-medium"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs text-notion-muted bg-notion-hover border border-notion-border rounded font-mono">
            ESC
          </kbd>
        </div>

        <div className="overflow-y-auto p-2 flex flex-col gap-1 divide-y divide-notion-border/40">
          {allResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-notion-muted italic">
              No results found for "{query}".
            </div>
          ) : (
            allResults.map((item, idx) => {
              const Icon = item.icon || CheckSquare;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs ${
                    isSelected ? 'bg-notion-hover text-notion-text font-semibold' : 'text-notion-text/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon size={15} className={isSelected ? 'text-terracotta' : 'text-notion-muted'} />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] text-notion-muted px-1.5 py-0.5 rounded bg-notion-bg border border-notion-border">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight size={13} className="text-terracotta" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-notion-border bg-notion-sidebar flex items-center justify-between text-[11px] text-notion-muted font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>⌘K</span>
        </div>
      </div>

      <div className="fixed inset-0 -z-10" onClick={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
