'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext.jsx'
import { Button } from '@/components/ui/button.jsx'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) {
    return null
  }

  const dashboardLink = user.role === 'teacher' ? '/teacher/dashboard' : '/principal/dashboard'

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={dashboardLink} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="font-bold text-blue-600">CB</span>
              </div>
              <span className="font-bold text-xl">Content Broadcast</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              {user.role === 'teacher' ? '👨‍🏫 Teacher' : '👔 Principal'}
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}