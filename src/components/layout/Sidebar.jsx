import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Briefcase,
  Calendar,
  FileText,
  Settings,
  Search,
  Plus,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Terminal,
  Code2,
  Users2
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed }) {
  const {
    tasks,
    codingChallenges,
    clubWork,
    jobs,
    notes,
    theme,
    setTheme,
    userName = 'Varnzz',
    saveStatus,
    setCommandPaletteOpen
  } = useApp();

  const navigate = useNavigate();

  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const activeJobsCount = jobs.filter(j => j.stage !== 'rejected').length;
  const codingCount = (codingChallenges || []).filter(c => c.status !== 'Solved').length;
  const clubCount = (clubWork || []).filter(c => c.status !== 'Completed').length;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, badge: pendingTasksCount },
    { name: 'Coding Prep', path: '/coding', icon: Code2, badge: codingCount },
    { name: 'Club Work', path: '/club-work', icon: Users2, badge: clubCount },
    { name: 'Job Tracker', path: '/jobs', icon: Briefcase, badge: activeJobsCount },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Notes', path: '/notes', icon: FileText, badge: notes.length },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const pinnedJobs = jobs.slice(0, 3);

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col border-r border-notion-border bg-notion-sidebar select-none transition-all duration-200 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Workspace Header - Modern Indigo Monogram */}
      <div className="flex items-center justify-between p-4 border-b border-notion-border/80">
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-warm-sm shrink-0">
              <CheckSquare size={16} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-notion-text tracking-tight truncate">
                TO-DO
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                {userName}'s Workspace
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-warm-sm">
            <CheckSquare size={16} strokeWidth={2.5} />
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(prev => !prev)}
          className="text-notion-muted hover:text-notion-text p-1 rounded hover:bg-notion-hover transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Search trigger */}
      <div className="p-3">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-notion-border bg-notion-card hover:bg-notion-hover text-notion-muted text-xs transition-colors shadow-warm-sm cursor-pointer ${
            collapsed ? 'justify-center px-0' : 'justify-between'
          }`}
          title="Search & Commands (Cmd+K)"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
            {!collapsed && <span className="font-medium text-notion-text/80">Quick Jump</span>}
          </div>
          {!collapsed && (
            <kbd className="px-1.5 py-0.5 text-[10px] bg-notion-hover border border-notion-border rounded text-notion-muted font-mono">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-notion-card text-indigo-600 dark:text-indigo-400 font-semibold border-l-3 border-indigo-600 shadow-warm-sm'
                    : 'text-notion-muted hover:text-notion-text hover:bg-notion-hover'
                } ${collapsed ? 'justify-center px-0' : ''}`
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon size={16} className="shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-notion-hover border border-notion-border text-notion-muted">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Pinned Applications */}
        {!collapsed && pinnedJobs.length > 0 && (
          <div className="pt-5 pb-2">
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-notion-muted flex items-center justify-between">
              <span>Priority Radar</span>
              <Building2 size={12} className="text-notion-muted" />
            </div>
            <div className="space-y-0.5 mt-1">
              {pinnedJobs.map(job => (
                <button
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-notion-muted hover:text-notion-text hover:bg-notion-hover transition-colors truncate group cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="truncate flex-1 font-medium">{job.company}</span>
                  <span className="text-[10px] uppercase font-mono text-notion-muted/80">{job.stage}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Footer Controls & Local Sync */}
      <div className="p-3 border-t border-notion-border/80 flex flex-col gap-2">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-notion-card border border-notion-border text-xs shadow-warm-xs">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 shadow-warm-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-notion-text truncate text-xs">{userName}</span>
              <span className="text-[10px] text-notion-muted truncate">Active Session</span>
            </div>
          </div>
        ) : (
          <div className="w-7 h-7 mx-auto rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-[11px] shadow-warm-xs" title={userName}>
            {userName.charAt(0).toUpperCase()}
          </div>
        )}

        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] text-notion-muted px-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  saveStatus === 'saved' ? 'bg-forest' : 'bg-[#C86D51] animate-pulse'
                }`}
              />
              <span>{saveStatus === 'saved' ? 'Saved locally' : 'Syncing...'}</span>
            </div>
            <ShieldCheck size={13} className="text-notion-muted" />
          </div>
        ) : (
          <div className="flex justify-center" title={saveStatus === 'saved' ? 'Saved locally' : 'Syncing...'}>
            <span
              className={`w-2 h-2 rounded-full ${
                saveStatus === 'saved' ? 'bg-forest' : 'bg-[#C86D51] animate-pulse'
              }`}
            />
          </div>
        )}

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`flex items-center gap-2 p-1.5 rounded-lg hover:bg-notion-hover text-notion-muted hover:text-notion-text text-xs transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} className="text-indigo-500" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
        </button>
      </div>
    </aside>
  );
}
