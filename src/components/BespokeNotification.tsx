import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check } from 'lucide-react';

export const BespokeNotification: React.FC = () => {
  const { notification, dismissNotification, setIsCartOpen } = useApp();

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      dismissNotification();
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification, dismissNotification]);

  if (!notification) return null;

  const handleAction = () => {
    if (notification.onAction) {
      notification.onAction();
    } else {
      setIsCartOpen(true);
    }
    dismissNotification();
  };

  return (
    <aside
      aria-label="Notification de commande"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100%-3rem)] animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="bg-white border border-neutral-200 rounded-xl shadow-xl p-3.5 flex items-center gap-3 text-neutral-900">
        {notification.thumbnail ? (
          <img
            src={notification.thumbnail}
            alt="Produit sélectionné"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-neutral-200"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
        )}

        <div className="flex-1 min-w-0 pr-1">
          <div className="text-xs font-bold text-neutral-900 truncate">
            {notification.title}
          </div>
          {notification.message && (
            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
              {notification.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAction}
            className="text-xs font-semibold text-amber-900 hover:text-amber-800 underline underline-offset-2 transition-colors cursor-pointer px-1 py-1"
          >
            {notification.actionLabel || 'Voir panier'}
          </button>

          <button
            onClick={dismissNotification}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors cursor-pointer"
            aria-label="Fermer la notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
