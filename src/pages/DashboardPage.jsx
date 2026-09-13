import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import QuickAddBar from '../components/common/QuickAddBar';
import {
  Flame,
  CheckCircle2,
  Send,
  Calendar,
  Clock,
  Briefcase,
  AlertTriangle,
  ChevronRight,
  Code2,
  Terminal,
  Target
} from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const {
    tasks,
    codingChallenges,
    jobs,
    activityLog,
    stats,
    toggleTask
  } = useApp();

  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const urgentOrTodayTasks = tasks.filter(t => !t.completed && (t.dueDate === todayStr || (t.dueDate && t.dueDate < todayStr)));
  const todayCompletedCount = tasks.filter(t => t.completed && t.completedAt && t.completedAt.startsWith(todayStr)).length;
  const todayTotalRelevant = urgentOrTodayTasks.length + todayCompletedCount;
  const progressPercent = todayTotalRelevant > 0 ? Math.round((todayCompletedCount / todayTotalRelevant) * 100) : 0;

  const upcomingTasks = tasks.filter(t => !t.completed && t.dueDate && t.dueDate > todayStr).slice(0, 4);
  const upcomingInterviews = jobs.filter(j => j.stage === 'interview' || j.interviewDate).slice(0, 4);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      {/* Editorial Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-notion-border/80 pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold text-notion-text tracking-tight">
            Daily Studio & Overview
          </h1>
          <p className="text-xs text-notion-muted">
            Consolidated view of priority deadlines, active coding sprints, and recruitment milestones.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-notion-muted">
          <span>{format(new Date(), 'EEEE, MMMM d')}</span>
        </div>
      </div>

      {/* Quick Add Bar */}
      <QuickAddBar />

      {/* Vibrant Modern Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm hover:shadow-warm-hover transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-notion-muted">Current Streak</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
              <Flame size={15} />
            </div>
          </div>
          <div className="text-3xl font-bold text-notion-text flex items-baseline gap-1.5">
            <span>{stats.currentStreak}</span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">days active</span>
          </div>
          <p className="text-[11px] text-notion-muted">Daily momentum record</p>
        </div>

        {/* Tasks Completed This Week */}
        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm hover:shadow-warm-hover transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-notion-muted">Done This Week</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div className="text-3xl font-bold text-notion-text flex items-baseline gap-1.5">
            <span>{stats.completedThisWeek}</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">tasks done</span>
          </div>
          <p className="text-[11px] text-notion-muted">Weekly sprint velocity</p>
        </div>

        {/* Applications Sent */}
        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm hover:shadow-warm-hover transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-notion-muted">Applied (Month)</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center border border-sky-500/20">
              <Send size={14} />
            </div>
          </div>
          <div className="text-3xl font-bold text-notion-text flex items-baseline gap-1.5">
            <span>{stats.appliedThisMonth}</span>
            <span className="text-xs font-medium text-sky-600 dark:text-sky-400">sent</span>
          </div>
          <p className="text-[11px] text-notion-muted">Active career pipeline</p>
        </div>

        {/* Coding & DSA Challenges Solved */}
        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm hover:shadow-warm-hover transition-all space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-notion-muted">Coding Practice</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
              <Code2 size={15} />
            </div>
          </div>
          <div className="text-3xl font-bold text-notion-text flex items-baseline gap-1.5">
            <span>{stats.solvedChallenges}</span>
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">of {stats.totalChallenges} solved</span>
          </div>
          <p className="text-[11px] text-notion-muted">DSA & system blueprints</p>
        </div>
      </div>

      {/* Today's Focus Progress Bar */}
      {todayTotalRelevant > 0 && (
        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-notion-text">Today's Goal Momentum</span>
            <p className="text-notion-muted text-[11px]">
              {todayCompletedCount} of {todayTotalRelevant} priority items checked off
            </p>
          </div>
          <div className="flex items-center gap-3 sm:w-60">
            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 border border-notion-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-xs">{progressPercent}%</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Today's Tasks */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-notion-border/70">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-notion-text">Today's Priority Agenda</h2>
                {urgentOrTodayTasks.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#F9F3E8] text-[#8A5B18] dark:bg-[#2B2214] dark:text-[#E5B564] border border-[#E8D7B8] dark:border-[#4A3A22]">
                    {urgentOrTodayTasks.length} pending
                  </span>
                )}
              </div>
              <Link
                to="/tasks"
                className="text-xs text-terracotta hover:underline font-medium flex items-center gap-0.5"
              >
                <span>View all</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            {urgentOrTodayTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-notion-muted bg-notion-bg/60 rounded-lg border border-dashed border-notion-border space-y-1">
                <p className="font-medium text-notion-text">No pending tasks for today.</p>
                <Link to="/tasks" className="text-terracotta hover:underline font-semibold block pt-1">
                  View backlog or create task →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-notion-border/50">
                {urgentOrTodayTasks.map(task => {
                  const isOverdue = task.dueDate && task.dueDate < todayStr;
                  return (
                    <div
                      key={task.id}
                      className="py-2.5 flex items-center justify-between gap-3 group text-xs hover:bg-notion-hover/30 px-1.5 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="notion-checkbox"
                          aria-label={`Mark "${task.title}" as completed`}
                        />
                        <span className="text-notion-text font-normal truncate group-hover:text-terracotta transition-colors">
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-[11px]">
                        {task.jobId && (
                          <span className="px-1.5 py-0.5 rounded bg-[#EDF3F7] text-[#235479] dark:bg-[#162635] dark:text-[#8EB9DD] font-medium">
                            Linked
                          </span>
                        )}
                        {isOverdue ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#FBF0EB] text-[#A8492C] dark:bg-[#331A14] dark:text-[#E78C72] font-semibold border border-[#EBCABE] dark:border-[#522920]">
                            Overdue
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-[#F9F3E8] text-[#8A5B18] dark:bg-[#2B2214] dark:text-[#E5B564] font-semibold border border-[#E8D7B8] dark:border-[#4A3A22]">
                            Today
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming tasks peek */}
          {upcomingTasks.length > 0 && (
            <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-notion-border/70 text-xs">
                <span className="font-semibold text-notion-text">Upcoming Deadlines</span>
                <span className="text-notion-muted">Next 7 days</span>
              </div>
              <div className="divide-y divide-notion-border/50 text-xs">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="notion-checkbox"
                        aria-label={`Mark "${task.title}" as completed`}
                      />
                      <span className="text-notion-text truncate">{task.title}</span>
                    </div>
                    <span className="font-mono text-[11px] text-notion-muted ml-2 shrink-0">
                      {task.dueDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Interview Radar & Activity Feed */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-notion-border/70 text-xs">
              <span className="font-semibold text-notion-text">Interview Pipeline</span>
              <Link
                to="/jobs"
                className="text-terracotta hover:underline font-medium flex items-center gap-0.5"
              >
                <span>Kanban</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div className="py-5 text-center text-xs text-notion-muted bg-notion-bg/60 rounded-lg border border-dashed border-notion-border">
                No active interviews currently. Continue submitting applications.
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingInterviews.map(job => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="p-3 rounded-lg border border-notion-border hover:border-terracotta/60 hover:bg-notion-hover/40 transition-all cursor-pointer space-y-1 text-xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-notion-text group-hover:text-terracotta transition-colors">
                        {job.company}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-[#F5EEF6] text-[#6A3E6F] dark:bg-[#2B1B2D] dark:text-[#CB97D2] border border-[#DECEE0] dark:border-[#4B2E4F]">
                        {job.stage}
                      </span>
                    </div>
                    <div className="text-notion-muted truncate text-[11px]">{job.role}</div>
                    {job.interviewDate && (
                      <div className="text-terracotta flex items-center gap-1 font-mono text-[11px] pt-1">
                        <Clock size={11} />
                        <span>{job.interviewDate.replace('T', ' at ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-3">
            <span className="text-xs font-semibold text-notion-text block pb-1 border-b border-notion-border/70">
              Chronological Activity Log
            </span>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {activityLog.length === 0 ? (
                <div className="text-xs text-notion-muted py-3">No activity recorded yet.</div>
              ) : (
                activityLog.slice(0, 6).map(item => (
                  <div key={item.id} className="text-xs space-y-0.5 border-l-2 border-terracotta/60 pl-2.5 py-0.5">
                    <div className="font-medium text-notion-text leading-tight">{item.title}</div>
                    {item.details && <div className="text-[11px] text-notion-muted">{item.details}</div>}
                    <div className="text-[10px] text-notion-muted font-mono">
                      {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
