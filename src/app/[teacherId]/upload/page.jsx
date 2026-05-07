// app/upload/[teacherId]/page.jsx
'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadContent } from '@/services/content.service.jsx';
import { uploadContentSchema } from '@/lib/validations';
import { useToast } from '@/components/toast';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function UploadPage() {
  const router = useRouter();
  const { teacherId } = useParams();
  const { resetContext, user } = useAuth();
  const { addToast } = useToast();
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(uploadContentSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      startTime: '',
      endTime: '',
      rotationDuration: ''
    }
  });

  // Update file preview when file changes
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      resetContext();
      await uploadContent({ ...data, teacherId: user.role });
      addToast('Content uploaded successfully! Redirecting...', 'success', 1000);
      setTimeout(() => router.push(`/${teacherId}`), 500);
    } catch (err) {
      addToast('Failed to upload content. Please try again.', 'error');
      console.error('Upload error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Algebra Fundamentals"
                    className={`h-11 ${errors.title ? 'border-red-500' : ''}`}
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-base">Subject *</Label>
                  <select
                    id="subject"
                    className={`h-11 w-full rounded-md border ${errors.subject ? 'border-red-500' : 'border-gray-300'} px-3 py-2`}
                    {...register('subject')}
                  >
                    <option value="">Select a subject</option>
                    <option value="Math">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Art">Art</option>
                  </select>
                  {errors.subject && (
                    <p className="text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the content of this material..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* File Upload Field */}
              <div className="space-y-2">
                <Label htmlFor="file" className="text-base">Upload File (JPG, PNG, GIF) *</Label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${errors.file
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-blue-500'
                  }`}>
                  <Input
                    id="file"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    className="hidden"
                    required
                    {...register('file')}
                    onChange={(e) => {
                      register('file').onChange(e);
                      handleFileChange(e);
                    }}
                  />
                  <label htmlFor="file" className="cursor-pointer block">
                    <div className="text-gray-600">
                      {filePreview ? (
                        <div>
                          <Image
                            src={filePreview}
                            alt="Preview"
                            className="h-40 mx-auto rounded mb-2 object-contain"
                            width={200}
                            height={160}
                          />
                          <p className="text-sm font-medium text-blue-600">Click to change file</p>
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
                {errors.file && (
                  <p className="text-sm text-red-600">{errors.file.message}</p>
                )}
              </div>

              {/* Time Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-base">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    className={`h-11 ${errors.startTime ? 'border-red-500' : ''}`}
                    {...register('startTime')}
                  />
                  {errors.startTime && (
                    <p className="text-sm text-red-600">{errors.startTime.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-base">End Time *</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    className={`h-11 ${errors.endTime ? 'border-red-500' : ''}`}
                    {...register('endTime')}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-red-600">{errors.endTime.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rotationDuration" className="text-base">Rotation (minutes)</Label>
                  <Input
                    id="rotationDuration"
                    type="number"
                    placeholder="30"
                    className={`h-11 ${errors.rotationDuration ? 'border-red-500' : ''}`}
                    {...register('rotationDuration')}
                  />
                  {errors.rotationDuration && (
                    <p className="text-sm text-red-600">{errors.rotationDuration.message}</p>
                  )}
                </div>
              </div>

              {/* Error Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  <p className="font-semibold">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-sm mt-2">
                    {Object.entries(errors).map(([key, error]) => (
                      <li key={key}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6"
                >
                  {isSubmitting ? 'Uploading...' : '📤 Upload Content'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${teacherId}`)}
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
  );
}