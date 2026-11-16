import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((message, tone = 'save') => {
    setToast({ message, tone });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 3600);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`toast ${toast ? 'is-visible' : ''} ${toast?.tone === 'remove' ? 'is-remove' : ''} ${toast?.tone === 'info' ? 'is-info' : ''}`} role="status" aria-live="polite">
        <span className="toast-icon">
          <i className={`fa-solid ${toast?.tone === 'remove' ? 'fa-heart-crack' : toast?.tone === 'info' ? 'fa-circle-info' : 'fa-heart'}`} />
        </span>
        <span>{toast?.message || ''}</span>
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
