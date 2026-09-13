import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Plus,
  CheckSquare,
  Search,
  Filter,
  Calendar,
  Tag,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Trash2,
  ArrowUp,
  ArrowDown,
  CornerDownRight,
  Briefcase,
  Archive,
  Layers,
  Code2
} from 'lucide-react';
import { format, isBefore, subDays, startOfDay } from 'date-fns';

export default function TasksPage() {
  const {
    tasks,
    jobs,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    indentTask,
    outdentTask,
    applyTaskTemplate
  } = useApp();

  const navigate = useNavigate();

  // Filters state
  const [filterScope, setFilterScope] = useState('all'); // 'all' | 'today' | 'upcoming' | 'overdue' | 'coding'
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');

  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const editInputRef = useRef(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const sevenDaysAgo = subDays(startOfDay(new Date()), 7);

  const allTags = useMemo(() => {
    const set = new Set();
    tasks.forEach(t => (t.tags || []).forEach(tag => set.add(tag)));
    return Array.from(set);
  }, [tasks]);

  const { activeTasks, archivedTasks } = useMemo(() => {
    const active = [];
    const archived = [];

    tasks.forEach(t => {
      if (t.completed && t.completedAt) {
        const compDate = new Date(t.completedAt);
        if (isBefore(compDate, sevenDaysAgo)) {
          archived.push(t);
          return;
        }
      }
      active.push(t);
    });

    return { activeTasks: active, archivedTasks: archived };
  }, [tasks, sevenDaysAgo]);

  const filteredTasks = useMemo(() => {
    let list = showArchived ? tasks : activeTasks;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || (t.tags && t.tags.some(tg => tg.toLowerCase().includes(q))));
    }

    if (filterScope === 'today') {
      list = list.filter(t => t.dueDate === todayStr);
    } else if (filterScope === 'upcoming') {
      list = list.filter(t => t.dueDate && t.dueDate > todayStr);
    } else if (filterScope === 'overdue') {
      list = list.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr);
    } else if (filterScope === 'coding') {
      list = list.filter(t => (t.tags || []).some(tg => ['#coding', '#dsa', '#leetcode', '#systems'].includes(tg.toLowerCase())));
    }

    if (selectedTag) {
      list = list.filter(t => t.tags && t.tags.includes(selectedTag));
    }

    if (selectedPriority) {
      list = list.filter(t => t.priority === selectedPriority);
    }

    return list;
  }, [showArchived, tasks, activeTasks, searchQuery, filterScope, selectedTag, selectedPriority, todayStr]);

  const { rootTasks, subtaskMap } = useMemo(() => {
    const roots = [];
    const map = {};

    filteredTasks.forEach(t => {
      if (t.parentId) {
        if (!map[t.parentId]) map[t.parentId] = [];
        map[t.parentId].push(t);
      } else {
        roots.push(t);
      }
    });

    roots.sort((a, b) => {
      const aOverdue = !a.completed && a.dueDate && a.dueDate < todayStr;
      const bOverdue = !b.completed && b.dueDate && b.dueDate < todayStr;
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return 0;
    });

    return { rootTasks: roots, subtaskMap: map };
  }, [filteredTasks, todayStr]);

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const saveEditing = () => {
    if (editingId && editingTitle.trim()) {
      updateTask(editingId, { title: editingTitle.trim() });
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEditing();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditingTitle('');
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      title: quickTitle.trim(),
      dueDate: filterScope === 'today' ? todayStr : null,
      tags: filterScope === 'coding' ? ['#coding'] : []
    });
    setQuickTitle('');
  };

  const moveTask = (task, direction) => {
    const index = tasks.findIndex(t => t.id === task.id);
    if (index < 0) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasks.length) return;

    const newTasks = [...tasks];
    const [moved] = newTasks.splice(index, 1);
    newTasks.splice(targetIndex, 0, moved);
    reorderTasks(newTasks);
  };

  const renderTaskItem = (task, isSubtask = false) => {
    const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;
    const isEditing = editingId === task.id;
    const linkedJob = task.jobId ? jobs.find(j => j.id === task.jobId) : null;
    const subtasks = subtaskMap[task.id] || [];

    return (
      <div key={task.id} className="space-y-1">
        <div
          className={`group flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-notion-border hover:bg-notion-hover/40 transition-all ${
            isSubtask ? 'ml-6 border-l-2 border-l-notion-border/80 pl-3' : ''
          }`}
        >
          {/* Checkbox & Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="notion-checkbox"
              aria-label={`Mark "${task.title}" as completed`}
            />

            {isEditing ? (
              <input
                ref={editInputRef}
                type="text"
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                onBlur={saveEditing}
                onKeyDown={handleEditKeyDown}
                className="flex-1 bg-transparent border-b border-terracotta text-xs sm:text-sm text-notion-text outline-none py-0.5 font-medium"
              />
            ) : (
              <span
                onClick={() => startEditing(task)}
                className={`text-xs sm:text-sm cursor-text strikethrough-transition select-text font-normal truncate ${
                  task.completed ? 'completed text-notion-muted line-through' : 'text-notion-text hover:text-terracotta'
                }`}
                title="Click to inline edit"
              >
                {task.title}
              </span>
            )}
          </div>

          {/* Meta Badges */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            {linkedJob && (
              <button
                onClick={() => navigate(`/jobs/${linkedJob.id}`)}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#EDF3F7] text-[#235479] dark:bg-[#162635] dark:text-[#8EB9DD] font-medium border border-[#BED2E2] dark:border-[#243D53]"
                title={`Linked to ${linkedJob.company}`}
              >
                <Briefcase size={11} />
                <span>{linkedJob.company}</span>
              </button>
            )}

            {task.dueDate && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-mono flex items-center gap-1 border ${
                  isOverdue
                    ? 'bg-[#FBF0EB] text-[#A8492C] dark:bg-[#331A14] dark:text-[#E78C72] font-semibold border-[#EBCABE] dark:border-[#522920]'
                    : task.dueDate === todayStr
                    ? 'bg-[#F9F3E8] text-[#8A5B18] dark:bg-[#2B2214] dark:text-[#E5B564] font-semibold border-[#E8D7B8] dark:border-[#4A3A22]'
                    : 'bg-notion-hover text-notion-muted border-notion-border'
                }`}
              >
                <Calendar size={11} />
                {task.dueDate}
              </span>
            )}

            {task.priority && task.priority !== 'medium' && (
              <span
                className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border ${
                  task.priority === 'urgent'
                    ? 'bg-[#FBF0EB] text-[#A8492C] dark:bg-[#331A14] dark:text-[#E78C72] border-[#EBCABE] dark:border-[#522920]'
                    : 'bg-[#F9F3E8] text-[#8A5B18] dark:bg-[#2B2214] dark:text-[#E5B564] border-[#E8D7B8] dark:border-[#4A3A22]'
                }`}
              >
                {task.priority}
              </span>
            )}

            {task.tags && task.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded bg-notion-bg text-notion-muted border border-notion-border font-mono"
              >
                {tag}
              </span>
            ))}

            {/* Hover Actions */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
              {!isSubtask ? (
                <button
                  onClick={() => indentTask(task.id)}
                  className="p-1 rounded text-notion-muted hover:text-notion-text hover:bg-notion-hover"
                  title="Make Subtask (Indent)"
                >
                  <CornerDownRight size={13} />
                </button>
              ) : (
                <button
                  onClick={() => outdentTask(task.id)}
                  className="p-1 rounded text-notion-muted hover:text-notion-text hover:bg-notion-hover"
                  title="Promote to Top-level (Outdent)"
                >
                  <ArrowUp size={13} />
                </button>
              )}

              <button
                onClick={() => moveTask(task, 'up')}
                className="p-1 rounded text-notion-muted hover:text-notion-text hover:bg-notion-hover"
                title="Move up"
              >
                <ArrowUp size={13} />
              </button>

              <button
                onClick={() => moveTask(task, 'down')}
                className="p-1 rounded text-notion-muted hover:text-notion-text hover:bg-notion-hover"
                title="Move down"
              >
                <ArrowDown size={13} />
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete task"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>

        {subtasks.length > 0 && (
          <div className="space-y-1">
            {subtasks.map(sub => renderTaskItem(sub, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
      {/* Top Header & Template button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-notion-border/80 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold text-notion-text tracking-tight">
            Tasks & Action Items
          </h1>
          <p className="text-xs text-notion-muted italic">
            Hierarchical task outlines, inline quick editing, and checklist templates.
          </p>
        </div>

        <button
          onClick={() => applyTaskTemplate('internship_checklist')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-notion-border bg-notion-card hover:bg-notion-hover text-xs font-semibold text-notion-text shadow-warm-sm transition-colors shrink-0"
        >
          <Layers size={14} className="text-terracotta" />
          <span>+ Application Checklist Template</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-3 shadow-warm-sm space-y-3">
        {/* Search row */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-notion-bg rounded-lg border border-notion-border text-xs">
          <Search size={14} className="text-terracotta shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks by keyword or #tag..."
            className="w-full bg-transparent text-xs text-notion-text placeholder:text-notion-muted outline-none font-medium"
          />
        </div>

        {/* Filter scopes row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'today', label: 'Today' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'overdue', label: 'Overdue' },
              { id: 'coding', label: 'Coding Tasks' }
            ].map(scope => (
              <button
                key={scope.id}
                onClick={() => setFilterScope(scope.id)}
                className={`px-2.5 py-1 rounded-md transition-colors text-xs ${
                  filterScope === scope.id
                    ? 'bg-terracotta text-white font-semibold shadow-warm-sm'
                    : 'text-notion-muted hover:text-notion-text hover:bg-notion-hover'
                }`}
              >
                {scope.label}
              </button>
            ))}

            {allTags.length > 0 && (
              <select
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
                className="bg-transparent border border-notion-border rounded-md px-2 py-1 text-xs text-notion-text outline-none cursor-pointer"
              >
                <option value="">All Tags</option>
                {allTags.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}

            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="bg-transparent border border-notion-border rounded-md px-2 py-1 text-xs text-notion-text outline-none cursor-pointer"
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {archivedTasks.length > 0 && (
            <button
              onClick={() => setShowArchived(prev => !prev)}
              className="flex items-center gap-1 text-xs text-notion-muted hover:text-notion-text px-2 py-1 rounded hover:bg-notion-hover transition-colors font-medium italic"
            >
              <Archive size={13} />
              <span>{showArchived ? 'Hide Completed >7d' : `Archived (${archivedTasks.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Add Row */}
      <form onSubmit={handleQuickAdd} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-notion-card border border-notion-border shadow-warm-sm">
        <Plus size={16} className="text-terracotta shrink-0" />
        <input
          type="text"
          value={quickTitle}
          onChange={e => setQuickTitle(e.target.value)}
          placeholder="+ Add a task item (Press Enter to create)..."
          className="w-full bg-transparent text-xs sm:text-sm text-notion-text placeholder:text-notion-muted outline-none font-medium"
        />
        <button
          type="submit"
          disabled={!quickTitle.trim()}
          className="px-3 py-1 text-xs font-semibold rounded-md bg-notion-hover text-notion-text disabled:opacity-40 hover:bg-terracotta hover:text-white transition-colors shrink-0"
        >
          Add
        </button>
      </form>

      {/* Task List */}
      <div className="bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm min-h-[300px]">
        {rootTasks.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="font-display font-semibold text-sm text-notion-text">No tasks found</p>
            <p className="text-xs text-notion-muted italic max-w-sm mx-auto">
              {searchQuery || selectedTag || filterScope !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Your task list is clear. Use the quick-add input above to create a task.'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 divide-y divide-notion-border/40">
            {rootTasks.map(task => renderTaskItem(task, false))}
          </div>
        )}
      </div>
    </div>
  );
}
