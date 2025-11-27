import { z } from 'zod';

/**
 * API Validation Schemas
 */

// Submission schemas
export const createSubmissionSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    categoryId: z.string().min(1, 'Category is required'),
    culturalRelevance: z.string().min(20, 'Please provide more detail on cultural relevance').max(2000),
    mediaUrl: z.string().url().optional().or(z.literal('')),
});

export const updateSubmissionSchema = z.object({
    status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
    feedback: z.string().max(1000).optional(),
});

// Nominee schemas
export const createNomineeSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    category: z.string().min(1, 'Category is required'),
    region: z.string().min(1, 'Region is required').max(100),
    bio: z.string().min(1, 'Bio is required').max(1000),
    imageId: z.string().min(1, 'Image ID is required'),
    featured: z.boolean().default(false),
});

export const updateNomineeSchema = createNomineeSchema.partial();

// Vote schemas
export const createVoteSchema = z.object({
    nomineeId: z.string().min(1, 'Nominee ID is required'),
});

// Category schemas
export const createCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().min(1, 'Description is required').max(500),
    imageId: z.string().min(1, 'Image ID is required'),
});

export const updateCategorySchema = createCategorySchema.partial();

// User schemas
export const updateUserRoleSchema = z.object({
    role: z.enum(['participant', 'judge', 'admin']),
});

// Query parameter schemas
export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export const nomineeQuerySchema = paginationSchema.extend({
    category: z.string().optional(),
    featured: z.coerce.boolean().optional(),
});

export const submissionQuerySchema = paginationSchema.extend({
    status: z.enum(['Pending', 'Approved', 'Rejected']).optional(),
    categoryId: z.string().optional(),
});

/**
 * Type exports
 */
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;
export type CreateNomineeInput = z.infer<typeof createNomineeSchema>;
export type UpdateNomineeInput = z.infer<typeof updateNomineeSchema>;
export type CreateVoteInput = z.infer<typeof createVoteSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type NomineeQuery = z.infer<typeof nomineeQuerySchema>;
export type SubmissionQuery = z.infer<typeof submissionQuerySchema>;
