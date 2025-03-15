"use server";

import { LoginForm, SignUpForm } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function signUp(formData: SignUpForm) {
	const supabase = await createClient();
	const credentials = {
		email: formData.email,
		password: formData.password,
		firstName: formData.firstName,
		lastName: formData.lastName,
	};

	const { error, data } = await supabase.auth.signUp({
		email: credentials.email,
		password: credentials.password,
		options: {
			data: {
				firstName: credentials.firstName,
				lastName: credentials.lastName,
			},
		},
	});

	if (error) {
		return {
			status: error?.status || 500,
			message: error?.message || "Internal Server Error",
			user: null,
		};
	}

	if (data?.user?.identities?.length === 0) {
		return {
			status: 400,
			message: "User with this email already exists",
			user: null,
		};
	}

	revalidatePath("/", "layout");
	return {
		status: 200,
		message: "User created",
		user: data?.user,
	};
}

export async function resendVerificationEmail(email: string) {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.resend({
		type: "signup",
		email: email,
	});

	if (error) {
		console.error("Error resending email:", error);
		return {
			status: error?.status || 500,
			message: error?.message || "Internal Server Error",
		};
	}

	console.log("Verification email resent:", data);
	return {
		status: 200,
		message: "Verification email resent",
	};
}

export async function signIn(formData: LoginForm) {
	const supabase = await createClient();
	const credentials = {
		email: formData.email,
		password: formData.password,
	};

	const { error, data } = await supabase.auth.signInWithPassword({
		email: credentials.email,
		password: credentials.password,
	});

	if (error) {
		return {
			status: error?.status || 500,
			message: error?.message || "Internal Server Error",
		};
	}

	revalidatePath("/", "layout");
	return {
		status: 200,
		message: "User logged in",
		user: data?.user,
	};
}
