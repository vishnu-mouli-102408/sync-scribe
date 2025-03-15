import { z } from "zod";

export const signUpFormSchema = z.object({
	email: z
		.string()
		.min(2, { message: "Email must contain at least 2 character(s)" })
		.max(50, { message: "Email must not exceed 50 character(s)" }),
	firstName: z.string().min(2, { message: "Min 2 Chars Required" }).max(50, { message: "Max 50 Characters only" }),
	lastName: z.string().min(2, { message: "Min 2 Chars Required" }).max(50, { message: "Max 50 Characters only" }),
	password: z
		.string()
		.min(8, { message: "Password must contain at least 8 character(s)" })
		.max(50, { message: "Password must not exceed 50 character(s)" }),
});

export type SignUpForm = z.infer<typeof signUpFormSchema>;

export const loginFormSchema = z.object({
	email: z
		.string()
		.min(2, { message: "Email must contain at least 2 character(s)" })
		.max(50, { message: "Email must not exceed 50 character(s)" }),
	password: z
		.string()
		.min(8, { message: "Password must contain at least 8 character(s)" })
		.max(50, { message: "Password must not exceed 50 character(s)" }),
});

export type LoginForm = z.infer<typeof loginFormSchema>;
