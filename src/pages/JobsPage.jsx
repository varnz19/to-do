import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  Calendar,
  ExternalLink,
  ChevronRight,
  MapPin,
  DollarSign,
  Building2,
  Clock,
  X,
  Trash2,
  LayoutGrid,
  List,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

const COLUMNS = [
  { id: 'wishlist', title: 'Wishlist', borderClass: 'border-t-amber-500', badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800' },
  { id: 'applied', title: 'Applied', borderClass: 'border-t-sky-500', badgeColor: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800' },
  { id: 'oa', title: 'OA / Assessment', borderClass: 'border-t-orange-500', badgeColor: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-800' },
  { id: 'interview', title: 'Interview', borderClass: 'border-t-purple-500', badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800' },
  { id: 'offer', title: 'Offer', borderClass: 'border-t-emerald-500', badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  { id: 'rejected', title: 'Archived', borderClass: 'border-t-slate-400', badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700' },
];

export default function JobsPage() {
  const { jobs, addJob, moveJobStage, deleteJob } = useApp();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('board'); // 'board' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [draggedJobId, setDraggedJobId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDefaultStage, setModalDefaultStage] = useState('wishlist');

  // New Job Form State
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('Software Engineering Intern');
  const [formStage, setFormStage] = useState('wishlist');
  const [formLocation, setFormLocation] = useState('Remote / Hybrid');
  const [formSalary, setFormSalary] = useState('');
  const [formJobUrl, setFormJobUrl] = useState('');
  const [formResumeVersion, setFormResumeVersion] = useState('Resume_SWE_2026.pdf');
  const [formNotes, setFormNotes] = useState('');

  const allTags = useMemo(() => {
    const set = new Set();
    jobs.forEach(j => (j.tags || []).forEach(t => set.add(t)));
    return Array.from(set);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          job.company.toLowerCase().includes(q) ||
          job.role.toLowerCase().includes(q) ||
          (job.tags && job.tags.some(t => t.toLowerCase().includes(q)));
        if (!match) return false;
      }
      if (selectedTag && (!job.tags || !job.tags.includes(selectedTag))) {
        return false;
      }
      return true;
    });
  }, [jobs, searchQuery, selectedTag]);

  const columnsData = useMemo(() => {
    const map = {};
    COLUMNS.forEach(col => {
      map[col.id] = [];
    });
    filteredJobs.forEach(job => {
      if (map[job.stage]) {
        map[job.stage].push(job);
      } else {
        map['wishlist'].push(job);
      }
    });
    return map;
  }, [filteredJobs]);

  // Funnel counts
  const stats = useMemo(() => {
    return {
      total: jobs.length,
      interviews: jobs.filter(j => j.stage === 'interview').length,
      offers: jobs.filter(j => j.stage === 'offer').length,
      assessments: jobs.filter(j => j.stage === 'oa').length,
    };
  }, [jobs]);

  const handleDragStart = (e, id) => {
    setDraggedJobId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedJobId;
    if (id) {
      moveJobStage(id, targetStage);
    }
    setDraggedJobId(null);
  };

  const openNewJobModal = (stage = 'wishlist') => {
    setModalDefaultStage(stage);
    setFormStage(stage);
    setFormCompany('');
    setFormRole('Software Engineering Intern');
    setFormLocation('Remote / Hybrid');
    setFormSalary('');
    setFormJobUrl('');
    setFormNotes('');
    setModalOpen(true);
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!formCompany.trim()) return;

    const newJob = addJob({
      company: formCompany.trim(),
      role: formRole.trim(),
      stage: formStage,
      location: formLocation.trim(),
      salary: formSalary.trim(),
      jobUrl: formJobUrl.trim(),
      resumeVersion: formResumeVersion.trim(),
      notes: formNotes.trim(),
      tags: ['SWE', formLocation.includes('Remote') ? 'Remote' : 'Onsite']
    });

    setModalOpen(false);
    navigate(`/jobs/${newJob.id}`);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return null;
    try {
      const cleanStr = dateString.replace(/T(\d{2}:\d{2}).*/, 'T$1');
      const d = new Date(cleanStr);
      if (isNaN(d.getTime())) return dateString;
      return format(d, 'MMM d, h:mm a');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="h-full flex flex-col px-6 py-6 space-y-5 animate-fade-in">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-notion-border/80 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-notion-text tracking-tight">
            Job & Internship Tracker
          </h1>
          <p className="text-xs text-notion-muted">
            Track recruitment workflows from scouting and technical evaluations to final offers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-0.5 rounded-lg border border-notion-border bg-slate-100 dark:bg-slate-800 text-xs shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-notion-muted hover:text-notion-text'
              }`}
            >
              <LayoutGrid size={14} />
              <span>Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-notion-muted hover:text-notion-text'
              }`}
            >
              <List size={14} />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => openNewJobModal('wishlist')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-sm shrink-0"
          >
            <Plus size={14} />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-notion-border bg-notion-card shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-notion-muted">Active Pipeline</div>
            <div className="text-xl font-bold text-notion-text">{stats.total}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <Briefcase size={16} />
          </div>
        </div>

        <div className="p-3 rounded-xl border border-notion-border bg-notion-card shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Interviews</div>
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{stats.interviews}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center border border-purple-200 dark:border-purple-800">
            <Clock size={16} />
          </div>
        </div>

        <div className="p-3 rounded-xl border border-notion-border bg-notion-card shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Offers</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.offers}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="p-3 rounded-xl border border-notion-border bg-notion-card shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Assessments</div>
            <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{stats.assessments}</div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-orange-600 flex items-center justify-center border border-orange-200 dark:border-orange-800">
            <Building2 size={16} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-notion-card border border-notion-border rounded-xl p-2.5 shadow-sm text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-notion-border">
          <Search size={14} className="text-indigo-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search company, role or keywords..."
            className="w-full bg-transparent text-xs text-notion-text placeholder:text-notion-muted outline-none font-medium"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-notion-muted" />
            <select
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
              className="bg-transparent border border-notion-border rounded-lg px-2.5 py-1.5 text-xs text-notion-text font-medium outline-none cursor-pointer"
            >
              <option value="">All Tags</option>
              {allTags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: KANBAN BOARD */}
      {viewMode === 'board' ? (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1240px] h-full items-start">
            {COLUMNS.map(column => {
              const columnJobs = columnsData[column.id] || [];

              return (
                <div
                  key={column.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className={`flex-1 min-w-[220px] max-w-[275px] bg-slate-50/80 dark:bg-slate-900/60 border border-notion-border rounded-xl flex flex-col max-h-[calc(100vh-250px)] border-t-4 ${column.borderClass} shadow-sm`}
                >
                  {/* Column Header */}
                  <div className="p-3 flex items-center justify-between border-b border-notion-border/70 bg-white/70 dark:bg-slate-900/80 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-notion-text">{column.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${column.badgeColor}`}>
                        {columnJobs.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openNewJobModal(column.id)}
                      className="p-1 rounded text-notion-muted hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      title={`Add card to ${column.title}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                    {columnJobs.length === 0 ? (
                      <div className="py-12 text-center text-xs text-notion-muted border border-dashed border-slate-200 dark:border-slate-800 rounded-lg m-1">
                        No applications
                      </div>
                    ) : (
                      columnJobs.map(job => (
                        <div
                          key={job.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, job.id)}
                          onClick={() => navigate(`/jobs/${job.id}`)}
                          className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2.5 select-none relative"
                        >
                          {/* Top Row: Avatar, Company, Quick Actions */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                                {job.company.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-notion-text truncate block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {job.company}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {job.jobUrl && (
                                <a
                                  href={job.jobUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                  title="Open posting link"
                                >
                                  <ExternalLink size={12} />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteJob(job.id);
                                }}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Delete application"
                                aria-label={`Delete ${job.company}`}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Role Title */}
                          <div className="text-xs font-medium text-notion-text/90 line-clamp-2 leading-tight">
                            {job.role}
                          </div>

                          {/* Salary and Location Pills */}
                          {(job.salary || job.location) && (
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-notion-muted font-mono">
                              {job.salary && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  <DollarSign size={10} className="shrink-0" />
                                  <span className="truncate">{job.salary}</span>
                                </span>
                              )}
                              {job.location && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-sans">
                                  <MapPin size={10} className="shrink-0" />
                                  <span className="truncate max-w-[130px]">{job.location}</span>
                                </span>
                              )}
                            </div>
                          )}

                          {/* Interview Date pill */}
                          {job.interviewDate && (
                            <div className="text-[11px] px-2 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 font-mono font-semibold flex items-center gap-1.5 border border-purple-200 dark:border-purple-800">
                              <Clock size={11} className="shrink-0" />
                              <span className="truncate">{formatDisplayDate(job.interviewDate)}</span>
                            </div>
                          )}

                          {/* Card Footer: Quick Move Dropdown */}
                          <div className="pt-1 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px]">
                            <select
                              value={job.stage}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                moveJobStage(job.id, e.target.value);
                              }}
                              className="bg-slate-100 dark:bg-slate-700 text-notion-muted hover:text-notion-text font-medium px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 outline-none cursor-pointer"
                              title="Change stage"
                            >
                              {COLUMNS.map(col => (
                                <option key={col.id} value={col.id}>Move: {col.title}</option>
                              ))}
                            </select>

                            <span className="text-slate-400 group-hover:text-indigo-600 flex items-center gap-0.5 font-medium">
                              <span>Detail</span>
                              <ChevronRight size={11} />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: TABLE LIST VIEW */
        <div className="bg-notion-card border border-notion-border rounded-xl shadow-sm overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-notion-border bg-slate-50 dark:bg-slate-900 text-notion-muted font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date Applied</th>
                  <th className="py-3 px-4">Interview / Event</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-notion-border">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-xs text-notion-muted">
                      No applications found. Adjust filters or click "New Application".
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map(job => {
                    const col = COLUMNS.find(c => c.id === job.stage) || COLUMNS[0];
                    return (
                      <tr
                        key={job.id}
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                              {job.company.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-notion-text">{job.company}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-notion-text max-w-[220px] truncate">
                          {job.role}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={job.stage}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              moveJobStage(job.id, e.target.value);
                            }}
                            className={`px-2 py-0.5 rounded-full font-semibold text-[10px] font-mono cursor-pointer border outline-none ${col.badgeColor}`}
                          >
                            {COLUMNS.map(c => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                          {job.salary || '—'}
                        </td>

                        <td className="py-3.5 px-4 text-notion-muted">
                          {job.location || '—'}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-notion-muted">
                          {job.dateApplied || 'Wishlist'}
                        </td>

                        <td className="py-3.5 px-4">
                          {job.interviewDate ? (
                            <span className="inline-flex items-center gap-1 font-mono font-semibold text-purple-600 dark:text-purple-400">
                              <Clock size={11} />
                              {formatDisplayDate(job.interviewDate)}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {job.jobUrl && (
                              <a
                                href={job.jobUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Open link"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteJob(job.id);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete application"
                              aria-label={`Delete ${job.company}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-notion-border rounded-2xl shadow-warm-modal p-6 space-y-4 animate-slide-down">
            <div className="flex items-center justify-between border-b border-notion-border pb-3">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-indigo-600" />
                <h3 className="font-bold text-base text-notion-text">New Job Application</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-notion-muted hover:text-notion-text p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-notion-text">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={e => setFormCompany(e.target.value)}
                    placeholder="e.g. Stripe, Figma, Apple"
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-slate-50 dark:bg-slate-800 text-notion-text outline-none font-medium focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-notion-text">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    placeholder="e.g. SWE Intern"
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-slate-50 dark:bg-slate-800 text-notion-text outline-none font-medium focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-notion-text">Recruitment Stage</label>
                  <select
                    value={formStage}
                    onChange={e => setFormStage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-slate-50 dark:bg-slate-800 text-notion-text outline-none font-medium cursor-pointer focus:border-indigo-500"
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-notion-text">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    placeholder="e.g. San Francisco / Remote"
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-slate-50 dark:bg-slate-800 text-notion-text outline-none font-medium focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-notion-text">Salary / Compensation</label>
                  <input
                    type="text"
                    value={formSalary}
                    onChange={e => setFormSalary(e.target.value)}
                    placeholder="e.g. $55 / hr"
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-slate-50 dark:bg-slate-800 text-notion-text outline-none font-medium focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-notion-text">Posting URL</label>
                  <input
                    type="url"
                    value={formJobUrl}
                    onChange={e => setFormJobUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-slate-50 dark:bg-slate-800 text-notion-text outline-none font-medium focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-notion-text">Notes & Timeline</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Key requirements, referral info, interview steps..."
                  className="w-full px-3 py-2 rounded-lg border border-notion-border bg-slate-50 dark:bg-slate-800 text-notion-text outline-none font-medium resize-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-notion-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-notion-border hover:bg-slate-100 dark:hover:bg-slate-800 text-notion-muted font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                >
                  Create Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
