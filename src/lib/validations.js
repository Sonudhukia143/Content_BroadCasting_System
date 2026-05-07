import { z } from 'zod';

// Content upload validation schema
export const uploadContentSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must not exceed 100 characters'),

    subject: z.string()
        .min(1, 'Subject is required'),

    description: z.string()
        .max(500, 'Description must not exceed 500 characters')
        .optional()
        .default(''),

    file: z.any(),

    startTime: z.string()
        .min(1, 'Start time is required'),

    endTime: z.string()
        .min(1, 'End time is required'),

    rotationDuration: z.string()
        .optional()
        .default('')
        .refine(
            val => !val || !isNaN(Number(val)),
            'Rotation duration must be a number'
        )
}).refine(
    data => new Date(data.endTime) > new Date(data.startTime),
    {
        message: 'End time must be after start time',
        path: ['endTime']
    }
).refine(
    data => data.file !== undefined && data.file !== null,
    {
        message: 'File is required',
        path: ['file']
    }
);

// Login validation schema
export const loginSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address'),

    password: z.string()
        .min(1, 'Password is required')
        .min(3, 'Password must be at least 3 characters')
});

// Rejection reason validation schema
export const rejectionReasonSchema = z.object({
    reason: z.string()
        .min(1, 'Rejection reason is required')
        .min(5, 'Rejection reason must be at least 5 characters')
        .max(500, 'Rejection reason must not exceed 500 characters')
});
