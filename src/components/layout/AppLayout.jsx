import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import CommandPalette from '../common/CommandPalette';
import ToastContainer from '../common/ToastContainer';
import { Menu, X } from 'lucide-react';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-notion-bg text-notion-text font-sans selection:bg-blue-100 dark:selection:bg-blue-900/40">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64 max-w-[80vw] h-full shadow-2xl z-50">
            <Sidebar collapsed={false} setCollapsed={() => setMobileMenuOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40 backdrop-blur-xs z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-notion-border bg-notion-sidebar sticky top-0 z-20">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 rounded text-notion-muted hover:text-notion-text hover:bg-notion-hover"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-sm">Notion Flow</span>
          <div className="w-5" />
        </header>

        {/* Page View Viewport */}
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CommandPalette />
      <ToastContainer />
    </div>
  );
}
