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
  X
} from 'lucide-react';
import { format } from 'date-fns';

const COLUMNS = [
  { id: 'wishlist', title: 'Wishlist', borderClass: 'border-t-[#E8D7B8] dark:border-t-[#4A3A22]', badgeColor: 'bg-[#F9F3E8] text-[#8A5B18] dark:bg-[#2B2214] dark:text-[#E5B564]' },
  { id: 'applied', title: 'Applied', borderClass: 'border-t-[#BED2E2] dark:border-t-[#243D53]', badgeColor: 'bg-[#EDF3F7] text-[#235479] dark:bg-[#162635] dark:text-[#8EB9DD]' },
  { id: 'oa', title: 'OA / Assessment', borderClass: 'border-t-[#EBCABE] dark:border-t-[#522920]', badgeColor: 'bg-[#FBF0EB] text-[#A8492C] dark:bg-[#331A14] dark:text-[#E78C72]' },
  { id: 'interview', title: 'Interview', borderClass: 'border-t-[#DECEE0] dark:border-t-[#4B2E4F]', badgeColor: 'bg-[#F5EEF6] text-[#6A3E6F] dark:bg-[#2B1B2D] dark:text-[#CB97D2]' },
  { id: 'offer', title: 'Offer', borderClass: 'border-t-[#BFDAC9] dark:border-t-[#264A35]', badgeColor: 'bg-[#EEF5F1] text-[#285B40] dark:bg-[#162B1F] dark:text-[#76B992]' },
  { id: 'rejected', title: 'Archived', borderClass: 'border-t-[#D5CFC7] dark:border-t-[#3E3A35]', badgeColor: 'bg-[#EFECE8] text-[#615C54] dark:bg-[#262320] dark:text-[#A59E95]' },
];

export default function JobsPage() {
  const { jobs, addJob, moveJobStage } = useApp();
  const navigate = useNavigate();

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

  return (
    <div className="h-full flex flex-col px-6 py-6 space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-notion-border/80 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold text-notion-text tracking-tight">
            Job & Internship Applications
          </h1>
          <p className="text-xs text-notion-muted italic">
            Kanban workflow from initial wishlist scouting to offer evaluations and interview schedules.
          </p>
        </div>

        <button
          onClick={() => openNewJobModal('wishlist')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-terracotta text-white text-xs font-semibold hover:bg-terracotta-dark transition-all shadow-warm-sm shrink-0"
        >
          <Plus size={14} />
          <span>New Application</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-notion-card border border-notion-border rounded-xl p-2.5 shadow-warm-sm text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-2.5 py-1.5 bg-notion-bg rounded-lg border border-notion-border">
          <Search size={14} className="text-terracotta shrink-0" />
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
              className="bg-transparent border border-notion-border rounded-lg px-2.5 py-1 text-xs text-notion-text font-medium outline-none cursor-pointer"
            >
              <option value="">All Tags</option>
              {allTags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1280px] h-full items-start">
          {COLUMNS.map(column => {
            const columnJobs = columnsData[column.id] || [];

            return (
              <div
                key={column.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`flex-1 min-w-[220px] max-w-[275px] bg-notion-sidebar border border-notion-border rounded-xl flex flex-col max-h-[calc(100vh-210px)] border-t-3 ${column.borderClass} shadow-warm-sm`}
              >
                {/* Column Header */}
                <div className="p-3 flex items-center justify-between border-b border-notion-border/70">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-notion-text font-display">{column.title}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold ${column.badgeColor}`}>
                      {columnJobs.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openNewJobModal(column.id)}
                    className="p-1 rounded text-notion-muted hover:text-terracotta transition-colors"
                    title={`Add card to ${column.title}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
                  {columnJobs.length === 0 ? (
                    <div className="py-10 text-center text-xs text-notion-muted border border-dashed border-notion-border rounded-lg m-1 italic">
                      No cards
                    </div>
                  ) : (
                    columnJobs.map(job => (
                      <div
                        key={job.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, job.id)}
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="group bg-notion-card border border-notion-border hover:border-terracotta/70 rounded-lg p-3 shadow-warm-sm hover:shadow-warm-hover transition-all cursor-pointer space-y-2 select-none"
                      >
                        {/* Company & Initial Icon */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded bg-terracotta/10 text-terracotta font-display font-bold text-xs flex items-center justify-center shrink-0 border border-terracotta/20">
                              {job.company.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-xs text-notion-text truncate group-hover:text-terracotta transition-colors font-display">
                              {job.company}
                            </span>
                          </div>

                          {job.jobUrl && (
                            <a
                              href={job.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-notion-muted hover:text-terracotta p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Open posting link"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>

                        {/* Role Title */}
                        <div className="text-xs text-notion-muted line-clamp-2 italic leading-tight">
                          {job.role}
                        </div>

                        {/* Salary or Location */}
                        {(job.salary || job.location) && (
                          <div className="text-[11px] text-notion-muted flex items-center gap-1 truncate font-mono">
                            {job.salary ? (
                              <>
                                <DollarSign size={11} className="shrink-0 text-forest" />
                                <span className="truncate">{job.salary}</span>
                              </>
                            ) : (
                              <>
                                <MapPin size={11} className="shrink-0" />
                                <span className="truncate font-sans">{job.location}</span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Interview Date tag */}
                        {job.interviewDate && (
                          <div className="text-[11px] px-1.5 py-0.5 rounded bg-[#F5EEF6] text-[#6A3E6F] dark:bg-[#2B1B2D] dark:text-[#CB97D2] font-mono font-semibold flex items-center gap-1 border border-[#DECEE0] dark:border-[#4B2E4F]">
                            <Clock size={11} />
                            <span>{job.interviewDate.replace('T', ' ')}</span>
                          </div>
                        )}

                        {/* Card Footer */}
                        <div className="pt-1.5 border-t border-notion-border/50 flex items-center justify-between text-[10px] text-notion-muted">
                          <span className="font-mono">{job.dateApplied ? `Applied ${job.dateApplied}` : 'Wishlist'}</span>
                          <span className="text-terracotta font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                            Detail <ChevronRight size={11} />
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

      {/* New Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-notion-card border border-notion-border rounded-xl shadow-warm-modal p-6 space-y-4 animate-slide-down">
            <div className="flex items-center justify-between border-b border-notion-border pb-3">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-terracotta" />
                <h2 className="font-display font-semibold text-base text-notion-text">Add Job Application</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-notion-muted hover:text-notion-text p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-notion-muted font-medium">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OpenAI, Stripe, Figma"
                    value={formCompany}
                    onChange={e => setFormCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-notion-muted font-medium">Role / Position *</label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-notion-muted font-medium">Stage</label>
                  <select
                    value={formStage}
                    onChange={e => setFormStage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta cursor-pointer"
                  >
                    {COLUMNS.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-notion-muted font-medium">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA (Hybrid)"
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-notion-muted font-medium">Compensation / Rate</label>
                  <input
                    type="text"
                    placeholder="e.g. $60 / hr + Housing"
                    value={formSalary}
                    onChange={e => setFormSalary(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-notion-muted font-medium">Resume Version</label>
                  <input
                    type="text"
                    value={formResumeVersion}
                    onChange={e => setFormResumeVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-notion-muted font-medium">Job Posting URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formJobUrl}
                  onChange={e => setFormJobUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta"
                />
              </div>

              <div className="space-y-1">
                <label className="text-notion-muted font-medium">Initial Notes</label>
                <textarea
                  rows={2}
                  placeholder="Requirements or interview focus areas..."
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-notion-border text-notion-text hover:bg-notion-hover font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-terracotta text-white font-medium hover:bg-terracotta-dark transition-colors shadow-warm-sm"
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
