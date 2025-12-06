import { z } from 'zod';

const phoneRegex = /^\+998(90|91|93|94|95|97|98|99|33|88)\d{7}$/;

// Validation schema
export const LoginValidationSchema = z.object({
	phoneNumber: z
		.string()
		.min(1, 'Phone number is required')
		.refine((val) => phoneRegex.test(val), 'Phone number must be valid Uzbekistan number (e.g., +998901234567)'),
	tempPassword: z
		.string()
		.min(6, 'Temporary password must be 6 digits')
		.max(6, 'Temporary password must be 6 digits')
		.regex(/^\d{6}$/, 'Temporary password must contain only numbers')
});
