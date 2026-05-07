'use client';
import ProtectedRoute from "@/components/ProtectedRoute";
import { useParams } from "next/navigation";

export default function Layout({ children }) {
    const { teacherId } = useParams();

    return <ProtectedRoute role={teacherId}>
        {children}
    </ProtectedRoute>
}