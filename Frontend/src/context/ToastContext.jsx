import { createContext, useContext, useState, useCallback } from "react";

export const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
};

const typeStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
};

const ToastContainer = ({ toasts }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${typeStyles[toast.type] || typeStyles.success} text-white px-5 py-3 rounded-2xl border-2 border-black shadow-lg text-sm font-semibold animate-fade-in-up`}
                >
                    {toast.message}
                </div>
            ))}
        </div>
    );
};
