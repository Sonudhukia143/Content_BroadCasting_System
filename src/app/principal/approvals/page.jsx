'use client'
import { useEffect, useState } from 'react'
import { getAllContent, approveContent, rejectContent } from '@/services/content.service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/toast'
import { RejectionModal } from '@/components/RejectionModal'
import { ContentListSkeleton } from '@/components/skeletons'

export default function ApprovalsPage() {
  const { allContent, setAllContent, resetContext } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(allContent ? false : true);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (allContent === null)
      getAllContent()
        .then(all => setAllContent(all.filter(c => c.status === 'pending')))
        .catch(err => {
          addToast('Failed to load pending content', 'error');
          console.error(err);
        })
        .finally(() => setLoading(false));
  }, [setAllContent, allContent, resetContext, addToast]);

  const handleApprove = async (id) => {
    setIsProcessing(true);
    try {
      await approveContent(id);
      addToast('Content approved successfully!', 'success');
      resetContext();
      setLoading(true);
    } catch (err) {
      addToast('Failed to approve content', 'error');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (id) => {
    setSelectedContentId(id);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async (reason) => {
    if (!selectedContentId) return;
    setIsProcessing(true);
    try {
      await rejectContent(selectedContentId, reason);
      addToast('Content rejected successfully', 'success');
      setIsRejectModalOpen(false);
      setSelectedContentId(null);
      resetContext();
      setLoading(true);
    } catch (err) {
      addToast('Failed to reject content', 'error');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pending Approvals</h1>
            <p className="text-gray-600">Review and approve submitted content</p>
          </div>
          <ContentListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pending Approvals</h1>
            <p className="text-gray-600">Review and approve submitted content</p>
          </div>

          {/* Content List */}
          <div className="space-y-4">
            {allContent && allContent.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-12">
                  <div className="text-center">
                    <p className="text-2xl mb-2">✅</p>
                    <p className="text-gray-600 text-lg">No pending content</p>
                    <p className="text-gray-500 text-sm mt-2">All submitted content has been reviewed!</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              allContent?.map(item => (
                <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-yellow-500 bg-yellow-50">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                        <CardDescription className="text-base">
                          <span className="font-semibold text-gray-700">{item.subject}</span> • Uploaded by: {item.teacherId}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Description */}
                    {item.description && (
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Description:</span>
                        </p>
                        <p className="text-gray-700 mt-1">{item.description}</p>
                      </div>
                    )}

                    {/* Schedule Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-white bg-opacity-50 p-4 rounded border border-yellow-200">
                      <div>
                        <p className="text-gray-600">
                          <span className="font-semibold">Start Time:</span>
                        </p>
                        <p className="text-gray-800 font-mono mt-1">
                          {new Date(item.startTime).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <span className="font-semibold">End Time:</span>
                        </p>
                        <p className="text-gray-800 font-mono mt-1">
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

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-yellow-200 flex gap-3">
                      <Button
                        onClick={() => handleApprove(item.id)}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        ✓ Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectClick(item.id)}
                        disabled={isProcessing}
                        variant="destructive"
                        className="flex-1"
                      >
                        ✗ Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedContentId(null);
        }}
        onConfirm={handleConfirmReject}
        isLoading={isProcessing}
      />
    </>
  )
}