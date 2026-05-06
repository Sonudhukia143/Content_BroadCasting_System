'use client'

import { createContext, useContext, useState, useEffect } from 'react'

import * as authService from '@/services/auth.service.jsx'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)

    const login = async (email, password) => {

        try {

            const res = await authService.login(email, password)

            setUser({ email, role: res.role })

            localStorage.setItem('token', res.token)

            return true

        } catch (error) {

            throw error

        }

    }

    const logout = () => {

        setUser(null)

        localStorage.removeItem('token')

    }

    useEffect(() => {

        const token = localStorage.getItem('token')

        if (token) {

            // For mock, assume teacher

            setUser({ role: 'teacher', email: 'teacher@example.com' })

        }

        setLoading(false)

    }, [])

    return (

        <AuthContext.Provider value={{ user, login, logout, loading }}>

            {children}

        </AuthContext.Provider>

    )

}