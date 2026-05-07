'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/context/AuthContext.jsx'
import { loginSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'

export default function LoginPage() {
    const { login, user, loading } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur'
    })

    const onSubmit = async (data) => {
        setIsLoading(true)
        setServerError('')
        try {
            const auth = await login(data.email, data.password);
            router.push(`/${auth.role}`)
        } catch (err) {
            setServerError(err.message || 'Invalid email or password')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            router.push(`/${user.role}`)
        }
    }, [user, router]);


    return <>
        {
            !user?.role
                ?
                <>
                    < div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" >
                        < Card className="w-full max-w-md" >
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>Enter your credentials to access the system</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="user@example.com"
                                            className={errors.email ? 'border-red-500' : ''}
                                            {...register('email')}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className={errors.password ? 'border-red-500' : ''}
                                            {...register('password')}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-600">{errors.password.message}</p>
                                        )}
                                    </div>

                                    {/* Server Error */}
                                    {serverError && (
                                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                                            <p className="font-semibold">❌ Login Failed</p>
                                            <p>{serverError}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <Button type="submit" disabled={isLoading} className="w-full">
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </form>

                                {/* Demo Credentials */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                                    <div className="space-y-2 text-xs text-blue-800 font-mono">
                                        <p>👨‍🏫 Teacher 1: teacher1@example.com / pass</p>
                                        <p>👨‍🏫 Teacher 2: teacher2@example.com / pass</p>
                                        <p>👔 Principal: principal@example.com / pass</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card >
                    </div >
                </>
                :
                <h1 className='flex items-center justify-center h-[100vh]'>Loading....</h1>
        }

    </>

}


