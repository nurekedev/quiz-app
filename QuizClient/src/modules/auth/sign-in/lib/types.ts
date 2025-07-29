import z from "zod";

export const signInFormSchema = z.object({
	username: z.string().min(2, {
		message: "Username must be at least 2 characters.",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
});

export type SignInFormI = z.infer<typeof signInFormSchema>;

export type SignInResponseI = {
	access_token: string;
	refresh_token: string;
};
