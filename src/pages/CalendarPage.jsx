import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Briefcase,
  CheckSquare,
  AlertCircle,
  Plus
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from 'date-fns';

export default function CalendarPage() {
  const { tasks, jobs, addTask } = useApp();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today);
  };

  const calendarDays = useMemo(() => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(monthStart);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
      const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
  }, [currentDate, viewMode]);

  const eventsByDate = useMemo(() => {
    const map = {};

    const addEvent = (dateStr, event) => {
      if (!dateStr) return;
      const key = dateStr.split('T')[0];
      if (!map[key]) map[key] = [];
      map[key].push(event);
    };

    tasks.forEach(task => {
      if (task.dueDate) {
        addEvent(task.dueDate, {
          id: `task-${task.id}`,
          type: 'task',
          title: task.title,
          completed: task.completed,
          time: task.dueTime,
          priority: task.priority,
          rawItem: task
        });
      }
    });

    jobs.forEach(job => {
      if (job.interviewDate) {
        const [dStr, tStr] = job.interviewDate.split('T');
        addEvent(dStr, {
          id: `int-${job.id}`,
          type: 'interview',
          title: `${job.company} Interview`,
          subtitle: job.role,
          time: tStr,
          jobId: job.id,
          rawItem: job
        });
      }

      if (job.deadline) {
        addEvent(job.deadline, {
          id: `dead-${job.id}`,
          type: 'deadline',
          title: `${job.company} Deadline`,
          subtitle: job.role,
          jobId: job.id,
          rawItem: job
        });
      }
    });

    return map;
  }, [tasks, jobs]);

  const selectedDayKey = format(selectedDay, 'yyyy-MM-dd');
  const selectedDayEvents = eventsByDate[selectedDayKey] || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
      {/* Calendar Header & View switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-notion-border/80 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold text-notion-text tracking-tight">
            Unified Calendar & Milestones
          </h1>
          <p className="text-xs text-notion-muted italic">
            Synchronized schedule of task commitments, interviews, and application deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-lg border border-notion-border bg-notion-card p-0.5 text-xs shadow-warm-sm">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                viewMode === 'month' ? 'bg-terracotta text-white shadow-warm-sm' : 'text-notion-muted'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                viewMode === 'week' ? 'bg-terracotta text-white shadow-warm-sm' : 'text-notion-muted'
              }`}
            >
              Week
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-notion-border bg-notion-card hover:bg-notion-hover text-notion-muted hover:text-notion-text shadow-warm-sm"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-xs rounded-lg border border-notion-border bg-notion-card hover:bg-notion-hover text-notion-text font-semibold shadow-warm-sm"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-notion-border bg-notion-card hover:bg-notion-hover text-notion-muted hover:text-notion-text shadow-warm-sm"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid + Selected Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-notion-card border border-notion-border rounded-xl p-4 shadow-warm-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-notion-border/60">
            <span className="font-display font-semibold text-base text-notion-text">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-[#235479] dark:text-[#8EB9DD]">
                <span className="w-2 h-2 rounded-full bg-[#235479] dark:bg-[#8EB9DD]" /> Tasks
              </span>
              <span className="flex items-center gap-1 text-[#6A3E6F] dark:text-[#CB97D2]">
                <span className="w-2 h-2 rounded-full bg-[#6A3E6F] dark:bg-[#CB97D2]" /> Interviews
              </span>
              <span className="flex items-center gap-1 text-[#8A5B18] dark:text-[#E5B564]">
                <span className="w-2 h-2 rounded-full bg-[#8A5B18] dark:bg-[#E5B564]" /> Deadlines
              </span>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-notion-muted py-1 uppercase tracking-wider">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayKey = format(day, 'yyyy-MM-dd');
              const dayEvents = eventsByDate[dayKey] || [];
              const isSelected = isSameDay(day, selectedDay);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[85px] p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-terracotta bg-terracotta/5 ring-1 ring-terracotta'
                      : isTodayDate
                      ? 'border-notion-border bg-terracotta/5'
                      : isCurrentMonth
                      ? 'border-notion-border/60 hover:bg-notion-hover/40'
                      : 'border-transparent opacity-30 bg-notion-sidebar/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                        isTodayDate
                          ? 'bg-terracotta text-white'
                          : 'text-notion-text'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] text-terracotta font-mono font-bold">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => {
                      let tagBg = 'bg-[#EDF3F7] text-[#235479] dark:bg-[#162635] dark:text-[#8EB9DD] border-[#BED2E2] dark:border-[#243D53]';
                      if (ev.type === 'interview') {
                        tagBg = 'bg-[#F5EEF6] text-[#6A3E6F] dark:bg-[#2B1B2D] dark:text-[#CB97D2] border-[#DECEE0] dark:border-[#4B2E4F]';
                      } else if (ev.type === 'deadline') {
                        tagBg = 'bg-[#F9F3E8] text-[#8A5B18] dark:bg-[#2B2214] dark:text-[#E5B564] border-[#E8D7B8] dark:border-[#4A3A22]';
                      }

                      return (
                        <div
                          key={ev.id}
                          className={`text-[10px] truncate px-1 py-0.2 rounded font-medium border ${tagBg}`}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-notion-muted font-bold pl-1 italic">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-notion-card border border-notion-border rounded-xl p-5 shadow-warm-sm space-y-4">
          <div className="border-b border-notion-border/60 pb-3">
            <span className="text-[11px] uppercase tracking-wider font-bold text-terracotta">
              Selected Agenda
            </span>
            <div className="text-lg font-display font-semibold text-notion-text">
              {format(selectedDay, 'EEEE, MMM d, yyyy')}
            </div>
          </div>

          {selectedDayEvents.length === 0 ? (
            <div className="py-12 text-center text-xs text-notion-muted space-y-2">
              <p className="italic">Nothing scheduled for this date.</p>
              <button
                onClick={() => {
                  addTask({
                    title: 'New milestone task',
                    dueDate: selectedDayKey
                  });
                }}
                className="text-terracotta font-semibold hover:underline text-xs"
              >
                + Schedule a task for this day
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {selectedDayEvents.map(ev => {
                return (
                  <div
                    key={ev.id}
                    onClick={() => {
                      if (ev.jobId) navigate(`/jobs/${ev.jobId}`);
                      else navigate('/tasks');
                    }}
                    className="p-3 rounded-lg border border-notion-border hover:border-terracotta/60 hover:bg-notion-hover/40 transition-all cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-bold tracking-wider bg-notion-hover text-notion-muted">
                        {ev.type}
                      </span>
                      {ev.time && (
                        <span className="text-xs text-notion-muted font-mono flex items-center gap-1">
                          <Clock size={11} />
                          {ev.time}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-notion-text group-hover:text-terracotta transition-colors">
                      {ev.title}
                    </div>

                    {ev.subtitle && (
                      <div className="text-xs text-notion-muted truncate italic">
                        {ev.subtitle}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
