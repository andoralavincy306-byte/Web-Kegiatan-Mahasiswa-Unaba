import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationState {
  id: string;
  message: string;
  type: NotificationType;
  title?: string;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType, title?: string) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (message: string, type: NotificationType = 'info', title?: string) => {
    // Determine title if not provided
    let defaultTitle = 'Pemberitahuan System';
    if (type === 'success') defaultTitle = 'Berhasil!';
    if (type === 'error') defaultTitle = 'Terjadi Kesalahan';
    if (type === 'warning') defaultTitle = 'Perhatian!';
    if (type === 'info') defaultTitle = 'Informasi Portal';

    setNotification({
      id: Date.now().toString(),
      message,
      type,
      title: title || defaultTitle,
    });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  // Override window.alert globally so native browser alerts show up centered and animated
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message?: any) => {
      const msgString = String(message ?? '');
      // Deduce type based on common keywords
      let type: NotificationType = 'info';
      const lower = msgString.toLowerCase();
      if (lower.includes('berhasil') || lower.includes('approved') || lower.includes('disimpan') || lower.includes('diluncurkan')) {
        type = 'success';
      } else if (lower.includes('gagal') || lower.includes('ditolak') || lower.includes('salah') || lower.includes('terlalu besar')) {
        type = 'error';
      } else if (lower.includes('maaf') || lower.includes('perhatian') || lower.includes('harap') || lower.includes('peringatan') || lower.includes('ditutup')) {
        type = 'warning';
      }

      showNotification(msgString, type);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);

    return () => clearTimeout(timer);
  }, [notification]);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}

      {/* Centered Overlay Toast Notification */}
      <AnimatePresence>
        {notification && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md pointer-events-auto select-none">
            {/* Backdrop click to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={hideNotification}
            />

            {/* Notification Modal Card */}
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className={`relative z-10 w-full max-w-md bg-slate-900 border ${
                notification.type === 'success'
                  ? 'border-emerald-500/50 shadow-[0_20px_50px_rgba(16,185,129,0.25)]'
                  : notification.type === 'error'
                  ? 'border-red-500/50 shadow-[0_20px_50px_rgba(239,68,68,0.25)]'
                  : notification.type === 'warning'
                  ? 'border-amber-500/50 shadow-[0_20px_50px_rgba(245,158,11,0.25)]'
                  : 'border-univ-orange-500/50 shadow-[0_20px_50px_rgba(249,115,22,0.25)]'
              } rounded-3xl p-6 sm:p-7 text-white text-center backdrop-blur-2xl overflow-hidden`}
            >
              {/* Subtle accent light blur in background */}
              <div
                className={`absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none ${
                  notification.type === 'success'
                    ? 'bg-emerald-500'
                    : notification.type === 'error'
                    ? 'bg-red-500'
                    : notification.type === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-univ-orange-500'
                }`}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={hideNotification}
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-full transition-all cursor-pointer"
                aria-label="Tutup Notifikasi"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.05 }}
                  className={`p-4 rounded-2xl flex items-center justify-center ${
                    notification.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40'
                      : notification.type === 'error'
                      ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/40'
                      : notification.type === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40'
                      : 'bg-univ-orange-500/20 text-univ-orange-400 ring-2 ring-univ-orange-500/40'
                  }`}
                >
                  {notification.type === 'success' && <CheckCircle2 className="h-10 w-10" />}
                  {notification.type === 'error' && <XCircle className="h-10 w-10" />}
                  {notification.type === 'warning' && <AlertTriangle className="h-10 w-10" />}
                  {notification.type === 'info' && <Info className="h-10 w-10" />}
                </motion.div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-white tracking-tight mb-2">
                {notification.title}
              </h3>

              {/* Message */}
              <p className="text-sm font-medium text-slate-300 leading-relaxed mb-6 px-2 break-words">
                {notification.message}
              </p>

              {/* Action Button */}
              <button
                type="button"
                onClick={hideNotification}
                className={`w-full py-3.5 px-6 font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 ${
                  notification.type === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                    : notification.type === 'error'
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                    : notification.type === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40'
                    : 'bg-univ-orange-500 hover:bg-univ-orange-600 text-white shadow-orange-900/40'
                }`}
              >
                Mengerti / Ok
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}
