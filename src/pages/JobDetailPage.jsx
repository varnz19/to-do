import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  FileText,
  User,
  Mail,
  Globe,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

const STAGES = [
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'applied', label: 'Applied' },
  { id: 'oa', label: 'OA / Assessment' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'rejected', label: 'Archived / Rejected' }
];

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    jobs,
    tasks,
    updateJob,
    moveJobStage,
    deleteJob,
    addTask,
    toggleTask,
    addJobTimelineEvent,
    addToast
  } = useApp();

  const job = jobs.find(j => j.id === id);

  const [newTimelineNote, setNewTimelineNote] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [notesEditing, setNotesEditing] = useState(false);
  const [notesContent, setNotesContent] = useState('');

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="font-display text-lg font-semibold text-notion-text">Application Not Found</h2>
        <p className="text-xs text-notion-muted italic">The requested job application record does not exist or was removed.</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-terracotta text-white text-xs font-semibold shadow-warm-sm"
        >
          <ArrowLeft size={14} /> Back to Job Tracker
        </Link>
      </div>
    );
  }

  const linkedTasks = tasks.filter(t => t.jobId === job.id);

  const handleStageChange = (newStage) => {
    moveJobStage(job.id, newStage);
  };

  const handleAddTimelineNote = (e) => {
    e.preventDefault();
    if (!newTimelineNote.trim()) return;
    addJobTimelineEvent(job.id, newTimelineNote.trim(), job.stage);
    setNewTimelineNote('');
    addToast('Timeline event recorded', 'success');
  };

  const handleAddLinkedTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      jobId: job.id,
      priority: 'high'
    });
    setNewTaskTitle('');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${job.company} (${job.role})?`)) {
      deleteJob(job.id);
      navigate('/jobs');
    }
  };

  const handleSaveNotes = () => {
    updateJob(job.id, { notes: notesContent });
    setNotesEditing(false);
    addToast('Notes saved', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* Navigation breadcrumb & actions */}
      <div className="flex items-center justify-between border-b border-notion-border/80 pb-3">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-1.5 text-xs text-notion-muted hover:text-notion-text px-2.5 py-1 rounded-md hover:bg-notion-hover transition-colors font-medium"
        >
          <ArrowLeft size={14} />
          <span>Back to Kanban Board</span>
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium transition-colors"
          title="Delete application"
        >
          <Trash2 size={14} />
          <span>Delete Application</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-6 shadow-warm-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-terracotta/10 text-terracotta font-display font-bold text-xl flex items-center justify-center shrink-0 border border-terracotta/20">
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1 min-w-0">
              <h1 className="text-2xl font-display font-semibold text-notion-text leading-tight">{job.company}</h1>
              <p className="text-xs text-notion-muted italic">{job.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-notion-muted font-bold">Stage:</span>
            <select
              value={job.stage}
              onChange={(e) => handleStageChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-notion-border bg-notion-bg text-notion-text font-semibold text-xs outline-none cursor-pointer focus:border-terracotta"
            >
              {STAGES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-notion-border/60 text-xs">
          <div className="p-2.5 rounded-lg bg-notion-bg border border-notion-border space-y-1">
            <span className="text-notion-muted font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <MapPin size={12} className="text-terracotta" /> Location
            </span>
            <div className="text-notion-text font-medium truncate">{job.location || 'Not specified'}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-notion-bg border border-notion-border space-y-1">
            <span className="text-notion-muted font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <DollarSign size={12} className="text-forest" /> Salary / Rate
            </span>
            <div className="text-notion-text font-medium font-mono truncate">{job.salary || 'Undisclosed'}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-notion-bg border border-notion-border space-y-1">
            <span className="text-notion-muted font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Calendar size={12} className="text-[#235479] dark:text-[#8EB9DD]" /> Date Applied
            </span>
            <div className="text-notion-text font-medium font-mono">{job.dateApplied || 'Wishlist'}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-notion-bg border border-notion-border space-y-1">
            <span className="text-notion-muted font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <FileText size={12} className="text-terracotta" /> Attached Resume
            </span>
            <div className="text-terracotta font-medium truncate italic" title={job.resumeVersion}>
              {job.resumeVersion || 'Default'}
            </div>
          </div>
        </div>

        {/* Links & Interviews Bar */}
        {(job.jobUrl || job.interviewDate || job.followUpDate) && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-notion-border/60 text-xs">
            {job.jobUrl && (
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-notion-hover text-notion-text hover:bg-terracotta hover:text-white transition-colors"
              >
                <ExternalLink size={12} />
                <span>Job Posting Link</span>
              </a>
            )}

            {job.interviewDate && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F5EEF6] text-[#6A3E6F] dark:bg-[#2B1B2D] dark:text-[#CB97D2] font-mono font-semibold border border-[#DECEE0] dark:border-[#4B2E4F]">
                <Clock size={12} />
                <span>Interview: {job.interviewDate.replace('T', ' ')}</span>
              </div>
            )}

            {job.followUpDate && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F9F3E8] text-[#8A5B18] dark:bg-[#2B2214] dark:text-[#E5B564] font-mono font-semibold border border-[#E8D7B8] dark:border-[#4A3A22]">
                <AlertCircle size={12} />
                <span>Follow up by: {job.followUpDate}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-notion-border/60 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-terracotta" />
                <h3 className="font-semibold text-sm text-notion-text">Linked Action Items</h3>
              </div>
              <span className="text-notion-muted font-mono">{linkedTasks.length} tasks</span>
            </div>

            <form onSubmit={handleAddLinkedTask} className="flex items-center gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="Add task linked to this application..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-notion-border bg-notion-bg text-notion-text outline-none focus:border-terracotta font-medium"
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="px-3 py-1.5 rounded-lg bg-notion-hover hover:bg-terracotta hover:text-white text-notion-text text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                + Add
              </button>
            </form>

            {linkedTasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-notion-muted italic">
                No tasks linked yet. Create follow-up tasks or interview prep reminders above.
              </div>
            ) : (
              <div className="space-y-1 divide-y divide-notion-border/50">
                {linkedTasks.map(task => (
                  <div key={task.id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="notion-checkbox"
                      />
                      <span className={`truncate ${task.completed ? 'line-through text-notion-muted' : 'text-notion-text'}`}>
                        {task.title}
                      </span>
                    </div>
                    {task.dueDate && (
                      <span className="text-[11px] font-mono text-notion-muted ml-2">
                        {task.dueDate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-notion-border/60">
              <h3 className="text-sm font-semibold text-notion-text">Job Description & Notes</h3>
              {!notesEditing ? (
                <button
                  onClick={() => {
                    setNotesContent(job.notes || '');
                    setNotesEditing(true);
                  }}
                  className="text-xs text-terracotta hover:underline font-semibold"
                >
                  Edit Notes
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNotesEditing(false)}
                    className="text-xs text-notion-muted hover:text-notion-text px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="flex items-center gap-1 text-xs bg-terracotta text-white px-2.5 py-1 rounded font-semibold shadow-warm-sm"
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              )}
            </div>

            {notesEditing ? (
              <textarea
                rows={8}
                value={notesContent}
                onChange={e => setNotesContent(e.target.value)}
                placeholder="Paste job description, requirements, interview tips..."
                className="w-full p-3 rounded-lg border border-notion-border bg-notion-bg text-notion-text text-xs outline-none focus:border-terracotta font-mono"
              />
            ) : (
              <div className="text-xs text-notion-text leading-relaxed whitespace-pre-wrap bg-notion-bg p-3 rounded-lg border border-notion-border">
                {job.notes || 'No custom notes provided. Click "Edit Notes" to add details, interview prep items, or salary negotiation notes.'}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {job.recruiter && (job.recruiter.name || job.recruiter.email) && (
            <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-notion-text pb-1 border-b border-notion-border/60">
                <User size={14} className="text-terracotta" />
                <span>Recruiter / Point of Contact</span>
              </div>
              {job.recruiter.name && (
                <div className="font-semibold text-notion-text">{job.recruiter.name}</div>
              )}
              {job.recruiter.email && (
                <a
                  href={`mailto:${job.recruiter.email}`}
                  className="flex items-center gap-1.5 text-notion-muted hover:text-terracotta truncate"
                >
                  <Mail size={12} />
                  <span>{job.recruiter.email}</span>
                </a>
              )}
              {job.recruiter.linkedin && (
                <a
                  href={job.recruiter.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-terracotta hover:underline truncate font-semibold"
                >
                  <Globe size={12} />
                  <span>LinkedIn Profile</span>
                </a>
              )}
            </div>
          )}

          <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-notion-border/60">
              <Clock size={15} className="text-terracotta" />
              <h3 className="text-sm font-semibold text-notion-text">Application Timeline</h3>
            </div>

            <form onSubmit={handleAddTimelineNote} className="space-y-2">
              <input
                type="text"
                value={newTimelineNote}
                onChange={e => setNewTimelineNote(e.target.value)}
                placeholder="Log an update (e.g. 'Passed technical screen')..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-notion-border bg-notion-bg text-notion-text outline-none focus:border-terracotta font-medium"
              />
              <button
                type="submit"
                disabled={!newTimelineNote.trim()}
                className="w-full py-1.5 rounded-lg bg-notion-hover hover:bg-terracotta hover:text-white text-notion-text text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                + Add Update to Timeline
              </button>
            </form>

            <div className="relative pl-5 space-y-4 border-l-2 border-terracotta/40">
              {(job.timeline || []).map((tl, i) => (
                <div key={tl.id || i} className="relative text-xs space-y-0.5">
                  <span className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-terracotta border-2 border-notion-card" />
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-terracotta uppercase tracking-wider text-[10px]">
                      {tl.stage}
                    </span>
                    <span className="text-[10px] text-notion-muted font-mono">
                      {format(new Date(tl.timestamp), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-notion-muted leading-relaxed italic text-[11px]">{tl.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
