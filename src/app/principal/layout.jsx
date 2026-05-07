'use client';
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({ children }) {
    return <ProtectedRoute role='principal'>
        {children}
    </ProtectedRoute>
}