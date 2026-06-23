import { z } from 'zod';

/**
 * Shared Validation Schemas
 * Aligned with backend Joi rules
 */

// Posts
export const createPostSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    event_name: z.string().min(1, 'Event name is required'),
    description: z.string().optional().or(z.literal('')),
    tag_id: z.coerce.number().optional(),
});

export const updatePostSchema = createPostSchema.partial().extend({
    delete_image_id: z.array(z.number()).optional(),
    edited_image_id: z.array(z.number()).optional(),
});

// Clients
export const createClientSchema = z.object({
    clientName: z.string().min(3, 'Name must be at least 3 characters').max(50),
    urlPortofolio: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export const updateClientSchema = createClientSchema.partial();

// Equipments
export const createEquipmentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional().or(z.literal('')),
    category_id: z.coerce.number().optional(),
});

export const updateEquipmentSchema = createEquipmentSchema.partial();

// Users
export const createUserSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(30),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['admin', 'user']),
});

export const updateUserSchema = createUserSchema.partial();
