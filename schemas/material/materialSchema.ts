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
        .union([z.string(), z.number()])
        .transform((val) => {
            const num = typeof val === 'string' ? parseInt(val, 10) : val;
            return num;
        })
        .refine((val) => !isNaN(val) && val > 0, {
            message: 'Test number must be a positive number'
        })
});
