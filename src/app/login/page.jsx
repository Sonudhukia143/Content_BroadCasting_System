'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setError('')
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-50">

            <Card className="w-full max-w-md">

                <CardHeader>

                    <CardTitle>Login</CardTitle>

                    <CardDescription>Enter your credentials to access the system</CardDescription>

                </CardHeader>

                <CardContent>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>

                            <label className="block text-sm font-medium">Email</label>

                            <Input

                                type="email"

                                value={email}

                                onChange={(e) => setEmail(e.target.value)}

                                required

                            />

                        </div>

                        <div>

                            <label className="block text-sm font-medium">Password</label>

                            <Input

                                type="password"

                                value={password}

                                onChange={(e) => setPassword(e.target.value)}

                                required

                            />

                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <Button type="submit" disabled={loading} className="w-full">

                            {loading ? 'Logging in...' : 'Login'}

                        </Button>

                    </form>

                    <p className="mt-4 text-sm text-center">

                        Teacher: teacher@example.com / pass<br />

                        Principal: principal@example.com / pass

                    </p>

                </CardContent>

            </Card>

        </div>

    )

}