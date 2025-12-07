import { z } from 'zod';
import { BookTypeOptions } from '~/helpers/constants';

export const materialBookSchema = z.object({
    title: z
        .string()
        .min(1, { message: 'Book name is required' })
        .min(3, { message: 'Book name must be at least 3 characters' })
        .max(100, { message: 'Book name must not exceed 100 characters' })
        .trim(),
    materialType: z
        .string()
        .min(1, { message: 'Book type is required' })
        .refine((val) => BookTypeOptions.some((bt) => bt.value === val), {
            message: 'Invalid book type selected'
        })
});
export const materialTestSchema = z.object({
    title: z
        .string()
        .min(1, { message: 'Book name is required' })
        .min(3, { message: 'Book name must be at least 3 characters' })
        .max(100, { message: 'Book name must not exceed 100 characters' })
        .trim(),
    testNumber: z
        .number()
        .min(1, { message: 'Test number is required' })
        .max(200, { message: 'Test number must not exceed 100 characters' })
});
