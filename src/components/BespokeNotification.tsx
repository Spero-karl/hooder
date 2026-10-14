import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Flame, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export const BespokeNotification: React.FC = () => {
  const { notification, dismissNotification } = useApp();
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!notification) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const duration = 4500;
    const intervalTime = 45;
    let elapsed = 0;

    const timer = setInterval(() => {
      if (isPaused) return;

      elapsed += intervalTime;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(timer);
        dismissNotification();
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [notification, isPaused, dismissNotification]);

  if (!notification) return null;

  return (
    <div
      className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="bg-[#141514] text-neutral-100 rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.55)] border border-amber-600/30 overflow-hidden backdrop-blur-md">
        {/* Top Header bar with Maison seal */}
        <div className="px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-3 h-3 text-amber-400" />
            </div>
            <span className="text-[10px] font-mono-hooden uppercase tracking-widest text-amber-300 font-bold">
              MAISON HOODEN • COMPTOIR BOIS
            </span>
          </div>

          <button
            onClick={dismissNotification}
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            aria-label="Fermer la notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Notification Main Content */}
        <div className="p-4 sm:p-4.5 flex gap-3.5 items-start">
          {notification.thumbnail ? (
            <div className="relative shrink-0">
              <img
                src={notification.thumbnail}
                alt="Produit sélectionné"
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-amber-900/40 shadow-xs"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-700 text-white flex items-center justify-center text-[9px] font-bold">
                ✓
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-700/40 text-amber-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white tracking-wide font-serif-hooden truncate">
                {notification.title}
              </h4>
              {notification.badge && (
                <span className="text-[9px] font-mono-hooden px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold shrink-0">
                  {notification.badge}
                </span>
              )}
            </div>

            {notification.message && (
              <p className="text-[11px] text-neutral-300 line-clamp-2 mt-1 leading-snug">
                {notification.message}
              </p>
            )}

            {notification.actionLabel && notification.onAction && (
              <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                <button
                  onClick={() => {
                    notification.onAction?.();
                    dismissNotification();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer group"
                >
                  <span>{notification.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <span className="text-[10px] text-neutral-500 font-mono-hooden">
                  Livraison offerte
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Micro progress indicator */}
        <div className="h-0.5 bg-neutral-800/50 w-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
