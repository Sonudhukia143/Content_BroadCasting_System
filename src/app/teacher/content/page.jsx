'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext.jsx'
import { getContentByTeacher } from '@/services/content.service.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Navbar } from '@/components/Navbar.jsx'

export default function MyContentPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'teacher')) {
      router.push('/login')
      return
    }

    if (user) {
      getContentByTeacher('teacher1')
        .then(setContent)
        .finally(() => setLoading(false))
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const getStatusBadge = (status) => {
    if (status === 'approved') return <Badge variant="success">✓ Approved</Badge>
    if (status === 'pending') return <Badge variant="warning">⏳ Pending</Badge>
    if (status === 'rejected') return <Badge variant="danger">✗ Rejected</Badge>
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Content</h1>
              <p className="text-gray-600">View and manage all your uploaded content</p>
            </div>
            <Link href="/teacher/upload">
              <Button className="bg-blue-600 hover:bg-blue-700">📤 Upload New</Button>
            </Link>
          </div>

          {content.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 text-lg mb-4">No content uploaded yet</p>
                <Link href="/teacher/upload">
                  <Button>Upload Your First Content</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map(item => (
                <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2"></div>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.subject}</CardDescription>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>📅 Start: {new Date(item.startTime).toLocaleString()}</p>
                      <p>📅 End: {new Date(item.endTime).toLocaleString()}</p>
                      {item.rotationDuration && (
                        <p>🔄 Rotation: {item.rotationDuration}min</p>
                      )}
                    </div>

                    {item.status === 'rejected' && item.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
                        <p className="text-xs font-semibold text-red-900 mb-1">Rejection Reason:</p>
                        <p className="text-xs text-red-800">{item.rejectionReason}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}