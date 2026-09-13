import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { loadDatabase, saveDatabase, SAMPLE_DATA, exportDatabaseJSON, parseImportedJSON } from '../lib/db';
import { parseQuickAdd } from '../lib/nlpParser';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(() => loadDatabase());
  const [saveStatus, setSaveStatus] = useState('saved');
  const [toasts, setToasts] = useState([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const saveTimeoutRef = useRef(null);

  // Debounced auto-save
  useEffect(() => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveDatabase(data);
      setSaveStatus('saved');
    }, 350);

    return () => clearTimeout(saveTimeoutRef.current);
  }, [data]);

  // Handle Theme switching & class syncing
  const theme = data.settings?.theme || 'light';
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Handle Font Family sync
  const fontFamily = data.settings?.fontFamily || 'inter';
  useEffect(() => {
    document.documentElement.setAttribute('data-font', fontFamily);
  }, [fontFamily]);

  // Toast notification helper (NO emojis)
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Check reminders on initial load (Interviews in 24h, Tasks due today - NO emojis)
  useEffect(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Tasks due today
    const dueToday = data.tasks.filter(t => !t.completed && t.dueDate === todayStr);
    if (dueToday.length > 0) {
      addToast(`You have ${dueToday.length} task${dueToday.length > 1 ? 's' : ''} scheduled for today.`, 'warning');
    }

    // Interviews within next 24 hours
    const upcomingInterviews = data.jobs.filter(j => {
      if (!j.interviewDate) return false;
      const intDate = new Date(j.interviewDate);
      const diffHours = (intDate - now) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours <= 24;
    });

    if (upcomingInterviews.length > 0) {
      upcomingInterviews.forEach(j => {
        addToast(`Upcoming interview with ${j.company} (${j.role}) within 24 hours.`, 'success');
      });
    }
  }, []);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Activity Log Dispatcher
  const logActivity = useCallback((entry) => {
    const newEntry = {
      id: 'act-' + Date.now() + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      ...entry
    };
    setData(prev => ({
      ...prev,
      activityLog: [newEntry, ...(prev.activityLog || [])].slice(0, 50)
    }));
  }, []);

  // TASK ACTIONS
  const addTask = useCallback((taskInput) => {
    const newTask = {
      id: 'task-' + Date.now(),
      title: taskInput.title || 'Untitled task',
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      dueDate: taskInput.dueDate || null,
      dueTime: taskInput.dueTime || null,
      priority: taskInput.priority || 'medium',
      tags: taskInput.tags || [],
      parentId: taskInput.parentId || null,
      jobId: taskInput.jobId || null,
      recurring: taskInput.recurring || 'none',
      notes: taskInput.notes || ''
    };

    setData(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));

    logActivity({
      type: 'task_created',
      title: `Created task "${newTask.title}"`,
      details: newTask.dueDate ? `Due: ${newTask.dueDate}` : null,
      link: '/tasks'
    });

    addToast(`Task added: "${newTask.title}"`, 'success');
    return newTask;
  }, [logActivity, addToast]);

  const updateTask = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  }, []);

  const toggleTask = useCallback((id) => {
    let completedItem = null;

    setData(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (!task) return prev;

      const nextCompleted = !task.completed;
      completedItem = task;

      const updatedTasks = prev.tasks.map(t => {
        if (t.id === id) {
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null
          };
        }
        return t;
      });

      // Recurring task regeneration
      if (nextCompleted && task.recurring && task.recurring !== 'none') {
        const nextDueDate = new Date();
        if (task.recurring === 'daily') {
          nextDueDate.setDate(nextDueDate.getDate() + 1);
        } else if (task.recurring === 'weekly') {
          nextDueDate.setDate(nextDueDate.getDate() + 7);
        }
        const recurringTask = {
          ...task,
          id: 'task-' + Date.now() + '-recur',
          completed: false,
          completedAt: null,
          createdAt: new Date().toISOString(),
          dueDate: nextDueDate.toISOString().split('T')[0]
        };
        updatedTasks.push(recurringTask);
      }

      return {
        ...prev,
        tasks: updatedTasks
      };
    });

    if (completedItem && !completedItem.completed) {
      logActivity({
        type: 'task_completed',
        title: `Completed "${completedItem.title}"`,
        details: 'Marked as completed',
        link: '/tasks'
      });
    }
  }, [logActivity]);

  const deleteTask = useCallback((id) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id && t.parentId !== id)
    }));
    addToast('Task removed', 'info');
  }, [addToast]);

  const reorderTasks = useCallback((newOrderedTasks) => {
    setData(prev => ({
      ...prev,
      tasks: newOrderedTasks
    }));
  }, []);

  const indentTask = useCallback((id) => {
    setData(prev => {
      const index = prev.tasks.findIndex(t => t.id === id);
      if (index <= 0) return prev;
      const itemAbove = prev.tasks[index - 1];
      const parentId = itemAbove.parentId || itemAbove.id;
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? { ...t, parentId } : t)
      };
    });
  }, []);

  const outdentTask = useCallback((id) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, parentId: null } : t)
    }));
  }, []);

  const applyTaskTemplate = useCallback((templateType, optionalJobId = null) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (templateType === 'internship_checklist') {
      const parentId = 'task-' + Date.now();
      const items = [
        {
          id: parentId,
          title: 'Internship Application Master Checklist',
          completed: false,
          completedAt: null,
          createdAt: now.toISOString(),
          dueDate: todayStr,
          priority: 'high',
          tags: ['#internship', '#checklist'],
          parentId: null,
          jobId: optionalJobId,
          recurring: 'none',
          notes: 'Standard end-to-end recruitment process tracker.'
        },
        {
          id: 'task-' + (Date.now() + 1),
          title: 'Audit Resume against JD keywords & ATS requirements',
          completed: false,
          completedAt: null,
          createdAt: now.toISOString(),
          dueDate: null,
          priority: 'high',
          tags: ['#resume'],
          parentId,
          jobId: optionalJobId,
          recurring: 'none',
          notes: ''
        },
        {
          id: 'task-' + (Date.now() + 2),
          title: 'Reach out to engineering alumni on LinkedIn for referral',
          completed: false,
          completedAt: null,
          createdAt: now.toISOString(),
          dueDate: null,
          priority: 'medium',
          tags: ['#networking'],
          parentId,
          jobId: optionalJobId,
          recurring: 'none',
          notes: ''
        },
        {
          id: 'task-' + (Date.now() + 3),
          title: 'Submit official application via careers portal',
          completed: false,
          completedAt: null,
          createdAt: now.toISOString(),
          dueDate: null,
          priority: 'urgent',
          tags: ['#apply'],
          parentId,
          jobId: optionalJobId,
          recurring: 'none',
          notes: ''
        },
        {
          id: 'task-' + (Date.now() + 4),
          title: 'Follow up after 7 business days if no status change',
          completed: false,
          completedAt: null,
          createdAt: now.toISOString(),
          dueDate: null,
          priority: 'low',
          tags: ['#followup'],
          parentId,
          jobId: optionalJobId,
          recurring: 'none',
          notes: ''
        }
      ];

      setData(prev => ({
        ...prev,
        tasks: [...items, ...prev.tasks]
      }));
      addToast('Applied "Internship Application Checklist" template', 'success');
    }
  }, [addToast]);

  // CODING CHALLENGES (Dedicated Coding Category)
  const addCodingChallenge = useCallback((challengeInput) => {
    const newChallenge = {
      id: 'code-' + Date.now(),
      title: challengeInput.title || 'Untitled Problem',
      category: challengeInput.category || 'DSA',
      difficulty: challengeInput.difficulty || 'Medium',
      pattern: challengeInput.pattern || 'General',
      status: challengeInput.status || 'To-Do',
      company: challengeInput.company || 'General',
      lastPracticed: new Date().toISOString().split('T')[0],
      link: challengeInput.link || '',
      notes: challengeInput.notes || ''
    };

    setData(prev => ({
      ...prev,
      codingChallenges: [newChallenge, ...(prev.codingChallenges || [])]
    }));

    logActivity({
      type: 'coding_created',
      title: `Added problem "${newChallenge.title}"`,
      details: `${newChallenge.difficulty} • ${newChallenge.pattern}`,
      link: '/coding'
    });

    addToast(`Added coding problem "${newChallenge.title}"`, 'success');
    return newChallenge;
  }, [logActivity, addToast]);

  const updateCodingChallenge = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      codingChallenges: (prev.codingChallenges || []).map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  }, []);

  const deleteCodingChallenge = useCallback((id) => {
    setData(prev => ({
      ...prev,
      codingChallenges: (prev.codingChallenges || []).filter(c => c.id !== id)
    }));
    addToast('Coding problem removed', 'info');
  }, [addToast]);

  const toggleCodingStatus = useCallback((id) => {
    setData(prev => {
      const challenge = (prev.codingChallenges || []).find(c => c.id === id);
      if (!challenge) return prev;

      let nextStatus = 'In Progress';
      if (challenge.status === 'In Progress') nextStatus = 'Solved';
      else if (challenge.status === 'Solved') nextStatus = 'Review Needed';
      else if (challenge.status === 'Review Needed') nextStatus = 'To-Do';

      return {
        ...prev,
        codingChallenges: prev.codingChallenges.map(c =>
          c.id === id ? { ...c, status: nextStatus, lastPracticed: new Date().toISOString().split('T')[0] } : c
        )
      };
    });
  }, []);

  // JOB ACTIONS
  const addJob = useCallback((jobInput) => {
    const newJob = {
      id: 'job-' + Date.now(),
      company: jobInput.company || 'Untitled Company',
      role: jobInput.role || 'Software Engineer',
      stage: jobInput.stage || 'wishlist',
      dateApplied: jobInput.dateApplied || (jobInput.stage !== 'wishlist' ? new Date().toISOString().split('T')[0] : ''),
      deadline: jobInput.deadline || null,
      interviewDate: jobInput.interviewDate || null,
      location: jobInput.location || 'Remote / Hybrid',
      salary: jobInput.salary || '',
      jobUrl: jobInput.jobUrl || '',
      resumeVersion: jobInput.resumeVersion || 'Resume_Default.pdf',
      tags: jobInput.tags || ['Internship'],
      recruiter: jobInput.recruiter || { name: '', email: '', linkedin: '' },
      notes: jobInput.notes || '',
      timeline: [
        {
          id: 'tl-' + Date.now(),
          stage: jobInput.stage || 'wishlist',
          note: `Added application to ${jobInput.stage || 'wishlist'}.`,
          timestamp: new Date().toISOString()
        }
      ],
      followUpDate: jobInput.followUpDate || null
    };

    setData(prev => ({
      ...prev,
      jobs: [newJob, ...prev.jobs]
    }));

    logActivity({
      type: 'job_created',
      title: `Added ${newJob.company} (${newJob.role})`,
      details: `Stage: ${newJob.stage.toUpperCase()}`,
      link: `/jobs/${newJob.id}`
    });

    addToast(`Added job application for ${newJob.company}`, 'success');
    return newJob;
  }, [logActivity, addToast]);

  const updateJob = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      jobs: prev.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
    }));
  }, []);

  const moveJobStage = useCallback((id, newStage, note = '') => {
    let companyName = '';

    setData(prev => {
      const job = prev.jobs.find(j => j.id === id);
      if (!job) return prev;
      companyName = job.company;

      const timelineEntry = {
        id: 'tl-' + Date.now(),
        stage: newStage,
        note: note || `Moved stage to ${newStage.toUpperCase()}`,
        timestamp: new Date().toISOString()
      };

      let dateApplied = job.dateApplied;
      if (newStage === 'applied' && !dateApplied) {
        dateApplied = new Date().toISOString().split('T')[0];
      }

      return {
        ...prev,
        jobs: prev.jobs.map(j => {
          if (j.id === id) {
            return {
              ...j,
              stage: newStage,
              dateApplied,
              timeline: [timelineEntry, ...(j.timeline || [])]
            };
          }
          return j;
        })
      };
    });

    logActivity({
      type: 'job_status_change',
      title: `${companyName}: Moved to ${newStage.toUpperCase()}`,
      details: note || `Application advanced to stage: ${newStage}`,
      link: `/jobs/${id}`
    });

    addToast(`${companyName} moved to ${newStage.toUpperCase()}`, 'success');
  }, [logActivity, addToast]);

  const addJobTimelineEvent = useCallback((id, note, stage) => {
    const timelineEntry = {
      id: 'tl-' + Date.now(),
      stage: stage || 'note',
      note,
      timestamp: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      jobs: prev.jobs.map(j => j.id === id ? { ...j, timeline: [timelineEntry, ...(j.timeline || [])] } : j)
    }));
  }, []);

  const deleteJob = useCallback((id) => {
    setData(prev => ({
      ...prev,
      jobs: prev.jobs.filter(j => j.id !== id),
      tasks: prev.tasks.map(t => t.jobId === id ? { ...t, jobId: null } : t)
    }));
    addToast('Job application removed', 'info');
  }, [addToast]);

  // NOTE ACTIONS (NO emojis)
  const addNote = useCallback((noteInput) => {
    const newNote = {
      id: 'note-' + Date.now(),
      title: noteInput.title || 'Untitled Document',
      icon: noteInput.icon || 'file',
      content: noteInput.content || '# Untitled\n\nStart typing notes...',
      tags: noteInput.tags || [],
      linkedJobId: noteInput.linkedJobId || null,
      updatedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
    logActivity({
      type: 'note_created',
      title: `Created note "${newNote.title}"`,
      details: 'Notes workspace',
      link: '/notes'
    });
    addToast('New document created', 'success');
    return newNote;
  }, [logActivity, addToast]);

  const updateNote = useCallback((id, updates) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n)
    }));
  }, []);

  const deleteNote = useCallback((id) => {
    setData(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
    addToast('Note deleted', 'info');
  }, [addToast]);

  // SETTINGS & BACKUP ACTIONS
  const setTheme = useCallback((newTheme) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, theme: newTheme }
    }));
  }, []);

  const setFontFamily = useCallback((newFont) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, fontFamily: newFont }
    }));
  }, []);

  const exportData = useCallback(() => {
    exportDatabaseJSON(data);
    addToast('Backup exported successfully', 'success');
  }, [data, addToast]);

  const importData = useCallback((jsonString) => {
    try {
      const parsed = parseImportedJSON(jsonString);
      setData(parsed);
      saveDatabase(parsed);
      addToast('Data restored successfully', 'success');
      return true;
    } catch (err) {
      addToast(`Import failed: ${err.message}`, 'error');
      return false;
    }
  }, [addToast]);

  const resetToSampleData = useCallback(() => {
    setData(SAMPLE_DATA);
    saveDatabase(SAMPLE_DATA);
    addToast('Reset to demo sample data', 'success');
  }, [addToast]);

  const clearAllData = useCallback(() => {
    const emptyState = {
      tasks: [],
      codingChallenges: [],
      jobs: [],
      notes: [],
      activityLog: [],
      settings: SAMPLE_DATA.settings
    };
    setData(emptyState);
    saveDatabase(emptyState);
    addToast('All data cleared', 'info');
  }, [addToast]);

  // SMART NATURAL LANGUAGE DISPATCH
  const executeQuickAdd = useCallback((nlpString) => {
    const parsed = parseQuickAdd(nlpString);
    if (!parsed) return null;

    if (parsed.type === 'job') {
      const created = addJob({
        company: parsed.title,
        role: 'Software Engineer',
        stage: 'wishlist',
        tags: parsed.tags.length ? parsed.tags : ['Quick-add']
      });
      return { type: 'job', item: created };
    } else {
      const applyMatch = parsed.title.match(/apply\s+to\s+([A-Za-z0-9]+)\s*(.*)/i);
      let linkedJobId = null;

      if (applyMatch) {
        const companyHint = applyMatch[1].toLowerCase();
        const existing = data.jobs.find(j => j.company.toLowerCase().includes(companyHint));
        if (existing) {
          linkedJobId = existing.id;
        }
      }

      const created = addTask({
        title: parsed.title,
        priority: parsed.priority,
        dueDate: parsed.dueDate,
        dueTime: parsed.dueTime,
        tags: parsed.tags,
        jobId: linkedJobId
      });
      return { type: 'task', item: created };
    }
  }, [addJob, addTask, data.jobs]);

  // COMPUTED STATS
  const stats = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const completedThisWeek = data.tasks.filter(t => {
      if (!t.completed || !t.completedAt) return false;
      return new Date(t.completedAt) >= oneWeekAgo;
    }).length;

    const appliedThisMonth = data.jobs.filter(j => {
      if (!j.dateApplied) return false;
      return new Date(j.dateApplied) >= startOfMonth;
    }).length;

    const upcomingInterviewsList = data.jobs.filter(j => {
      return j.stage === 'interview' || (j.interviewDate && new Date(j.interviewDate) >= now);
    });

    const todayStr = now.toISOString().split('T')[0];
    const overdueTasks = data.tasks.filter(t => {
      return !t.completed && t.dueDate && t.dueDate < todayStr;
    });

    const tasksDueToday = data.tasks.filter(t => {
      return !t.completed && t.dueDate === todayStr;
    });

    // Coding challenges stats
    const codingChallenges = data.codingChallenges || [];
    const solvedChallenges = codingChallenges.filter(c => c.status === 'Solved').length;

    const completedDaysSet = new Set(
      data.tasks
        .filter(t => t.completed && t.completedAt)
        .map(t => new Date(t.completedAt).toISOString().split('T')[0])
    );
    let streak = 0;
    let checkDate = new Date();
    const checkTodayStr = checkDate.toISOString().split('T')[0];
    if (completedDaysSet.has(checkTodayStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (completedDaysSet.has(checkDate.toISOString().split('T')[0])) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      completedThisWeek,
      appliedThisMonth,
      upcomingInterviewsCount: upcomingInterviewsList.length,
      upcomingInterviews: upcomingInterviewsList,
      overdueTasksCount: overdueTasks.length,
      overdueTasks,
      tasksDueTodayCount: tasksDueToday.length,
      tasksDueToday,
      solvedChallenges,
      totalChallenges: codingChallenges.length,
      currentStreak: Math.max(streak, 1)
    };
  }, [data.tasks, data.jobs, data.codingChallenges]);

  const value = {
    tasks: data.tasks,
    codingChallenges: data.codingChallenges || [],
    jobs: data.jobs,
    notes: data.notes,
    activityLog: data.activityLog || [],
    settings: data.settings,
    theme,
    saveStatus,
    toasts,
    stats,
    commandPaletteOpen,
    setCommandPaletteOpen,
    addToast,
    removeToast,
    logActivity,
    // Task methods
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    indentTask,
    outdentTask,
    applyTaskTemplate,
    // Coding Challenge methods
    addCodingChallenge,
    updateCodingChallenge,
    deleteCodingChallenge,
    toggleCodingStatus,
    // Job methods
    addJob,
    updateJob,
    moveJobStage,
    addJobTimelineEvent,
    deleteJob,
    // Note methods
    addNote,
    updateNote,
    deleteNote,
    // NLP quick add
    executeQuickAdd,
    // Settings & Backup
    setTheme,
    fontFamily,
    setFontFamily,
    exportData,
    importData,
    resetToSampleData,
    clearAllData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
