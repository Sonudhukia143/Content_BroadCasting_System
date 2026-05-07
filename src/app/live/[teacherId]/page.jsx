'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLiveContent } from '@/services/content.service.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import Image from 'next/image';

export default function LivePage() {
  const { teacherId } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveContent(teacherId).then(c => setContent(c[0] || null)).finally(() => setLoading(false));
  }, [teacherId]);

  // UI: Loading skeleton (same logic, better appearance)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-2xl mx-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200" />
            <div className="p-6 space-y-4">
              <div className="h-7 bg-gray-200 rounded w-3/4" />
              <div className="h-5 bg-gray-200 rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {content ? (
        // Enhanced card design with same data structure
        <Card className="max-w-2xl w-full overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
          {/* Image container with better styling */}
          <div className="relative w-full h-64 bg-gray-200">
            <Image
              src="/globe.svg"
              width={100}
              height={100}
              alt="Content"
              className="w-full h-full object-cover"
              style={{ width: '100%', height: '100%' }}
              priority
            />
            {/* Optional live badge - purely decorative, no logic change */}
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              LIVE
            </div>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
              {content.title}
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              {content.subject}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-6">
            <p className="text-gray-700 leading-relaxed">{content.description}</p>
          </CardContent>
        </Card>
      ) : (
        // Enhanced empty state (same logic, better visuals)
        <div className="text-center max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.5-4.5M15 10l-4.5-4.5M15 10v9m-6-9L4.5 5.5M9 10l-4.5-4.5M9 10v9" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No content available</h1>
          <p className="text-gray-500">Check back later for live sessions.</p>
        </div>
      )}
    </div>
  );
}