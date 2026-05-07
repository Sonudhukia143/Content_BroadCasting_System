import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rejectionReasonSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';

export function RejectionModal({ isOpen, onClose, onConfirm, isLoading = false }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(rejectionReasonSchema),
        mode: 'onBlur'
    });

    const onSubmit = async (data) => {
        await onConfirm(data.reason);
        reset();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl z-50 max-w-md w-full mx-4">
                <div className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Reject Content</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Please provide a reason for rejecting this content
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Reason Field */}
                        <div className="space-y-2">
                            <Label htmlFor="reason">Rejection Reason *</Label>
                            <Textarea
                                id="reason"
                                placeholder="e.g., Content contains inappropriate material, low quality image, etc."
                                rows={4}
                                className={`resize-none ${errors.reason ? 'border-red-500' : ''}`}
                                {...register('reason')}
                            />
                            {errors.reason && (
                                <p className="text-sm text-red-600">{errors.reason.message}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Rejecting...' : 'Reject Content'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
