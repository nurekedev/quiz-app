import { z } from "zod";

export const signUpFormSchema = z
	.object({
		username: z.string().min(6, {
			message: "Username must be at least 6 characters.",
		}),
		firstName: z.string().min(2, {
			message: "First name must be at least 2 characters.",
		}),
		lastName: z.string().min(2, {
			message: "Last name must be at least 2 characters.",
		}),
		password: z.string().min(8).max(100),
	})
	.refine(
		(data) => {
			const hasUpperCase = /[A-Z]/.test(data.password);
			const hasLowerCase = /[a-z]/.test(data.password);
			const hasNumber = /\d/.test(data.password);
			const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data.password);
			return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
		},
		{
			message:
				"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
			path: ["password"],
		},
	);

export type SignUpFormI = z.infer<typeof signUpFormSchema>;
