'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getContentByTeacher } from '@/services/content.service.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useAuth } from '@/context/AuthContext';

export default function MyContentPage() {
  const { teacherId } = useParams();
  const { content, setContent } = useAuth();
  const [loading, setLoading] = useState(content ? false : true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (content === null) {
      getContentByTeacher(teacherId)
        .then(setContent)
        .finally(() => setLoading(false));
    }
  }, [content, setContent, teacherId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          Loading your content...
        </div>
      </div>
    );
  }

  // Filter content based on selected status
  const filteredContent = content
    ? filter === 'all'
      ? content
      : content.filter(c => c.status === filter)
    : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">✓ Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">✗ Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'border-l-4 border-green-500 bg-green-50';
      case 'pending':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'rejected':
        return 'border-l-4 border-red-500 bg-red-50';
      default:
        return 'border-l-4 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Content</h1>
          <p className="text-gray-600">View and manage your uploaded educational content</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
          >
            All Content ({content?.length || 0})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'pending'
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-yellow-300'
              }`}
          >
            Pending ({content?.filter(c => c.status === 'pending').length || 0})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'approved'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
              }`}
          >
            Approved ({content?.filter(c => c.status === 'approved').length || 0})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'rejected'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
              }`}
          >
            Rejected ({content?.filter(c => c.status === 'rejected').length || 0})
          </button>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          {filteredContent.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-12">
                <div className="text-center">
                  <p className="text-2xl mb-2">📭</p>
                  <p className="text-gray-600 text-lg">
                    {filter === 'all'
                      ? 'No content uploaded yet'
                      : `No ${filter} content`}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {filter === 'all'
                      ? 'Start by uploading some educational content'
                      : `Try changing the filter to see other content`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredContent.map((item) => (
              <Card
                key={item.id}
                className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${getStatusColor(
                  item.status
                )}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                      <CardDescription className="text-base">
                        Subject: <span className="font-semibold text-gray-700">{item.subject}</span>
                      </CardDescription>
                    </div>
                    <div>{getStatusBadge(item.status)}</div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  {item.description && (
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Description:</span> {item.description}
                      </p>
                    </div>
                  )}

                  {/* Schedule Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white bg-opacity-50 p-3 rounded border border-gray-200">
                      <p className="text-gray-600">
                        <span className="font-semibold">Start Time:</span>
                      </p>
                      <p className="text-gray-800 font-mono">
                        {new Date(item.startTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-50 p-3 rounded border border-gray-200">
                      <p className="text-gray-600">
                        <span className="font-semibold">End Time:</span>
                      </p>
                      <p className="text-gray-800 font-mono">
                        {new Date(item.endTime).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Rotation Duration */}
                  {item.rotationDuration && (
                    <div className="text-sm">
                      <p className="text-gray-600">
                        <span className="font-semibold">Rotation Duration:</span> {item.rotationDuration} minutes
                      </p>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {item.status === 'rejected' && item.rejectionReason && (
                    <div className="bg-red-100 border border-red-300 rounded p-4 mt-4">
                      <p className="text-red-900 font-semibold mb-2">❌ Rejection Reason:</p>
                      <p className="text-red-800">{item.rejectionReason}</p>
                    </div>
                  )}

                  {/* Status Timeline */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      {item.status === 'approved' && (
                        <span className="text-sm text-green-700 font-semibold">✓ Your content has been approved!</span>
                      )}
                      {item.status === 'pending' && (
                        <span className="text-sm text-yellow-700 font-semibold">⏳ Waiting for principal approval</span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="text-sm text-red-700 font-semibold">✗ Content rejected by principal</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}