'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext.jsx'
import { Button } from '@/components/ui/button.jsx'

export default function Home() {

  const { user, loading } = useAuth()

  const router = useRouter()

  useEffect(() => {

    if (!loading && user) {

      if (user.role === 'teacher') {

        router.push('/teacher/dashboard')

      } else if (user.role === 'principal') {

        router.push('/principal/dashboard')

      }

    }

  }, [user, loading, router])

  if (loading) return <div>Loading...</div>

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="text-center">

        <h1 className="text-3xl font-bold mb-4">Content Broadcasting System</h1>

        <p className="mb-6">Please log in to continue</p>

        <Link href="/login">

          <Button>Login</Button>

        </Link>

      </div>

    </div>

  )

}
