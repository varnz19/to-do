import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Calendar,
  Briefcase,
  Eye,
  Edit3,
  Tag,
  BookOpen,
  Code2,
  Bookmark,
  Terminal,
  Compass
} from 'lucide-react';
import { format } from 'date-fns';

const ICONS = [
  { id: 'file', label: 'Document', icon: FileText },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'terminal', label: 'Terminal', icon: Terminal },
  { id: 'bookmark', label: 'Reference', icon: Bookmark },
  { id: 'compass', label: 'Design', icon: Compass },
];

export default function NotesPage() {
  const { notes, jobs, addNote, updateNote, deleteNote, addToast } = useApp();
  const navigate = useNavigate();

  const [selectedNoteId, setSelectedNoteId] = useState(() => notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('edit');

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      (n.content && n.content.toLowerCase().includes(q)) ||
      (n.tags && n.tags.some(t => t.toLowerCase().includes(q)))
    );
  }, [notes, searchQuery]);

  const activeNote = notes.find(n => n.id === selectedNoteId) || filteredNotes[0] || null;

  const handleCreateNote = () => {
    const created = addNote({
      title: 'Untitled Document',
      icon: 'file',
      content: '# Untitled Document\n\nCapture system design notes, technical questions, or behavioral talking points...',
      tags: ['#notes']
    });
    setSelectedNoteId(created.id);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
      if (selectedNoteId === id) {
        const remaining = notes.filter(n => n.id !== id);
        setSelectedNoteId(remaining[0]?.id || null);
      }
    }
  };

  const handleTitleChange = (val) => {
    if (activeNote) {
      updateNote(activeNote.id, { title: val });
    }
  };

  const handleContentChange = (val) => {
    if (activeNote) {
      updateNote(activeNote.id, { content: val });
    }
  };

  const handleIconChange = (iconId) => {
    if (activeNote) {
      updateNote(activeNote.id, { icon: iconId });
    }
  };

  const handleJobLinkChange = (jobId) => {
    if (activeNote) {
      updateNote(activeNote.id, { linkedJobId: jobId || null });
    }
  };

  const getNoteIcon = (iconName) => {
    const match = ICONS.find(i => i.id === iconName);
    const IconComp = match ? match.icon : FileText;
    return <IconComp size={15} className="text-terracotta shrink-0" />;
  };

  return (
    <div className="h-[calc(100vh-60px)] md:h-screen flex animate-fade-in">
      {/* Left Notes List Pane */}
      <div className="w-76 border-r border-notion-border bg-notion-sidebar flex flex-col shrink-0">
        <div className="p-3.5 border-b border-notion-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-terracotta" />
            <span className="font-display font-semibold text-sm text-notion-text">Workspace Notes</span>
          </div>
          <button
            onClick={handleCreateNote}
            className="p-1 rounded text-notion-muted hover:text-notion-text hover:bg-notion-hover transition-colors"
            title="New Document"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="p-2.5">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-notion-border bg-notion-card text-xs">
            <Search size={13} className="text-terracotta shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-transparent text-notion-text placeholder:text-notion-muted outline-none font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="py-8 text-center text-xs text-notion-muted italic">
              No notes found.
            </div>
          ) : (
            filteredNotes.map(note => {
              const isSelected = activeNote?.id === note.id;
              const linkedJob = note.linkedJobId ? jobs.find(j => j.id === note.linkedJobId) : null;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors space-y-1 ${
                    isSelected
                      ? 'bg-notion-card text-notion-text font-semibold border-l-3 border-terracotta shadow-warm-sm'
                      : 'text-notion-muted hover:text-notion-text hover:bg-notion-hover'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate text-xs">
                    {getNoteIcon(note.icon)}
                    <span className="truncate font-semibold text-notion-text font-display">{note.title || 'Untitled'}</span>
                  </div>

                  {linkedJob && (
                    <div className="text-[10px] text-terracotta font-medium flex items-center gap-1">
                      <Briefcase size={10} />
                      <span className="truncate italic">Linked: {linkedJob.company}</span>
                    </div>
                  )}

                  <div className="text-[10px] text-notion-muted font-mono">
                    {format(new Date(note.updatedAt), 'MMM d, h:mm a')}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Canvas / Editor Area */}
      <div className="flex-1 flex flex-col bg-notion-card overflow-y-auto">
        {activeNote ? (
          <div className="max-w-3xl w-full mx-auto px-8 py-10 space-y-6">
            <div className="flex items-center justify-between border-b border-notion-border/60 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <select
                  value={activeNote.linkedJobId || ''}
                  onChange={e => handleJobLinkChange(e.target.value)}
                  className="bg-transparent border border-notion-border rounded-lg px-2.5 py-1 text-xs text-notion-text outline-none cursor-pointer focus:border-terracotta"
                >
                  <option value="">No linked application</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>Link: {j.company} ({j.role})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-notion-border bg-notion-bg p-0.5 shadow-warm-sm">
                  <button
                    onClick={() => setViewMode('edit')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${
                      viewMode === 'edit' ? 'bg-terracotta text-white shadow-warm-sm' : 'text-notion-muted'
                    }`}
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${
                      viewMode === 'preview' ? 'bg-terracotta text-white shadow-warm-sm' : 'text-notion-muted'
                    }`}
                  >
                    <Eye size={12} /> Preview
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteNote(activeNote.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Delete document"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Note Icon Selector & Title */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {ICONS.map(ic => {
                  const IconC = ic.icon;
                  const isSelected = (activeNote.icon || 'file') === ic.id;
                  return (
                    <button
                      key={ic.id}
                      onClick={() => handleIconChange(ic.id)}
                      className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-colors ${
                        isSelected
                          ? 'border-terracotta bg-terracotta/10 text-terracotta font-semibold'
                          : 'border-notion-border text-notion-muted hover:bg-notion-hover'
                      }`}
                      title={ic.label}
                    >
                      <IconC size={13} />
                      <span className="text-[10px]">{ic.label}</span>
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={activeNote.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Untitled Document"
                className="w-full text-3xl font-display font-semibold text-notion-text bg-transparent outline-none placeholder:text-notion-muted/40 tracking-tight"
              />
            </div>

            {/* Content */}
            {viewMode === 'edit' ? (
              <textarea
                value={activeNote.content}
                onChange={e => handleContentChange(e.target.value)}
                rows={18}
                placeholder="Write notes in markdown... # Heading, - list, > quote, `code`"
                className="w-full bg-transparent text-notion-text text-xs sm:text-sm leading-relaxed outline-none resize-none font-mono placeholder:text-notion-muted/40"
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-3 text-notion-text">
                <div className="whitespace-pre-wrap font-sans bg-notion-bg p-5 rounded-xl border border-notion-border">
                  {activeNote.content}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-notion-muted text-xs space-y-2">
            <p className="italic">Select a document from the left or create a new one.</p>
            <button
              onClick={handleCreateNote}
              className="text-terracotta font-semibold hover:underline text-xs"
            >
              + Create new document
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
