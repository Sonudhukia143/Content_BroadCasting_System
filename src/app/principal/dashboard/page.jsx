'use client';
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext.jsx'
import { useRouter } from 'next/navigation'
import { getAllContent } from '@/services/content.service.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Navbar } from '@/components/Navbar.jsx'

export default function PrincipalDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'principal')) {
      router.push('/login')
      return
    }

    if (user) {
      getAllContent()
        .then(content => {
          const total = content.length
          const pending = content.filter(c => c.status === 'pending').length
          const approved = content.filter(c => c.status === 'approved').length
          const rejected = content.filter(c => c.status === 'rejected').length
          setStats({ total, pending, approved, rejected })
        })
        .finally(() => setLoading(false))
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Principal Dashboard</h1>
            <p className="text-gray-600">Monitor and approve educational content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600">Total Content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600">Pending Review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-600">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600">Approved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">{stats.approved}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <CardDescription className="text-gray-600">Rejected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-600">{stats.rejected}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Review and manage submitted content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/principal/approvals" className="block">
                  <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-lg py-6">
                    ⏳ Review Pending ({stats.pending})
                  </Button>
                </Link>
                <Link href="/principal/content" className="block">
                  <Button variant="outline" className="w-full text-lg py-6">
                    📋 View All Content
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Content approval summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total</span>
                  <Badge>{stats.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <Badge variant="warning">{stats.pending}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Approved</span>
                  <Badge variant="success">{stats.approved}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rejected</span>
                  <Badge variant="danger">{stats.rejected}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}