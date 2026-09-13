// Database & Storage layer for Aura (LocalStorage persistence)
const STORAGE_KEY = 'aura_career_os_db_v2';

// Seed data: warm, realistic, professional tech career & internship prep data
export const SAMPLE_DATA = {
  tasks: [
    {
      id: 'task-1',
      title: 'Review System Design architecture notes for Google screen',
      completed: false,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      dueTime: '14:00',
      priority: 'high',
      tags: ['#interview', '#systems'],
      parentId: null,
      jobId: 'job-1',
      recurring: 'none',
      notes: 'Focus on distributed caching, Redis eviction policies, and rate-limiting algorithms.'
    },
    {
      id: 'task-1-1',
      title: 'Read ByteByteGo Token Bucket rate limiter chapter',
      completed: true,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      dueDate: null,
      dueTime: null,
      priority: 'medium',
      tags: ['#systems'],
      parentId: 'task-1',
      jobId: 'job-1',
      recurring: 'none',
      notes: ''
    },
    {
      id: 'task-1-2',
      title: 'Implement LeetCode 23: Merge k Sorted Lists',
      completed: false,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '18:00',
      priority: 'urgent',
      tags: ['#coding', '#dsa'],
      parentId: 'task-1',
      jobId: 'job-1',
      recurring: 'none',
      notes: 'Min-heap O(N log k) optimal solution.'
    },
    {
      id: 'task-2',
      title: 'Complete Stripe Frontend Take-Home Assessment',
      completed: false,
      completedAt: null,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      dueTime: '23:59',
      priority: 'urgent',
      tags: ['#stripe', '#coding'],
      parentId: null,
      jobId: 'job-2',
      recurring: 'none',
      notes: 'Deliverable: Responsive payment dashboard widget with unit tests in Vitest.'
    },
    {
      id: 'task-3',
      title: 'Tailor resume for Ramp Backend Engineering Intern',
      completed: true,
      completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      dueDate: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      dueTime: null,
      priority: 'medium',
      tags: ['#resume', '#internship'],
      parentId: null,
      jobId: 'job-3',
      recurring: 'none',
      notes: 'Emphasize Postgres query optimization and Kafka pipeline project.'
    },
    {
      id: 'task-4',
      title: 'Daily LeetCode Problem of the Day',
      completed: true,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '10:00',
      priority: 'medium',
      tags: ['#daily', '#coding'],
      parentId: null,
      jobId: null,
      recurring: 'daily',
      notes: 'Maintain consistency and algorithmic recall.'
    },
    {
      id: 'task-5',
      title: 'Send follow-up thank you email to Linear design team',
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      dueTime: '11:00',
      priority: 'low',
      tags: ['#networking'],
      parentId: null,
      jobId: 'job-4',
      recurring: 'none',
      notes: 'Mention the thoughtful discussion regarding client-side optimistic UI updates.'
    }
  ],

  codingChallenges: [
    {
      id: 'code-1',
      title: 'LeetCode 23: Merge k Sorted Lists',
      category: 'DSA',
      difficulty: 'Hard',
      pattern: 'Heap / Priority Queue',
      status: 'In Progress',
      company: 'Google',
      lastPracticed: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      link: 'https://leetcode.com/problems/merge-k-sorted-lists/',
      notes: 'Use a min-heap to keep track of current minimum element across k heads. O(N log k) time and O(k) auxiliary memory.'
    },
    {
      id: 'code-2',
      title: 'Design Distributed Rate Limiter',
      category: 'System Design',
      difficulty: 'Medium',
      pattern: 'Token Bucket & Redis Lua',
      status: 'Solved',
      company: 'Google',
      lastPracticed: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      link: '',
      notes: 'Atomic Redis Lua scripts prevent race conditions in distributed multi-node clusters. Sliding window log fallback.'
    },
    {
      id: 'code-3',
      title: 'LeetCode 146: LRU Cache',
      category: 'DSA',
      difficulty: 'Medium',
      pattern: 'Doubly Linked List + Hash Map',
      status: 'Solved',
      company: 'Ramp',
      lastPracticed: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
      link: 'https://leetcode.com/problems/lru-cache/',
      notes: 'O(1) get and put using hash map mapping keys to doubly linked list nodes.'
    },
    {
      id: 'code-4',
      title: 'Stripe Take-Home: Payment Stream Engine',
      category: 'Take-Home',
      difficulty: 'Medium',
      pattern: 'State & Async Debounce',
      status: 'In Progress',
      company: 'Stripe',
      lastPracticed: new Date().toISOString().split('T')[0],
      link: '',
      notes: 'Implementing accessible currency selector with WebSocket exchange rate ticks and Vitest coverage.'
    },
    {
      id: 'code-5',
      title: 'LeetCode 76: Minimum Window Substring',
      category: 'DSA',
      difficulty: 'Hard',
      pattern: 'Sliding Window',
      status: 'Review Needed',
      company: 'Google',
      lastPracticed: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0],
      link: 'https://leetcode.com/problems/minimum-window-substring/',
      notes: 'Two pointers with frequency map. Expand right until valid, contract left until invalid to record minimum window.'
    },
    {
      id: 'code-6',
      title: 'Linear Offline Sync Engine: CRDT Architecture',
      category: 'System Design',
      difficulty: 'Hard',
      pattern: 'Event Sourcing & IndexedDB',
      status: 'Solved',
      company: 'Linear',
      lastPracticed: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      link: '',
      notes: 'Conflict-free replicated data types for collaborative multi-user editing with client-first offline mutations.'
    }
  ],

  jobs: [
    {
      id: 'job-1',
      company: 'Google',
      role: 'Software Engineering Intern (Summer 2026)',
      stage: 'interview',
      dateApplied: new Date(Date.now() - 86400000 * 18).toISOString().split('T')[0],
      deadline: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      interviewDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] + 'T14:30',
      location: 'Mountain View, CA (Hybrid)',
      salary: '$58 / hr + Housing Stipend',
      jobUrl: 'https://careers.google.com/jobs/results/',
      resumeVersion: 'Resume_SWE_Systems_v4.2.pdf',
      tags: ['Tier-1', 'Big Tech', 'C++ / Go'],
      recruiter: {
        name: 'Sarah Chen',
        email: 'schen-recruiting@google.com',
        linkedin: 'https://linkedin.com'
      },
      notes: `### Interview Process Notes:
- Round 1 (Cleared): Online Technical Assessment (2 LC Mediums on Graph DFS & Sliding Window)
- Round 2 (Upcoming): 45-min Live Coding with Staff SWE. Topics: Data structures & Concurrency.
- Round 3: Systems Architecture & Team Match conversation.

Core Stack:
Go, C++, Spanner, Protobuf, Kubernetes.`,
      timeline: [
        {
          id: 'tl-1',
          stage: 'applied',
          note: 'Submitted application via employee referral from Alex K.',
          timestamp: new Date(Date.now() - 86400000 * 18).toISOString()
        },
        {
          id: 'tl-2',
          stage: 'oa',
          note: 'Passed 90-minute HackerRank assessment with 100% test cases.',
          timestamp: new Date(Date.now() - 86400000 * 10).toISOString()
        },
        {
          id: 'tl-3',
          stage: 'interview',
          note: 'Scheduled 1st technical screen with Staff SWE.',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ],
      followUpDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0]
    },
    {
      id: 'job-2',
      company: 'Stripe',
      role: 'Frontend Engineering Intern',
      stage: 'oa',
      dateApplied: new Date(Date.now() - 86400000 * 8).toISOString().split('T')[0],
      deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      interviewDate: null,
      location: 'San Francisco, CA or Remote',
      salary: '$62 / hr + Relocation',
      jobUrl: 'https://stripe.com/jobs',
      resumeVersion: 'Resume_Frontend_React_TypeScript.pdf',
      tags: ['Fintech', 'React', 'Design Systems'],
      recruiter: {
        name: 'Marcus Vance',
        email: 'marcusv@stripe.com',
        linkedin: 'https://linkedin.com'
      },
      notes: `### Stripe Take-home Checklist:
- Build an interactive billing currency toggle component.
- Ensure strict TypeScript typing and WCAG AA accessibility.
- Polish animations to match signature silky-smooth design aesthetic.`,
      timeline: [
        {
          id: 'tl-4',
          stage: 'applied',
          note: 'Applied through early careers portal.',
          timestamp: new Date(Date.now() - 86400000 * 8).toISOString()
        },
        {
          id: 'tl-5',
          stage: 'oa',
          note: 'Received take-home project with 5-day completion window.',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ],
      followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
    },
    {
      id: 'job-3',
      company: 'Ramp',
      role: 'Backend Engineering Intern',
      stage: 'applied',
      dateApplied: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
      deadline: null,
      interviewDate: null,
      location: 'New York, NY (In-person)',
      salary: '$60 / hr',
      jobUrl: 'https://ramp.com/careers',
      resumeVersion: 'Resume_SWE_Backend_Python.pdf',
      tags: ['Fintech', 'Python', 'Fast Growth'],
      recruiter: {
        name: 'Elena Rostova',
        email: 'elena@ramp.com',
        linkedin: 'https://linkedin.com'
      },
      notes: `Applied for the Card Transactions pipeline infrastructure team. Mentioned high throughput data processing experience with FastAPI and PostgreSQL.`,
      timeline: [
        {
          id: 'tl-6',
          stage: 'applied',
          note: 'Application submitted via Ramp university recruiting.',
          timestamp: new Date(Date.now() - 86400000 * 4).toISOString()
        }
      ],
      followUpDate: null
    },
    {
      id: 'job-4',
      company: 'Linear',
      role: 'Product Engineering Intern',
      stage: 'interview',
      dateApplied: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
      deadline: null,
      interviewDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0] + 'T16:00',
      location: 'Remote (Worldwide)',
      salary: '$55 / hr + Tech Stipend',
      jobUrl: 'https://linear.app/careers',
      resumeVersion: 'Resume_Linear_Product_Engineer.pdf',
      tags: ['Product', 'Desktop', 'TypeScript'],
      recruiter: {
        name: 'Tuomas Artman',
        email: 'jobs@linear.app',
        linkedin: 'https://linear.app'
      },
      notes: `### Interview Topics:
- Deep dive into offline sync engine using IndexedDB and WebSocket crdts.
- Performance profiling of React re-renders in large virtualized lists.`,
      timeline: [
        {
          id: 'tl-7',
          stage: 'applied',
          note: 'Sent custom product demo and cold email.',
          timestamp: new Date(Date.now() - 86400000 * 14).toISOString()
        },
        {
          id: 'tl-8',
          stage: 'interview',
          note: 'Invited to Pair Programming session with Core Team.',
          timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
        }
      ],
      followUpDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
    },
    {
      id: 'job-5',
      company: 'Figma',
      role: 'Systems / WebAssembly Intern',
      stage: 'wishlist',
      dateApplied: '',
      deadline: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0],
      interviewDate: null,
      location: 'San Francisco, CA',
      salary: '$65 / hr',
      jobUrl: 'https://figma.com/careers',
      resumeVersion: 'Resume_Systems_Rust_Wasm.pdf',
      tags: ['C++', 'Rust', 'Graphics', 'Wasm'],
      recruiter: {
        name: 'Devin Cole',
        email: 'dcole@figma.com',
        linkedin: 'https://linkedin.com'
      },
      notes: `Application deadline is in 9 days. Polish the WebGL canvas renderer demo project on GitHub before submitting.`,
      timeline: [
        {
          id: 'tl-9',
          stage: 'wishlist',
          note: 'Added to wishlist after finding requisition opening.',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ],
      followUpDate: null
    },
    {
      id: 'job-6',
      company: 'Anthropic',
      role: 'Frontend Infrastructure Intern',
      stage: 'offer',
      dateApplied: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0],
      deadline: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0],
      interviewDate: null,
      location: 'San Francisco, CA (In-person)',
      salary: '$68 / hr + Housing + Relocation',
      jobUrl: 'https://anthropic.com/careers',
      resumeVersion: 'Resume_Frontend_Perf.pdf',
      tags: ['AI Research', 'Frontend', 'High Impact'],
      recruiter: {
        name: 'Chloe Zhang',
        email: 'chloe@anthropic.com',
        linkedin: 'https://linkedin.com'
      },
      notes: `### Formal Offer Received
- Base: $68/hour ($10,880/mo)
- Housing: $2,500/mo post-tax stipend
- Relocation: Flight + 2 weeks hotel
- Decision Window: 12 days remaining.`,
      timeline: [
        {
          id: 'tl-10',
          stage: 'applied',
          note: 'Applied online.',
          timestamp: new Date(Date.now() - 86400000 * 30).toISOString()
        },
        {
          id: 'tl-11',
          stage: 'interview',
          note: 'Completed 3 back-to-back virtual onsite rounds.',
          timestamp: new Date(Date.now() - 86400000 * 10).toISOString()
        },
        {
          id: 'tl-12',
          stage: 'offer',
          note: 'Received formal written offer letter.',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ],
      followUpDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0]
    }
  ],

  notes: [
    {
      id: 'note-1',
      title: 'Google Technical Screen Preparation Dossier',
      icon: 'code',
      tags: ['#interview', '#google', '#systems'],
      linkedJobId: 'job-1',
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      content: `# Google SWE Interview Master Plan

## 1. Algorithmic Patterns to Drill:
- Trie + Backtracking: Word Search II, Prefix Auto-complete.
- Topological Sort: Course Schedule II, Build Order dependencies.
- Dijkstra & A*: Network delay time, shortest path in grid with obstacles.
- Union-Find (Disjoint Set): Redundant connection, number of islands II.

## 2. Clarifying Questions to Ask in Round 1:
- What are the input constraints (N <= 10^5, memory limitations)?
- Can inputs contain negative numbers, duplicate values, or empty strings?
- Are we optimizing for lowest peak memory or minimum latency?

Rule of Thumb: Speak aloud constantly. Start with a brute force O(N^2) solution in 2 minutes before proposing the O(N log N) heap or two-pointer approach.`
    },
    {
      id: 'note-2',
      title: 'Behavioral STAR Framework Answers',
      icon: 'file',
      tags: ['#behavioral', '#career'],
      linkedJobId: null,
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      content: `# Behavioral Interview STAR Stories

### Story 1: Handling a Production Outage (Ownership & Composure)
- Situation: Redis cache cluster ran out of memory during Black Friday traffic spike.
- Task: Restore service immediately and prevent cascade failure to primary database.
- Action: Triaged memory keys, applied LRU eviction policy on volatile session keys, and implemented circuit breaker fallback in API layer.
- Result: Downtime capped to 4 minutes; saved an estimated $40k in cart transactions.

### Story 2: Disagree and Commit on Technical Architecture
- Discussed GraphQL vs REST for the client API overhaul. Championed REST + tRPC for strict type safety and reduced bundling size.`
    }
  ],

  activityLog: [
    {
      id: 'act-1',
      type: 'job_status_change',
      title: 'Offer received from Anthropic',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      details: 'Stage advanced from Interview to Offer.',
      link: '/jobs/job-6'
    },
    {
      id: 'act-2',
      type: 'job_status_change',
      title: 'Google SWE interview scheduled',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      details: 'Stage: Interview (Round 2: Live Technical Screen)',
      link: '/jobs/job-1'
    },
    {
      id: 'act-3',
      type: 'task_completed',
      title: 'Completed "Tailor resume for Ramp Backend Engineering Intern"',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      details: 'Task marked as done',
      link: '/tasks'
    },
    {
      id: 'act-4',
      type: 'job_created',
      title: 'Added Stripe Frontend Intern application',
      timestamp: new Date(Date.now() - 86400000 * 8).toISOString(),
      details: 'Stage: Applied',
      link: '/jobs/job-2'
    }
  ],

  settings: {
    theme: 'light',
    sidebarCollapsed: false,
    autoArchiveDays: 7,
    notificationsEnabled: true
  }
};

/**
 * Loads entire database from LocalStorage, falling back to SAMPLE_DATA.
 */
export function loadDatabase() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveDatabase(SAMPLE_DATA);
      return SAMPLE_DATA;
    }
    const parsed = JSON.parse(raw);
    const rawJobs = Array.isArray(parsed.jobs) ? parsed.jobs : SAMPLE_DATA.jobs;
    const sanitizedJobs = rawJobs.map(j => {
      if (j.interviewDate && typeof j.interviewDate === 'string') {
        const cleaned = j.interviewDate.replace(/T(\d{2}:\d{2}).*/, 'T$1');
        return { ...j, interviewDate: cleaned };
      }
      return j;
    });

    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : SAMPLE_DATA.tasks,
      codingChallenges: Array.isArray(parsed.codingChallenges) ? parsed.codingChallenges : SAMPLE_DATA.codingChallenges,
      jobs: sanitizedJobs,
      notes: Array.isArray(parsed.notes) ? parsed.notes : SAMPLE_DATA.notes,
      activityLog: Array.isArray(parsed.activityLog) ? parsed.activityLog : SAMPLE_DATA.activityLog,
      settings: { ...SAMPLE_DATA.settings, ...(parsed.settings || {}) }
    };
  } catch (err) {
    console.error('Failed to load database from LocalStorage:', err);
    return SAMPLE_DATA;
  }
}

/**
 * Saves database to LocalStorage synchronously.
 */
export function saveDatabase(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Failed to save to LocalStorage:', err);
    return false;
  }
}

/**
 * Creates a debounced version of a function.
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Exports current database as a downloadable JSON file.
 */
export function exportDatabaseJSON(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  anchor.href = url;
  anchor.download = `todo-backup-${dateStr}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Imports database JSON file with validation.
 */
export function parseImportedJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON format');
    }
    if (!Array.isArray(parsed.tasks) || !Array.isArray(parsed.jobs)) {
      throw new Error('Missing required tasks or jobs structure');
    }
    return {
      tasks: parsed.tasks,
      codingChallenges: Array.isArray(parsed.codingChallenges) ? parsed.codingChallenges : SAMPLE_DATA.codingChallenges,
      jobs: parsed.jobs,
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
      activityLog: Array.isArray(parsed.activityLog) ? parsed.activityLog : [],
      settings: parsed.settings || SAMPLE_DATA.settings
    };
  } catch (err) {
    throw new Error(`Import failed: ${err.message}`);
  }
}
