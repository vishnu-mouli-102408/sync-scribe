"use server";

import { LoginForm, SignUpForm } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(formData: SignUpForm) {
	const origin = (await headers()).get("origin");
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
			emailRedirectTo: `${origin}/sign-in`,
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

	const { data: existingUser } = await supabase
		.from("user_profiles")
		.select("*")
		.eq("email", credentials.email)
		.limit(1)
		.single();

	if (!existingUser) {
		const { error: insertError } = await supabase.from("user_profiles").insert({
			email: data?.user?.email,
		});

		if (insertError) {
			console.error("Error inserting user profile:", insertError);
			return {
				status: insertError?.code || 500,
				message: insertError?.message || "Internal Server Error",
			};
		}
	}

	revalidatePath("/", "layout");
	return {
		status: 200,
		message: "User logged in",
		user: data?.user,
	};
}

export async function signOut() {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		redirect("/error");
		return {
			status: error?.status || 500,
			message: error?.message || "Internal Server Error",
		};
	}

	revalidatePath("/", "layout");
	return {
		status: 200,
		message: "User logged out",
	};
}

export async function getuserSession() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (!data || error) {
		return {
			status: 401,
			message: "Unauthorized",
		};
	}

	return {
		status: 200,
		message: "User session found",
		user: data?.user,
	};
}

export async function signInwithGithub() {
	const origin = (await headers()).get("origin");
	console.log("ORIGIN", origin);
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "github",
		options: {
			redirectTo: `${origin}/auth/callback`,
		},
	});

	if (error) {
		redirect("/error");
	} else if (data?.url) {
		redirect(data.url);
	}
}
export async function signInwithGoogle() {
	const origin = (await headers()).get("origin");
	console.log("ORIGIN", origin);

	const supabase = await createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${origin}/auth/callback`,
		},
	});

	if (error) {
		redirect("/error");
	} else if (data?.url) {
		redirect(data.url);
	}
}
