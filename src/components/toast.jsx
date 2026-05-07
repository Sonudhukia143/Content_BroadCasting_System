import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-pulse transition-all ${toast.type === 'success'
                            ? 'bg-green-500'
                            : toast.type === 'error'
                                ? 'bg-red-500'
                                : toast.type === 'warning'
                                    ? 'bg-yellow-500'
                                    : 'bg-blue-500'
                        }`}
                >
                    <div className="flex items-center justify-between gap-4">
                        <span>
                            {toast.type === 'success' && '✓ '}
                            {toast.type === 'error' && '✗ '}
                            {toast.type === 'warning' && '⚠ '}
                            {toast.message}
                        </span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-white hover:opacity-80"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
