'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext.jsx'
import { uploadContent } from '@/services/content.service.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select } from '@/components/ui/select.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Navbar } from '@/components/Navbar.jsx'

export default function UploadPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [form, setForm] = useState({
        title: '',
        subject: '',
        description: '',
        file: null,
        startTime: '',
        endTime: '',
        rotationDuration: ''
    })
    const [filePreview, setFilePreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    if (authLoading || !user || user.role !== 'teacher') {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      const file = files[0]
      setForm({ ...form, [name]: file })
      
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!form.file || !['image/jpeg', 'image/png', 'image/gif'].includes(form.file.type)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, or GIF.')
      }

      if (form.file.size > 10 * 1024 * 1024) {
        throw new Error('File too large. Maximum size is 10MB.')
      }

      if (new Date(form.endTime) <= new Date(form.startTime)) {
        throw new Error('End time must be after start time.')
      }

      await uploadContent(form)
      setSuccess('Content uploaded successfully!')
      setTimeout(() => router.push('/teacher/dashboard'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Content</h1>
            <p className="text-gray-600">Share your educational content with students</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>Fill in all required fields marked with *</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g., Algebra Fundamentals"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-base">Subject *</Label>
                    <Select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="h-11"
                    >
                      <option value="">Select a subject</option>
                      <option value="Math">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                      <option value="English">English</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Art">Art</option>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the content of this material..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file" className="text-base">Upload File (JPG, PNG, GIF) *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <Input
                      id="file"
                      type="file"
                      name="file"
                      onChange={handleChange}
                      accept="image/*"
                      required
                      className="hidden"
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <div className="text-gray-600">
                        {filePreview ? (
                          <div>
                            <img src={filePreview} alt="Preview" className="h-40 mx-auto rounded mb-2" />
                            <p className="text-sm">Click to change file</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-lg">📁 Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500">Max 10MB (JPG, PNG, GIF)</p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-base">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-base">End Time *</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      name="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rotationDuration" className="text-base">Rotation (minutes)</Label>
                    <Input
                      id="rotationDuration"
                      type="number"
                      name="rotationDuration"
                      value={form.rotationDuration}
                      onChange={handleChange}
                      placeholder="30"
                      className="h-11"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Success!</p>
                    <p>{success}</p>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6">
                    {loading ? 'Uploading...' : '📤 Upload Content'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/teacher/dashboard')}
                    className="flex-1 text-lg py-6"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}