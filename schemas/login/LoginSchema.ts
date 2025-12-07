import { z } from 'zod';

const phoneRegex = /^\+998(90|91|93|94|95|97|98|99|33|88|77)\d{7}$/;

export const LoginValidationSchema = z.object({
	phoneNumber: z
		.string()
		.min(13, 'Phone number must be 13 characters')
		.max(13, 'Phone number must be 13 characters')
		.refine((val) => phoneRegex.test(val), {
			message: 'Phone number must be valid Uzbekistan number (e.g., +998901234567)'
		}),
	tempPassword: z
		.string()
		.length(6, 'Temporary password must be exactly 6 digits')
		.regex(/^\d{6}$/, 'Temporary password must contain only numbers')
});