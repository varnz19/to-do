import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => {
        let Icon = Info;
        let iconClass = 'text-terracotta';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconClass = 'text-forest dark:text-[#76B992]';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconClass = 'text-[#8A5B18] dark:text-[#E5B564]';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconClass = 'text-rose-600 dark:text-rose-400';
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border border-notion-border bg-notion-card shadow-warm-modal text-notion-text animate-slide-down text-xs sm:text-sm transition-all"
          >
            <Icon size={17} className={`shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-notion-muted hover:text-notion-text p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
