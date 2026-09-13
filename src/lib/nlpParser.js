import { addDays, nextDay, format, parse, isValid } from 'date-fns';

const DAY_MAP = {
  sunday: 0,
  sun: 0,
  monday: 1,
  mon: 1,
  tuesday: 2,
  tue: 2,
  wednesday: 3,
  wed: 3,
  thursday: 4,
  thu: 4,
  friday: 5,
  fri: 5,
  saturday: 6,
  sat: 6
};

/**
 * Parses natural language input into structured task or job data.
 * Examples:
 * - "Apply to Google SWE intern tomorrow #applied !high"
 * - "Figma portfolio review next friday at 2pm #design"
 * - "job: Netflix Senior Frontend Engineer #streaming"
 */
export function parseQuickAdd(input) {
  if (!input || !input.trim()) {
    return null;
  }

  let text = input.trim();
  let type = 'task'; // 'task' or 'job'
  let priority = 'medium';
  let dueDate = null;
  let dueTime = null;
  const tags = [];

  // Check if explicitly typed as job:
  if (/^job:\s*/i.test(text)) {
    type = 'job';
    text = text.replace(/^job:\s*/i, '');
  }

  // Extract Tags: #internship #urgent #swe
  const tagMatches = text.match(/#[a-zA-Z0-9_\-]+/g);
  if (tagMatches) {
    tagMatches.forEach(tag => {
      tags.push(tag.toLowerCase());
      text = text.replace(tag, '');
    });
  }

  // Extract Priority: !urgent, !high, !med, !medium, !low, p1, p2, p3
  if (/!(urgent|critical|p1)\b/i.test(text)) {
    priority = 'urgent';
    text = text.replace(/!(urgent|critical|p1)\b/i, '');
  } else if (/!(high|p2)\b/i.test(text)) {
    priority = 'high';
    text = text.replace(/!(high|p2)\b/i, '');
  } else if (/!(med|medium|p3)\b/i.test(text)) {
    priority = 'medium';
    text = text.replace(/!(med|medium|p3)\b/i, '');
  } else if (/!(low|p4)\b/i.test(text)) {
    priority = 'low';
    text = text.replace(/!(low|p4)\b/i, '');
  }

  // Extract Time: "at 2pm", "at 14:30", "at 10:00am"
  const timeMatch = text.match(/\bat\s+(\d{1,2}(?::\d{2})?(?:am|pm)?|\d{1,2}:\d{2})\b/i);
  if (timeMatch) {
    const rawTime = timeMatch[1].toLowerCase();
    text = text.replace(timeMatch[0], '');
    
    // Parse time
    let hours = 12;
    let minutes = 0;
    if (rawTime.includes(':')) {
      const parts = rawTime.replace(/(am|pm)/, '').split(':');
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10) || 0;
    } else {
      hours = parseInt(rawTime.replace(/(am|pm)/, ''), 10);
    }

    if (rawTime.includes('pm') && hours < 12) hours += 12;
    if (rawTime.includes('am') && hours === 12) hours = 0;

    dueTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const now = new Date();

  // 1. "today" / "tonight"
  if (/\b(today|tonight)\b/i.test(text)) {
    dueDate = format(now, 'yyyy-MM-dd');
    text = text.replace(/\b(today|tonight)\b/i, '');
  }
  // 2. "tomorrow" / "tmrw"
  else if (/\b(tomorrow|tmrw)\b/i.test(text)) {
    dueDate = format(addDays(now, 1), 'yyyy-MM-dd');
    text = text.replace(/\b(tomorrow|tmrw)\b/i, '');
  }
  // 3. "in (\d+) days?"
  else if (/\bin\s+(\d+)\s+days?\b/i.test(text)) {
    const match = text.match(/\bin\s+(\d+)\s+days?\b/i);
    const days = parseInt(match[1], 10);
    dueDate = format(addDays(now, days), 'yyyy-MM-dd');
    text = text.replace(match[0], '');
  }
  // 4. "in (\d+) weeks?"
  else if (/\bin\s+(\d+)\s+weeks?\b/i.test(text)) {
    const match = text.match(/\bin\s+(\d+)\s+weeks?\b/i);
    const weeks = parseInt(match[1], 10);
    dueDate = format(addDays(now, weeks * 7), 'yyyy-MM-dd');
    text = text.replace(match[0], '');
  }
  // 5. "next (monday|tuesday|...)"
  else if (/\bnext\s+(sunday|sun|monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat)\b/i.test(text)) {
    const match = text.match(/\bnext\s+(sunday|sun|monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat)\b/i);
    const targetDayIndex = DAY_MAP[match[1].toLowerCase()];
    // Next week's instance
    const nextDate = nextDay(addDays(now, 1), targetDayIndex);
    dueDate = format(nextDate, 'yyyy-MM-dd');
    text = text.replace(match[0], '');
  }
  // 6. "this (monday|friday...)" or "on (friday...)" or just day name
  else if (/\b(?:this\s+|on\s+)?(sunday|sun|monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat)\b/i.test(text)) {
    const match = text.match(/\b(?:this\s+|on\s+)?(sunday|sun|monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat)\b/i);
    const targetDayIndex = DAY_MAP[match[1].toLowerCase()];
    const nextDate = nextDay(now, targetDayIndex);
    dueDate = format(nextDate, 'yyyy-MM-dd');
    text = text.replace(match[0], '');
  }

  // Clean remaining text
  let title = text.replace(/\s+/g, ' ').trim();
  // Remove trailing prepositions if date was removed (e.g. "due on", "apply for ... by")
  title = title.replace(/\b(due|by|on|at)$/i, '').trim();

  // If title is empty, fallback to original trimmed input
  if (!title) {
    title = input.trim();
  }

  return {
    raw: input,
    title,
    type,
    priority,
    dueDate,
    dueTime,
    tags
  };
}
