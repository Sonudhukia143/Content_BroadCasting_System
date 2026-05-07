'use client';
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getContentByTeacher } from '@/services/content.service.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';

export default function TeacherDashboard() {
    const { teacherId } = useParams();
    const { stats, setStats } = useAuth();
    const [dashboardLoading, setDashboardLoading] = useState(stats ? false : true);

    useEffect(() => {
        // caching the stats from context and removing extra api calls
        if (stats === null)
            getContentByTeacher('teacher1')
                .then(content => {
                    const total = content.length
                    const pending = content.filter(c => c.status === 'pending').length
                    const approved = content.filter(c => c.status === 'approved').length
                    const rejected = content.filter(c => c.status === 'rejected').length
                    setStats({ total, pending, approved, rejected })
                })
                .finally(() => setDashboardLoading(false))
    }, [stats, setStats]);

    if (dashboardLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
                        <p className="text-gray-600">Welcome back! Here&apos;s your content overview.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader className="pb-3">
                                <CardDescription className="text-gray-600">Total Uploaded</CardDescription>
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
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Upload new content or manage existing content</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={`/${teacherId}/upload`} className="block">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                                        📤 Upload New Content
                                    </Button>
                                </Link>
                                <Link href={`/${teacherId}/content`} className="block">
                                    <Button variant="outline" className="w-full text-lg py-6">
                                        📋 View My Content
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle>Status Breakdown</CardTitle>
                                <CardDescription>Content review status summary</CardDescription>
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
            </div >
        </>
    )
}