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
  Target,
  ArrowRight,
  CheckSquare,
  Sparkles,
  ExternalLink,
  Users2
} from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const {
    tasks,
    codingChallenges,
    clubWork,
    jobs,
    activityLog,
    stats,
    userName = 'Varnzz',
    toggleTask
  } = useApp();

  const navigate = useNavigate();

  const activeClubInitiatives = (clubWork || []).filter(c => c.status !== 'Completed');

  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const greeting = `${timeGreeting}, ${userName}`;

  const todayStr = new Date().toISOString().split('T')[0];
  const urgentOrTodayTasks = tasks.filter(t => !t.completed && (t.dueDate === todayStr || (t.dueDate && t.dueDate < todayStr)));
  const todayCompletedCount = tasks.filter(t => t.completed && t.completedAt && t.completedAt.startsWith(todayStr)).length;
  const todayTotalRelevant = urgentOrTodayTasks.length + todayCompletedCount;
  const progressPercent = todayTotalRelevant > 0 ? Math.round((todayCompletedCount / todayTotalRelevant) * 100) : 0;

  const upcomingTasks = tasks.filter(t => !t.completed && t.dueDate && t.dueDate > todayStr).slice(0, 4);
  const upcomingInterviews = jobs.filter(j => j.stage === 'interview' || j.interviewDate).slice(0, 4);

  const nextChallenge = (codingChallenges || []).find(c => c.status !== 'Solved') || (codingChallenges || [])[0];

  const stageCounts = {
    wishlist: jobs.filter(j => j.stage === 'wishlist').length,
    applied: jobs.filter(j => j.stage === 'applied').length,
    oa: jobs.filter(j => j.stage === 'oa').length,
    interview: jobs.filter(j => j.stage === 'interview').length,
    offer: jobs.filter(j => j.stage === 'offer').length,
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
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-7 animate-fade-in">
      {/* Clean Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-notion-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-notion-text tracking-tight">
              {greeting}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Active Focus
            </span>
          </div>
          <p className="text-xs text-notion-muted">
            Here is your daily operational briefing across tasks, career applications, and coding practice.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-lg border border-notion-border bg-notion-card text-xs font-mono text-notion-muted flex items-center gap-2 shadow-warm-xs">
            <Calendar size={13} className="text-indigo-600 dark:text-indigo-400" />
            <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
          </div>
        </div>
      </div>

      {/* Quick Add Bar */}
      <QuickAddBar />

      {/* Four Sleek Primary Metric Cards */}
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
          <p className="text-[11px] text-notion-muted">Active recruitment pipeline</p>
        </div>

        {/* Coding Challenges Solved */}
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

      {/* Recruitment Pipeline Pulse Bar */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-notion-text flex items-center gap-1.5">
            <Briefcase size={14} className="text-indigo-600 dark:text-indigo-400" />
            Recruitment Funnel Status
          </span>
          <Link
            to="/jobs"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-0.5"
          >
            <span>Open Tracker</span>
            <ChevronRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          <Link
            to="/jobs"
            className="p-2.5 rounded-lg border border-amber-200/70 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/50 hover:bg-amber-100/60 transition-colors flex items-center justify-between"
          >
            <span className="text-[11px] font-medium text-amber-800 dark:text-amber-300">Wishlist</span>
            <span className="text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-200/60 dark:bg-amber-800/40 px-1.5 py-0.5 rounded">
              {stageCounts.wishlist}
            </span>
          </Link>

          <Link
            to="/jobs"
            className="p-2.5 rounded-lg border border-sky-200/70 bg-sky-50/50 dark:bg-sky-950/20 dark:border-sky-900/50 hover:bg-sky-100/60 transition-colors flex items-center justify-between"
          >
            <span className="text-[11px] font-medium text-sky-800 dark:text-sky-300">Applied</span>
            <span className="text-xs font-bold text-sky-900 dark:text-sky-200 bg-sky-200/60 dark:bg-sky-800/40 px-1.5 py-0.5 rounded">
              {stageCounts.applied}
            </span>
          </Link>

          <Link
            to="/jobs"
            className="p-2.5 rounded-lg border border-orange-200/70 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900/50 hover:bg-orange-100/60 transition-colors flex items-center justify-between"
          >
            <span className="text-[11px] font-medium text-orange-800 dark:text-orange-300">Assessments</span>
            <span className="text-xs font-bold text-orange-900 dark:text-orange-200 bg-orange-200/60 dark:bg-orange-800/40 px-1.5 py-0.5 rounded">
              {stageCounts.oa}
            </span>
          </Link>

          <Link
            to="/jobs"
            className="p-2.5 rounded-lg border border-purple-200/70 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-900/50 hover:bg-purple-100/60 transition-colors flex items-center justify-between"
          >
            <span className="text-[11px] font-medium text-purple-800 dark:text-purple-300">Interviews</span>
            <span className="text-xs font-bold text-purple-900 dark:text-purple-200 bg-purple-200/60 dark:bg-purple-800/40 px-1.5 py-0.5 rounded">
              {stageCounts.interview}
            </span>
          </Link>

          <Link
            to="/jobs"
            className="p-2.5 rounded-lg border border-emerald-200/70 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/50 hover:bg-emerald-100/60 transition-colors flex items-center justify-between col-span-2 sm:col-span-1"
          >
            <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">Offers</span>
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-200/60 dark:bg-emerald-800/40 px-1.5 py-0.5 rounded">
              {stageCounts.offer}
            </span>
          </Link>
        </div>
      </div>

      {/* Today's Focus Progress Bar */}
      {todayTotalRelevant > 0 && (
        <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-notion-text">Today's Priority Progress</span>
            <p className="text-notion-muted text-[11px]">
              {todayCompletedCount} of {todayTotalRelevant} scheduled items checked off
            </p>
          </div>
          <div className="flex items-center gap-3 sm:w-64">
            <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 border border-notion-border rounded-full overflow-hidden">
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
        {/* Left Column (7 cols): Today's Priority Agenda & Coding Drill */}
        <div className="lg:col-span-7 space-y-6">
          {/* Priority Agenda */}
          <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-notion-border/70">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-notion-text">Today's Priority Agenda</h2>
                {urgentOrTodayTasks.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {urgentOrTodayTasks.length} pending
                  </span>
                )}
              </div>
              <Link
                to="/tasks"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-0.5"
              >
                <span>View all</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            {urgentOrTodayTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-notion-muted bg-notion-bg/60 rounded-lg border border-dashed border-notion-border space-y-1.5">
                <p className="font-medium text-notion-text">No pending tasks scheduled for today.</p>
                <Link to="/tasks" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold block">
                  Add task or browse backlog →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-notion-border/50">
                {urgentOrTodayTasks.map(task => {
                  const isOverdue = task.dueDate && task.dueDate < todayStr;
                  return (
                    <div
                      key={task.id}
                      className="py-2.5 flex items-center justify-between gap-3 group text-xs hover:bg-notion-hover/40 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="notion-checkbox cursor-pointer"
                          aria-label={`Mark "${task.title}" as completed`}
                        />
                        <span className="text-notion-text font-normal truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-[11px]">
                        {task.jobId && (
                          <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-medium">
                            Linked
                          </span>
                        )}
                        {isOverdue ? (
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-800">
                            Overdue
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
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

          {/* Recommended Technical Challenge Drill */}
          {nextChallenge && (
            <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-notion-border/70 text-xs">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-notion-text">Recommended Technical Drill</span>
                </div>
                <Link
                  to="/coding"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-0.5"
                >
                  <span>Practice Suite</span>
                  <ChevronRight size={13} />
                </Link>
              </div>

              <div className="p-3.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-notion-text truncate">{nextChallenge.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold uppercase ${
                      nextChallenge.difficulty === 'Hard'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                        : nextChallenge.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                    }`}>
                      {nextChallenge.difficulty}
                    </span>
                  </div>
                  <div className="text-notion-muted text-[11px] flex items-center gap-2">
                    <span>{nextChallenge.category}</span>
                    <span>•</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">{nextChallenge.pattern}</span>
                    {nextChallenge.company && (
                      <>
                        <span>•</span>
                        <span>{nextChallenge.company}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/coding')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-warm-xs transition-colors shrink-0 cursor-pointer"
                >
                  <span>Open Drill</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Upcoming tasks peek */}
          {upcomingTasks.length > 0 && (
            <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-notion-border/70 text-xs">
                <span className="font-semibold text-notion-text">Upcoming Deadlines</span>
                <span className="text-notion-muted font-mono text-[11px]">Next 7 days</span>
              </div>
              <div className="divide-y divide-notion-border/50 text-xs">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="notion-checkbox cursor-pointer"
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
              <span className="font-semibold text-notion-text">Interview Radar</span>
              <Link
                to="/jobs"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-0.5"
              >
                <span>Full Board</span>
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
                    className="p-3 rounded-lg border border-notion-border hover:border-indigo-400/80 hover:bg-notion-hover/40 transition-all cursor-pointer space-y-1.5 text-xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-notion-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {job.company}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold">
                        {job.stage}
                      </span>
                    </div>
                    <div className="text-notion-muted truncate text-[11px]">{job.role}</div>
                    {job.interviewDate && (
                      <div className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 font-mono text-[11px] pt-0.5">
                        <Clock size={11} />
                        <span>{formatDisplayDate(job.interviewDate)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Club Commitments Widget */}
          {activeClubInitiatives.length > 0 && (
            <div className="bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-notion-border/70 text-xs">
                <div className="flex items-center gap-2">
                  <Users2 size={14} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-notion-text">Club Commitments</span>
                </div>
                <Link
                  to="/club-work"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-0.5"
                >
                  <span>View All</span>
                  <ChevronRight size={13} />
                </Link>
              </div>

              <div className="space-y-2">
                {activeClubInitiatives.slice(0, 3).map(item => {
                  const deliverables = item.deliverables || [];
                  const doneDeliverables = deliverables.filter(d => d.completed).length;

                  return (
                    <div
                      key={item.id}
                      onClick={() => navigate('/club-work')}
                      className="p-3 rounded-lg border border-notion-border hover:border-indigo-400/80 hover:bg-notion-hover/40 transition-all cursor-pointer space-y-1.5 text-xs group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-notion-text group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold shrink-0">
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-notion-muted">
                        <span>{item.clubName}</span>
                        {item.dueDate && <span className="font-mono">{item.dueDate}</span>}
                      </div>
                      {deliverables.length > 0 && (
                        <div className="pt-0.5 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-notion-border">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${Math.round((doneDeliverables / deliverables.length) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-notion-muted">
                            {doneDeliverables}/{deliverables.length}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                  <div key={item.id} className="text-xs space-y-0.5 border-l-2 border-indigo-500/70 pl-2.5 py-0.5">
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
