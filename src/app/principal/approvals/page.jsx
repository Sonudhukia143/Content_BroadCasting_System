'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext.jsx'
import { getAllContent, approveContent, rejectContent } from '@/services/content.service.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Navbar } from '@/components/Navbar.jsx'

export default function ApprovalsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectingId, setRejectingId] = useState(null)
  const [approveAction, setApproveAction] = useState({})

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'principal')) {
      router.push('/login')
      return
    }

    if (user) {
      getAllContent()
        .then(all => setContent(all.filter(c => c.status === 'pending')))
        .finally(() => setLoading(false))
    }
  }, [user, authLoading, router])

  const handleApprove = async (id) => {
    setApproveAction(prev => ({ ...prev, [id]: true }))
    try {
      await approveContent(id)
      setContent(content.filter(c => c.id !== id))
    } finally {
      setApproveAction(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:')
    if (reason) {
      setRejectingId(id)
      try {
        await rejectContent(id, reason)
        setContent(content.filter(c => c.id !== id))
      } finally {
        setRejectingId(null)
      }
    }
  }

  if (authLoading || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Pending Approvals</h1>
              <p className="text-gray-600">Review and approve content submissions</p>
            </div>
            <Link href="/principal/dashboard">
              <Button variant="outline">← Back</Button>
            </Link>
          </div>

          {content.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 text-lg">No pending content to review</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {content.map(item => (
                <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2"></div>
                  <CardHeader>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.subject}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}

                    <div className="bg-gray-50 rounded p-3 space-y-2">
                      <p className="text-xs text-gray-500">
                        <strong>Teacher:</strong> {item.teacherId}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Submitted:</strong> {new Date(item.startTime).toLocaleString()}
                      </p>
                      {item.rotationDuration && (
                        <p className="text-xs text-gray-500">
                          <strong>Duration:</strong> {item.rotationDuration} minutes
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(item.id)}
                        disabled={approveAction[item.id]}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {approveAction[item.id] ? 'Approving...' : '✓ Approve'}
                      </Button>
                      <Button
                        onClick={() => handleReject(item.id)}
                        disabled={rejectingId === item.id}
                        variant="destructive"
                        className="flex-1"
                      >
                        {rejectingId === item.id ? 'Rejecting...' : '✗ Reject'}
                      </Button>
                    </div>
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