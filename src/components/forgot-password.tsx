"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./logo";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { forgotPassword } from "@/actions/auth";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ email: string }>({
		resolver: zodResolver(
			z.object({
				email: z.string().email({ message: "Invalid email address" }),
			})
		),
		mode: "onChange",
	});

	const [loading, setLoading] = useState(false);

	const onSubmit = async (values: { email: string }) => {
		console.log("Forgot Password", values);
		try {
			setLoading(true);
			const result = await forgotPassword(values.email);
			if (result?.status === 200) {
				toast.success(result.message, {
					duration: 3000,
					position: "bottom-center",
				});
				router.push("/verify-password");
			} else {
				toast.error(result.message || "Error sending reset password email", {
					duration: 3000,
					position: "bottom-center",
				});
			}
		} catch (error) {
			console.error("Error sending reset password email:", error);
			toast.error("Error sending reset password email", {
				duration: 3000,
				position: "bottom-center",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="flex min-h-screen bg-zinc-50 px-4  dark:bg-transparent">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
			>
				<div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
					<div className="text-center">
						<Link href="/" aria-label="go home" className="mx-auto block w-fit">
							<Logo />
						</Link>
						<h1 className="mb-1 mt-4 text-xl font-semibold">Forgot Password</h1>
						<p className="text-sm">
							Enter your email address below and we&apos;ll send you a link to reset your password
						</p>
					</div>

					<div className="mt-6 space-y-6">
						<div className="space-y-2">
							<Label htmlFor="email" className="block text-sm">
								Email Address
							</Label>
							<Input
								{...register("email")}
								placeholder="Enter Email Address"
								type="email"
								required
								name="email"
								id="email"
							/>
							{errors?.email && <p className="text-red-500 text-sm">{errors?.email?.message || "Email is required"}</p>}
						</div>

						<Button disabled={loading} type="submit" className="w-full cursor-pointer">
							{loading ? "Sending email..." : "Send Reset Password Email"}
						</Button>
					</div>
				</div>
			</form>
		</section>
	);
};

export default ForgotPassword;
