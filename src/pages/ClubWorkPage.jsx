import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  MapPin,
  Trash2,
  LayoutGrid,
  List,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Tag,
  Briefcase,
  X,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckSquare2,
  Square,
  Award,
  Layers
} from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = [
  'All',
  'Event Planning',
  'Workshops',
  'Finance & Budget',
  'Marketing & Outreach',
  'Logistics & Team'
];

const STATUS_CONFIG = {
  'Todo': {
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400'
  },
  'In Progress': {
    badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    dot: 'bg-indigo-500'
  },
  'Completed': {
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500'
  },
  'Blocked': {
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    dot: 'bg-rose-500'
  }
};

const PRIORITY_CONFIG = {
  'High': 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
  'Medium': 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  'Low': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
};

export default function ClubWorkPage() {
  const {
    clubWork,
    addClubItem,
    updateClubItem,
    deleteClubItem,
    toggleClubItemStatus,
    toggleClubDeliverable,
    addClubDeliverable
  } = useApp();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState('All'); // 'All' | 'GDGoC' | 'IEEE CIS'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expandedCards, setExpandedCards] = useState({});
  const [newDeliverableText, setNewDeliverableText] = useState({});

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formClubName, setFormClubName] = useState('GDGoC');
  const [formCategory, setFormCategory] = useState('Event Planning');
  const [formRole, setFormRole] = useState('Lead Organizer');
  const [formPriority, setFormPriority] = useState('Medium');
  const [formStatus, setFormStatus] = useState('In Progress');
  const [formDueDate, setFormDueDate] = useState('');
  const [formAssignee, setFormAssignee] = useState('Self');
  const [formBudget, setFormBudget] = useState('');
  const [formLocation, setFormLocation] = useState('Campus Innovation Hub');
  const [formNotes, setFormNotes] = useState('');
  const [formDeliverableInputs, setFormDeliverableInputs] = useState(['']);

  // Counts by Club
  const gdgocCount = useMemo(() => {
    return (clubWork || []).filter(c => c.clubName === 'GDGoC' && c.status !== 'Completed').length;
  }, [clubWork]);

  const ieeeCount = useMemo(() => {
    return (clubWork || []).filter(c => c.clubName === 'IEEE CIS' && c.status !== 'Completed').length;
  }, [clubWork]);

  const allActiveCount = useMemo(() => {
    return (clubWork || []).filter(c => c.status !== 'Completed').length;
  }, [clubWork]);

  // Filtered club items
  const filteredItems = useMemo(() => {
    return (clubWork || []).filter(item => {
      if (selectedClub !== 'All' && item.clubName !== selectedClub) return false;
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.title?.toLowerCase().includes(q) ||
          item.clubName?.toLowerCase().includes(q) ||
          item.role?.toLowerCase().includes(q) ||
          item.assignee?.toLowerCase().includes(q) ||
          item.notes?.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [clubWork, selectedClub, selectedCategory, selectedStatus, searchQuery]);

  // Funnel & high-level stats (relative to current selected club or global)
  const stats = useMemo(() => {
    const scopeItems = selectedClub === 'All'
      ? (clubWork || [])
      : (clubWork || []).filter(c => c.clubName === selectedClub);

    const total = scopeItems.length;
    const inProgress = scopeItems.filter(c => c.status === 'In Progress').length;
    const completed = scopeItems.filter(c => c.status === 'Completed').length;
    const blocked = scopeItems.filter(c => c.status === 'Blocked').length;

    let totalDeliverables = 0;
    let completedDeliverables = 0;
    scopeItems.forEach(c => {
      (c.deliverables || []).forEach(d => {
        totalDeliverables++;
        if (d.completed) completedDeliverables++;
      });
    });

    return {
      total,
      inProgress,
      completed,
      blocked,
      totalDeliverables,
      completedDeliverables
    };
  }, [clubWork, selectedClub]);

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddDeliverable = (clubId) => {
    const text = newDeliverableText[clubId];
    if (text && text.trim()) {
      addClubDeliverable(clubId, text.trim());
      setNewDeliverableText(prev => ({ ...prev, [clubId]: '' }));
    }
  };

  const handleOpenModal = (defaultClub = null) => {
    setFormTitle('');
    setFormClubName(defaultClub || (selectedClub !== 'All' ? selectedClub : 'GDGoC'));
    setFormCategory('Event Planning');
    setFormRole(defaultClub === 'IEEE CIS' ? 'Research & Technical Chair' : 'Lead Organizer');
    setFormPriority('Medium');
    setFormStatus('In Progress');
    setFormDueDate(new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]);
    setFormAssignee('Self');
    setFormBudget('');
    setFormLocation('Campus Innovation Hub');
    setFormNotes('');
    setFormDeliverableInputs(['']);
    setModalOpen(true);
  };

  const handleCreateClubItem = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const deliverables = formDeliverableInputs
      .filter(d => d.trim().length > 0)
      .map((d, idx) => ({
        id: 'cd-' + Date.now() + '-' + idx,
        title: d.trim(),
        completed: false
      }));

    addClubItem({
      title: formTitle.trim(),
      clubName: formClubName.trim(),
      category: formCategory,
      role: formRole.trim(),
      priority: formPriority,
      status: formStatus,
      dueDate: formDueDate || null,
      assignee: formAssignee.trim(),
      budget: formBudget.trim(),
      location: formLocation.trim(),
      notes: formNotes.trim(),
      deliverables
    });

    setModalOpen(false);
  };

  const getClubBadgeStyle = (clubName) => {
    if (clubName === 'GDGoC') {
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
    if (clubName === 'IEEE CIS') {
      return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
    }
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-7 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-notion-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold text-notion-text tracking-tight">
              Club Work & Campus Leadership
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {allActiveCount} Active
            </span>
          </div>
          <p className="text-xs text-notion-muted">
            Track executive duties, workshop roadmaps, and event deliverables for GDGoC and IEEE CIS.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenModal('GDGoC')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-warm-xs transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>+ GDGoC Task</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenModal('IEEE CIS')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium shadow-warm-xs transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>+ IEEE CIS Task</span>
          </button>
        </div>
      </div>

      {/* Dedicated Club Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-notion-card border border-notion-border rounded-xl p-2 shadow-warm-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedClub('All')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              selectedClub === 'All'
                ? 'bg-indigo-600 text-white shadow-warm-sm'
                : 'text-notion-muted hover:text-notion-text hover:bg-notion-hover'
            }`}
          >
            <Layers size={14} />
            <span>All Organizations</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedClub === 'All' ? 'bg-white/20 text-white' : 'bg-notion-border text-notion-muted'
            }`}>
              {allActiveCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedClub('GDGoC')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              selectedClub === 'GDGoC'
                ? 'bg-blue-600 text-white shadow-warm-sm'
                : 'text-notion-muted hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${selectedClub === 'GDGoC' ? 'bg-white' : 'bg-blue-500'}`} />
            <span>GDGoC (Google Developer Groups)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedClub === 'GDGoC' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
            }`}>
              {gdgocCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedClub('IEEE CIS')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              selectedClub === 'IEEE CIS'
                ? 'bg-cyan-600 text-white shadow-warm-sm'
                : 'text-notion-muted hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${selectedClub === 'IEEE CIS' ? 'bg-white' : 'bg-cyan-500'}`} />
            <span>IEEE CIS (Computational Intelligence)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedClub === 'IEEE CIS' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300'
            }`}>
              {ieeeCount}
            </span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border border-notion-border rounded-lg bg-notion-bg p-0.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-notion-card text-indigo-600 dark:text-indigo-400 font-semibold shadow-warm-xs'
                : 'text-notion-muted hover:text-notion-text'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid size={13} />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-notion-card text-indigo-600 dark:text-indigo-400 font-semibold shadow-warm-xs'
                : 'text-notion-muted hover:text-notion-text'
            }`}
            title="Structured Table View"
          >
            <List size={13} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Metrics Ribbon for Active Scope */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-notion-muted">
              {selectedClub === 'All' ? 'Active Initiatives' : `${selectedClub} In Flight`}
            </span>
            <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/20">
              {stats.inProgress}
            </span>
          </div>
          <div className="text-2xl font-bold text-notion-text">
            {stats.inProgress} <span className="text-xs font-medium text-notion-muted">active</span>
          </div>
          <p className="text-[11px] text-notion-muted">{stats.total} total initiatives recorded</p>
        </div>

        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-notion-muted">Action Items Done</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
              <CheckCircle2 size={15} />
            </span>
          </div>
          <div className="text-2xl font-bold text-notion-text">
            {stats.completedDeliverables} <span className="text-xs font-medium text-notion-muted">of {stats.totalDeliverables} tasks</span>
          </div>
          <p className="text-[11px] text-notion-muted">Checklist deliverable velocity</p>
        </div>

        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-notion-muted">Club Distribution</span>
            <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
              <Users2 size={15} />
            </span>
          </div>
          <div className="text-2xl font-bold text-notion-text flex items-baseline gap-2">
            <span className="text-blue-600 dark:text-blue-400">{gdgocCount}</span>
            <span className="text-xs text-notion-muted">GDGoC</span>
            <span className="text-xs text-notion-muted">•</span>
            <span className="text-cyan-600 dark:text-cyan-400">{ieeeCount}</span>
            <span className="text-xs text-notion-muted">IEEE CIS</span>
          </div>
          <p className="text-[11px] text-notion-muted">Separate active task counts</p>
        </div>

        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-notion-muted">Completed</span>
            <span className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/20">
              {stats.completed}
            </span>
          </div>
          <div className="text-2xl font-bold text-notion-text">
            {stats.completed} <span className="text-xs font-medium text-purple-600 dark:text-purple-400">finished</span>
          </div>
          <p className="text-[11px] text-notion-muted">Archived projects & workshops</p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-notion-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${selectedClub === 'All' ? 'all club' : selectedClub} tasks, roles, or notes...`}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-notion-border bg-notion-bg text-xs text-notion-text placeholder:text-notion-muted focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-notion-bg border border-notion-border rounded-lg px-2.5 py-1 text-xs">
              <span className="text-notion-muted font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-transparent text-notion-text outline-none cursor-pointer font-semibold"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-notion-card text-notion-text">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-notion-bg border border-notion-border rounded-lg px-2.5 py-1 text-xs">
              <span className="text-notion-muted font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="bg-transparent text-notion-text outline-none cursor-pointer font-semibold"
              >
                <option value="All" className="bg-notion-card text-notion-text">All Statuses</option>
                <option value="In Progress" className="bg-notion-card text-notion-text">In Progress</option>
                <option value="Todo" className="bg-notion-card text-notion-text">Todo</option>
                <option value="Completed" className="bg-notion-card text-notion-text">Completed</option>
                <option value="Blocked" className="bg-notion-card text-notion-text">Blocked</option>
              </select>
            </div>

            {(selectedCategory !== 'All' || selectedStatus !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-600 hover:underline px-2 py-1 font-medium cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredItems.length === 0 ? (
        <div className="py-14 text-center text-xs text-notion-muted bg-notion-card rounded-xl border border-dashed border-notion-border space-y-3">
          <p className="font-semibold text-sm text-notion-text">
            No initiatives found for {selectedClub === 'All' ? 'the selected criteria' : selectedClub}.
          </p>
          <p className="text-notion-muted max-w-sm mx-auto">
            Try adjusting your search query or add a new task to {selectedClub === 'All' ? 'GDGoC or IEEE CIS' : selectedClub}.
          </p>
          <button
            type="button"
            onClick={() => handleOpenModal(selectedClub !== 'All' ? selectedClub : 'GDGoC')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-warm-sm transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Create {selectedClub !== 'All' ? selectedClub : ''} Task</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map(item => {
            const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG['Todo'];
            const priorityClass = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG['Medium'];
            const clubBadgeStyle = getClubBadgeStyle(item.clubName);
            const isExpanded = !!expandedCards[item.id];
            const deliverables = item.deliverables || [];
            const doneDeliverables = deliverables.filter(d => d.completed).length;
            const progress = deliverables.length > 0 ? Math.round((doneDeliverables / deliverables.length) * 100) : 0;

            return (
              <div
                key={item.id}
                className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm hover:shadow-warm-hover transition-all flex flex-col justify-between gap-4"
              >
                {/* Card Top / Header */}
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-tight border ${clubBadgeStyle}`}>
                        {item.clubName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {item.category}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${priorityClass}`}>
                        {item.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleClubItemStatus(item.id)}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${statusConfig.badge}`}
                        title="Click to cycle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                        <span>{item.status}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteClubItem(item.id);
                        }}
                        className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete initiative"
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Title and Role */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-notion-text leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-notion-muted">
                      {item.role && (
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                          {item.role}
                        </span>
                      )}
                      {item.assignee && (
                        <span>
                          Lead: <strong className="text-notion-text font-medium">{item.assignee}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Context Info (Due date, budget, location) */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-notion-muted pt-1">
                    {item.dueDate && (
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar size={12} className="text-indigo-500" />
                        <span>{item.dueDate}</span>
                      </div>
                    )}
                    {item.budget && (
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} className="text-emerald-500" />
                        <span className="font-medium">{item.budget}</span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin size={12} className="text-amber-500" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes snippet */}
                  {item.notes && (
                    <p className="text-xs text-notion-muted/90 bg-notion-bg p-2.5 rounded-lg border border-notion-border line-clamp-2">
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Sub-Deliverables Checklist Section */}
                <div className="border-t border-notion-border/70 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="font-semibold text-notion-text hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Action Items & Deliverables ({doneDeliverables}/{deliverables.length})</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-notion-border">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        item.clubName === 'GDGoC' ? 'bg-blue-600' : 'bg-cyan-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Expandable Checklist */}
                  {isExpanded && (
                    <div className="space-y-1.5 pt-2 animate-fade-in">
                      {deliverables.length === 0 ? (
                        <p className="text-[11px] text-notion-muted italic">No deliverables added yet.</p>
                      ) : (
                        <div className="space-y-1">
                          {deliverables.map(del => (
                            <div
                              key={del.id}
                              onClick={() => toggleClubDeliverable(item.id, del.id)}
                              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-notion-hover/50 text-xs transition-colors cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={del.completed}
                                onChange={() => {}}
                                className="notion-checkbox cursor-pointer shrink-0"
                              />
                              <span className={`truncate text-xs ${
                                del.completed ? 'line-through text-notion-muted' : 'text-notion-text'
                              }`}>
                                {del.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Deliverable input */}
                      <div className="flex items-center gap-1.5 pt-1.5">
                        <input
                          type="text"
                          value={newDeliverableText[item.id] || ''}
                          onChange={e => setNewDeliverableText(prev => ({ ...prev, [item.id]: e.target.value }))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddDeliverable(item.id);
                            }
                          }}
                          placeholder="Add action item..."
                          className="flex-1 px-2.5 py-1 rounded-md border border-notion-border bg-notion-bg text-xs text-notion-text placeholder:text-notion-muted outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddDeliverable(item.id)}
                          className="px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium cursor-pointer shrink-0"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Structured Table View */
        <div className="bg-notion-card border border-notion-border rounded-xl shadow-warm-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-notion-border text-notion-muted uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4">Initiative & Role</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Deliverables</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-notion-border">
                {filteredItems.map(item => {
                  const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG['Todo'];
                  const priorityClass = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG['Medium'];
                  const clubBadgeStyle = getClubBadgeStyle(item.clubName);
                  const deliverables = item.deliverables || [];
                  const doneDeliverables = deliverables.filter(d => d.completed).length;

                  return (
                    <tr key={item.id} className="hover:bg-notion-hover/40 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${clubBadgeStyle}`}>
                          {item.clubName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 min-w-[220px]">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-notion-text">{item.title}</div>
                          <div className="text-[11px] text-notion-muted">
                            {item.role} • Lead: {item.assignee}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${priorityClass}`}>
                          {item.priority}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">
                            {doneDeliverables}/{deliverables.length}
                          </span>
                          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-notion-border">
                            <div
                              className={`h-full rounded-full ${
                                item.clubName === 'GDGoC' ? 'bg-blue-600' : 'bg-cyan-600'
                              }`}
                              style={{ width: `${deliverables.length > 0 ? (doneDeliverables / deliverables.length) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-notion-muted text-[11px]">
                        {item.dueDate || '—'}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleClubItemStatus(item.id)}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${statusConfig.badge}`}
                          title="Click to cycle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                          <span>{item.status}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteClubItem(item.id);
                          }}
                          className="p-1.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete initiative"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Initiative Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-notion-card border border-notion-border rounded-xl shadow-warm-modal p-6 space-y-5 animate-slide-down max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-notion-border pb-3">
              <div className="flex items-center gap-2">
                <Users2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h2 className="font-bold text-base text-notion-text">Add Club Initiative / Task</h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-notion-muted hover:text-notion-text p-1 rounded-md hover:bg-notion-hover cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateClubItem} className="space-y-4 text-xs">
              {/* Club Selector Buttons */}
              <div className="space-y-1.5">
                <label className="font-semibold text-notion-text">Select Club / Organization *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormClubName('GDGoC')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      formClubName === 'GDGoC'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-warm-xs'
                        : 'bg-notion-bg border-notion-border text-notion-muted hover:text-notion-text'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formClubName === 'GDGoC' ? 'bg-white' : 'bg-blue-500'}`} />
                    <span>GDGoC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormClubName('IEEE CIS')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      formClubName === 'IEEE CIS'
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-warm-xs'
                        : 'bg-notion-bg border-notion-border text-notion-muted hover:text-notion-text'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formClubName === 'IEEE CIS' ? 'bg-white' : 'bg-cyan-500'}`} />
                    <span>IEEE CIS</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-notion-text">Initiative / Project Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder={formClubName === 'GDGoC' ? 'e.g. Solution Challenge Hackathon Kickoff' : 'e.g. Neural Architecture Research Reading Group'}
                  className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text placeholder:text-notion-muted focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-notion-text">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Event Planning">Event Planning</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Finance & Budget">Finance & Budget</option>
                    <option value="Marketing & Outreach">Marketing & Outreach</option>
                    <option value="Logistics & Team">Logistics & Team</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-notion-text">Role / Office</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    placeholder="e.g. Lead Organizer / Technical Chair"
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text placeholder:text-notion-muted focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-notion-text">Priority</label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-notion-text">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Todo">Todo</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-notion-text">Due / Milestone Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-notion-text">Lead / Assignees</label>
                  <input
                    type="text"
                    value={formAssignee}
                    onChange={e => setFormAssignee(e.target.value)}
                    placeholder="e.g. Alex, Sarah, Self"
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text placeholder:text-notion-muted focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-notion-text">Budget (Optional)</label>
                  <input
                    type="text"
                    value={formBudget}
                    onChange={e => setFormBudget(e.target.value)}
                    placeholder="e.g. $1,200 grant"
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text placeholder:text-notion-muted focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-notion-text">Location / Platform</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={e => setFormLocation(e.target.value)}
                  placeholder="e.g. Campus Innovation Hub / ECE Room 210"
                  className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text placeholder:text-notion-muted focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Deliverables Checklist Inputs */}
              <div className="space-y-2 border-t border-notion-border pt-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-notion-text">Initial Deliverables / Checklist Items</label>
                  <button
                    type="button"
                    onClick={() => setFormDeliverableInputs(prev => [...prev, ''])}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                  >
                    + Add item
                  </button>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {formDeliverableInputs.map((inputVal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputVal}
                        onChange={e => {
                          const val = e.target.value;
                          setFormDeliverableInputs(prev => {
                            const updated = [...prev];
                            updated[index] = val;
                            return updated;
                          });
                        }}
                        placeholder={`Action item ${index + 1}...`}
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-notion-border bg-notion-bg text-xs text-notion-text placeholder:text-notion-muted outline-none focus:border-indigo-500"
                      />
                      {formDeliverableInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormDeliverableInputs(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1.5 rounded-md cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-notion-text">Notes & Context</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Key milestones, speaker links, or chapter goals..."
                  className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text placeholder:text-notion-muted focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-notion-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-notion-border bg-notion-bg hover:bg-notion-hover text-notion-muted text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-warm-sm transition-colors cursor-pointer"
                >
                  Create {formClubName} Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
