"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Logo } from "./logo";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/auth";

const ResetPassword = () => {
	const searchParams = useSearchParams();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ password: string }>({
		resolver: zodResolver(
			z.object({
				password: z.string().min(8, { message: "Password must be at least 8 characters" }),
			})
		),
		mode: "onChange",
	});

	const router = useRouter();

	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const onSubmit = async (values: { password: string }) => {
		console.log("Reset Password", values);
		try {
			setLoading(true);
			const token = searchParams.get("code");
			if (!token) {
				throw new Error("Token not found");
			}
			const result = await resetPassword(values.password, token);
			if (result?.status === 200) {
				toast.success(result.message, {
					duration: 3000,
					position: "bottom-center",
				});
				router.push("/");
			} else {
				toast.error(result.message || "Password Reset Failed", {
					duration: 3000,
					position: "bottom-center",
				});
			}
		} catch (error) {
			console.error("Error resetting password:", error);
			toast.error("Error resetting password", {
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
						<h1 className="mb-1 mt-4 text-xl font-semibold">Reset Password</h1>
					</div>

					<div className="mt-6 space-y-6">
						<div className="space-y-0.5">
							<div className="flex items-center justify-between">
								<Label htmlFor="pwd" className="text-title mb-1 text-sm">
									Password
								</Label>
							</div>
							<div className="relative">
								<Input
									{...register("password")}
									placeholder="Enter Password"
									type={showPassword ? "text" : "password"}
									required
									name="password"
									id="password"
									className="input sz-md variant-mixed"
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="absolute mt-0.5 mr-0.5 cursor-pointer right-0 top-0 h-max px-3 py-2 hover:bg-transparent"
									onClick={() => setShowPassword((prev) => !prev)}
									disabled={loading}
								>
									{showPassword && !loading ? (
										<EyeIcon className="h-4 w-4" aria-hidden="true" />
									) : (
										<EyeOffIcon className="h-4 w-4" aria-hidden="true" />
									)}
									<span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
								</Button>
							</div>
							{errors?.password && (
								<p className="text-red-500 text-sm">{errors?.password?.message || "Password is required"}</p>
							)}
						</div>

						<Button type="submit" disabled={loading} className="w-full cursor-pointer">
							{loading ? "Resetting password..." : "Reset Password"}
						</Button>
					</div>
				</div>
			</form>
		</section>
	);
};

export default ResetPassword;
