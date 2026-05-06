'use client';
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getLiveContent } from '@/services/content.service.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import Image from 'next/image';

export default function LivePage() {
  const { teacherId } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveContent(teacherId).then(c => setContent(c[0] || null)).finally(() => setLoading(false))
  }, [teacherId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      {content ? (

        <Card className="max-w-2xl w-full">

          <CardHeader>

            <CardTitle>{content.title}</CardTitle>

            <CardDescription>{content.subject}</CardDescription>

          </CardHeader>

          <CardContent>

            <p>{content.description}</p>

            <div className="mt-4">

              {/* Mock image */}

              <Image src="/placeholder.jpg" alt="Content" className="w-full h-64 object-cover" />

            </div>

          </CardContent>

        </Card>

      ) : (

        <div className="text-center">

          <h1 className="text-2xl font-bold">No content available</h1>

        </div>

      )}

    </div>

  )

}