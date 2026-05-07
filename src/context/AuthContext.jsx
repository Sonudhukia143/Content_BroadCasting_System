'use client';
import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '@/services/auth.service.jsx'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start with loading true
    const [stats, setStats] = useState(null);
    const [allStats, setAllStats] = useState(null);
    const [content, setContent] = useState(null);
    const [allContent, setAllContent] = useState(null);

    const login = async (email, password) => {
        try {
            const res = await authService.login(email, password)
            setUser({ email, role: res.role })
            localStorage.setItem('token', res.token)
            return res;
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    useEffect(() => {
        // This is if a user revisits page after a login it decides on base of token if a user is valid or not
        const initializeAuth = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const res = await authService.verifyToken(token);
                    setUser({ email: res.email, role: res.role });
                } catch (error) {
                    // Token invalid, clear it
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // whenever there is a change in data whether a approoval or update or upload we can reset stale state from here
    const resetContext = () => {
        setStats(null);
        setAllStats(null);
        setContent(null);
        setAllContent(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, stats, setStats, content, setContent, allContent, setAllContent, allStats, setAllStats, resetContext }}>
            {children}
        </AuthContext.Provider>
    )
}