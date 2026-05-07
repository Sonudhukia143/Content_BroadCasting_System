import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, role }) {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== role)) {
            router.push('/login');
            return
        }
    }, [user, authLoading, router, role]);

    if (authLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return <>{children}</>
}