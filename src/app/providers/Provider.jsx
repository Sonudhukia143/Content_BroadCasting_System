// providers/Providers.tsx
"use client";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { ToastProvider, ToastContainer } from "@/components/toast.jsx";

export function Providers({ children }) {
    return (
        <AuthProvider>
            <ToastProvider>
                {children}
                <ToastContainer />
            </ToastProvider>
        </AuthProvider>
    );
}
