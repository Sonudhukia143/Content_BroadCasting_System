'use client';
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { getAllContent } from '@/services/content.service.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select } from '@/components/ui/select.jsx'
import { useAuth } from '@/context/AuthContext';

export default function AllContentPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const { allContent, setAllContent } = useAuth();
  const [contentLoading, setLoading] = useState(allContent ? false : true);

  useEffect(() => {
    if (allContent !== null) return; // already loaded
    getAllContent()
      .then(c => setAllContent(c))
      .finally(() => setLoading(false));
  }, [allContent, setAllContent]);

  // Compute filtered directly – no extra state, no effect
  const filtered = useMemo(() => {
    if (!allContent) return [];
    let result = allContent;
    if (statusFilter) result = result.filter(c => c.status === statusFilter);
    if (search) result = result.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [allContent, statusFilter, search]);

  const getStatusBadge = (status) => {
    if (status === 'approved') return <Badge variant="success">✓ Approved</Badge>
    if (status === 'pending') return <Badge variant="warning">⏳ Pending</Badge>
    if (status === 'rejected') return <Badge variant="danger">✗ Rejected</Badge>
  }

  if (contentLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">All Content</h1>
              <p className="text-gray-600">Browse and filter all submitted content</p>
            </div>
            <Link href="/principal">
              <Button variant="outline">← Back</Button>
            </Link>
          </div>

          <Card className="border-0 shadow-lg mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Search by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11"
                />
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {filtered.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 text-lg">No content found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(item => (
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

                    <div className="text-xs text-gray-500 space-y-1 bg-gray-50 rounded p-2">
                      <p><strong>Teacher:</strong> {item.teacherId}</p>
                      <p>📅 Start: {new Date(item.startTime).toLocaleString()}</p>
                      <p>📅 End: {new Date(item.endTime).toLocaleString()}</p>
                    </div>

                    {item.status === 'rejected' && item.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded p-2">
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