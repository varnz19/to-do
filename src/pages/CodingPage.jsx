import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Code2,
  Plus,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Terminal,
  BookOpen,
  Cpu,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

export default function CodingPage() {
  const {
    codingChallenges,
    addCodingChallenge,
    updateCodingChallenge,
    deleteCodingChallenge,
    toggleCodingStatus
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  // New challenge form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('DSA');
  const [formDifficulty, setFormDifficulty] = useState('Medium');
  const [formPattern, setFormPattern] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Filtered challenges
  const filteredChallenges = useMemo(() => {
    return codingChallenges.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.pattern.toLowerCase().includes(q) ||
          (item.company && item.company.toLowerCase().includes(q)) ||
          (item.notes && item.notes.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'All' && item.difficulty !== selectedDifficulty) return false;
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
      return true;
    });
  }, [codingChallenges, searchQuery, selectedCategory, selectedDifficulty, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = codingChallenges.length;
    const solved = codingChallenges.filter(c => c.status === 'Solved').length;
    const inProgress = codingChallenges.filter(c => c.status === 'In Progress').length;
    const reviewNeeded = codingChallenges.filter(c => c.status === 'Review Needed').length;
    const rate = total > 0 ? Math.round((solved / total) * 100) : 0;
    return { total, solved, inProgress, reviewNeeded, rate };
  }, [codingChallenges]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    addCodingChallenge({
      title: formTitle.trim(),
      category: formCategory,
      difficulty: formDifficulty,
      pattern: formPattern.trim() || 'General Pattern',
      company: formCompany.trim() || 'General',
      link: formLink.trim(),
      notes: formNotes.trim(),
      status: 'In Progress'
    });

    setModalOpen(false);
    setFormTitle('');
    setFormPattern('');
    setFormCompany('');
    setFormLink('');
    setFormNotes('');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-terracotta/10 text-terracotta border border-terracotta/20">
            <Terminal size={13} />
            <span>Technical Prep Studio</span>
          </div>
          <h1 className="text-3xl font-display font-semibold text-notion-text tracking-tight">
            Coding & Problem Tracker
          </h1>
          <p className="text-xs text-notion-muted italic">
            Dedicated workspace for Data Structures, Algorithms, System Design blueprints, and take-home sprints.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta text-white text-xs font-semibold hover:bg-terracotta-dark transition-all shadow-warm-sm shrink-0"
        >
          <Plus size={15} />
          <span>New Problem</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-notion-muted">Total Practice Items</span>
          <div className="text-2xl font-display font-bold text-notion-text">{stats.total}</div>
          <span className="text-[11px] text-notion-muted italic">Curated technical problems</span>
        </div>

        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest">Solved & Mastered</span>
          <div className="text-2xl font-display font-bold text-forest">{stats.solved}</div>
          <span className="text-[11px] text-notion-muted italic">{stats.rate}% completion rate</span>
        </div>

        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A5B18] dark:text-[#E5B564]">In Progress</span>
          <div className="text-2xl font-display font-bold text-[#8A5B18] dark:text-[#E5B564]">{stats.inProgress}</div>
          <span className="text-[11px] text-notion-muted italic">Actively drilling</span>
        </div>

        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">Review Needed</span>
          <div className="text-2xl font-display font-bold text-terracotta">{stats.reviewNeeded}</div>
          <span className="text-[11px] text-notion-muted italic">Reinforce before interviews</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-3.5 shadow-warm-sm space-y-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-notion-bg rounded-lg border border-notion-border text-xs">
          <Search size={14} className="text-terracotta shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search problems by title, pattern (e.g. Sliding Window), or company..."
            className="w-full bg-transparent text-xs text-notion-text placeholder:text-notion-muted outline-none font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-notion-muted font-bold text-[11px] uppercase tracking-wider">Category:</span>
            {['All', 'DSA', 'System Design', 'Take-Home'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-terracotta text-white shadow-warm-sm'
                    : 'text-notion-muted hover:text-notion-text hover:bg-notion-hover'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="bg-transparent border border-notion-border rounded-lg px-2.5 py-1 text-xs text-notion-text font-medium outline-none cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-transparent border border-notion-border rounded-lg px-2.5 py-1 text-xs text-notion-text font-medium outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="In Progress">In Progress</option>
              <option value="Review Needed">Review Needed</option>
              <option value="To-Do">To-Do</option>
            </select>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="bg-notion-card border border-notion-border rounded-xl shadow-warm-sm divide-y divide-notion-border/60 overflow-hidden">
        {filteredChallenges.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="font-display text-base font-semibold text-notion-text">No technical problems found</p>
            <p className="text-xs text-notion-muted italic max-w-sm mx-auto">
              Adjust your search filters or click "New Problem" to add algorithms, mock interview questions, or take-home tasks.
            </p>
          </div>
        ) : (
          filteredChallenges.map(item => {
            let diffClass = 'bg-[#EEF5F1] text-[#285B40] dark:bg-[#162B1F] dark:text-[#76B992] border-[#BFDAC9] dark:border-[#264A35]';
            if (item.difficulty === 'Medium') {
              diffClass = 'bg-[#F9F3E8] text-[#8A5B18] dark:bg-[#2B2214] dark:text-[#E5B564] border-[#E8D7B8] dark:border-[#4A3A22]';
            } else if (item.difficulty === 'Hard') {
              diffClass = 'bg-[#FBF0EB] text-[#A8492C] dark:bg-[#331A14] dark:text-[#E78C72] border-[#EBCABE] dark:border-[#522920]';
            }

            let statusClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            if (item.status === 'Solved') {
              statusClass = 'bg-forest/15 text-forest dark:text-forest-light font-bold';
            } else if (item.status === 'In Progress') {
              statusClass = 'bg-[#F9F3E8] text-[#8A5B18] dark:bg-[#2B2214] dark:text-[#E5B564] font-bold';
            } else if (item.status === 'Review Needed') {
              statusClass = 'bg-terracotta/15 text-terracotta font-bold';
            }

            return (
              <div
                key={item.id}
                className="p-4 hover:bg-notion-hover/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold text-sm text-notion-text truncate">
                      {item.title}
                    </span>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-terracotta hover:underline inline-flex items-center gap-0.5"
                        title="Open problem link"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}

                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${diffClass}`}>
                      {item.difficulty}
                    </span>

                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-notion-bg text-notion-muted font-medium border border-notion-border">
                      {item.category}
                    </span>

                    {item.company && item.company !== 'General' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-terracotta/10 text-terracotta font-semibold">
                        {item.company}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-notion-muted text-[11px]">
                    <span className="font-semibold text-notion-text/90">Pattern: <span className="font-normal italic">{item.pattern}</span></span>
                    {item.lastPracticed && (
                      <span className="font-mono">Last reviewed: {item.lastPracticed}</span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-notion-muted/90 italic bg-notion-bg/60 p-2 rounded-lg border border-notion-border/60">
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Right Status Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleCodingStatus(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all border border-transparent hover:border-notion-border ${statusClass}`}
                    title="Click to cycle status"
                  >
                    {item.status}
                  </button>

                  <button
                    onClick={() => deleteCodingChallenge(item.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Delete item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Problem Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-notion-card border border-notion-border rounded-xl shadow-warm-modal p-6 space-y-4 animate-slide-down">
            <div className="flex items-center justify-between border-b border-notion-border pb-3">
              <div className="flex items-center gap-2">
                <Terminal size={17} className="text-terracotta" />
                <h2 className="font-display font-semibold text-base text-notion-text">Add Coding Problem</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-notion-muted hover:text-notion-text p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-notion-muted font-semibold">Problem Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LeetCode 200: Number of Islands"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-notion-muted font-semibold">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta cursor-pointer"
                  >
                    <option value="DSA">DSA (Algorithms & Data Structures)</option>
                    <option value="System Design">System Design</option>
                    <option value="Take-Home">Take-Home Assignment</option>
                    <option value="SQL">SQL / Database</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-notion-muted font-semibold">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={e => setFormDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta cursor-pointer"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-notion-muted font-semibold">Core Pattern</label>
                  <input
                    type="text"
                    placeholder="e.g. Sliding Window, Graph DFS, DP"
                    value={formPattern}
                    onChange={e => setFormPattern(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-notion-muted font-semibold">Target Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Stripe, Ramp"
                    value={formCompany}
                    onChange={e => setFormCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-notion-muted font-semibold">Problem / Documentation URL</label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={formLink}
                  onChange={e => setFormLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-notion-muted font-semibold">Key Takeaways & Complexity Notes</label>
                <textarea
                  rows={2}
                  placeholder="Time/Space complexity, edge cases to remember..."
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-notion-border text-notion-text hover:bg-notion-hover font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-terracotta text-white font-semibold hover:bg-terracotta-dark transition-colors shadow-warm-sm"
                >
                  Save Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
