import { z } from 'zod';
import { errorMessages } from '~/utils/messages';

export const LoginValidationSchema = z.object({
	username: z.string({
		required_error: errorMessages.blank,
		invalid_type_error: errorMessages.valid
	}).min(1, errorMessages.valid),
	password: z
		.string({
			required_error: errorMessages.blank,
			invalid_type_error: errorMessages.valid
		})
		.min(6, errorMessages.password)
    // .regex(/[A-Z]/, errorMessages.password_regex_uppercase)
		// .regex(/[a-z]/, errorMessages.password_regex)
	// .regex(/[0-9]/, "Password must contain at least one number")
	// .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});
