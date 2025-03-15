"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import GithubIcon from "../../public/github.svg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { SignUpForm, signUpFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInwithGithub, signInwithGoogle, signUp } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

export default function SignupPage() {
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<SignUpForm>({
		resolver: zodResolver(signUpFormSchema),
		mode: "onChange",
	});

	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const [isGithubPending, startGithubTransition] = useTransition();

	const [isGooglePending, startGoogleTransition] = useTransition();

	const handleGithubClick = () => {
		startGithubTransition(async () => {
			await signInwithGithub();
		});
	};

	const handleGoogleClick = () => {
		startGoogleTransition(async () => {
			await signInwithGoogle();
		});
	};

	async function onSubmit(values: SignUpForm) {
		setLoading(true);
		try {
			// ✅ This will be type-safe and validated.
			console.log("VALUES", values);

			const response = await signUp(values);
			console.log("RESPONSE", response);

			if (response?.status === 200) {
				toast.success(response.message, {
					duration: 3000,
					position: "bottom-center",
					description: "Please Verify your email to continue",
					closeButton: true,
				});
				router.push(`/verify?email=${values.email}`);
			} else if (response?.status === 400) {
				toast.error(response.message, {
					duration: 3000,
					position: "bottom-center",
					description: "User with this email already exists",
					closeButton: true,
				});
			} else {
				toast.error(response.message, {
					duration: 3000,
					position: "bottom-center",
					description: "Internal Server Error",
					closeButton: true,
				});
			}
		} catch (error) {
			console.error("Error during signup:", error);

			// Show a generic error message
			toast.error("Something went wrong. Please try again later.", {
				duration: 3000,
				position: "bottom-center",
				closeButton: true,
			});
		} finally {
			setLoading(false);
		}
	}

	console.log("ERRORS", errors);

	return (
		<section className="flex min-h-screen bg-zinc-50 px-4 py-10 dark:bg-transparent">
			<form
				noValidate
				onSubmit={handleSubmit(onSubmit)}
				className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
			>
				<div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
					<div className="text-center">
						<Link href="/" aria-label="go home" className="mx-auto block w-fit">
							<Logo />
						</Link>
						<h1 className="text-title mb-1 mt-4 text-xl font-semibold">Create a Sync Scribe Account</h1>
						<p className="text-sm">Welcome! Create an account to get started</p>
					</div>

					<div className="mt-6 space-y-6">
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-2">
								<Label htmlFor="firstname" className="block text-sm">
									Firstname
								</Label>
								<Input
									{...register("firstName")}
									placeholder="Enter First Name"
									type="text"
									required
									name="firstName"
									id="firstName"
								/>
								{errors?.firstName && (
									<p className="text-red-500 text-sm">{errors?.firstName?.message || "Required"}</p>
								)}
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastname" className="block text-sm">
									Lastname
								</Label>
								<Input
									{...register("lastName")}
									placeholder="Enter Last Name"
									type="text"
									required
									name="lastName"
									id="lastName"
								/>
								{errors?.lastName && <p className="text-red-500 text-sm">{errors?.lastName?.message || "Required"}</p>}
							</div>
						</div>

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

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password" className="text-title text-sm">
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

						<Button type="submit" className="w-full cursor-pointer" disabled={loading}>
							{loading ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin mr-2" />
									Submitting...
								</>
							) : (
								"Sign Up"
							)}
						</Button>
					</div>

					<div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
						<hr className="border-dashed" />
						<span className="text-muted-foreground text-xs">Or continue With</span>
						<hr className="border-dashed" />
					</div>

					<div className="grid grid-cols-2 gap-3">
						<Button onClick={handleGoogleClick} type="button" className="cursor-pointer" variant="outline">
							<svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
								<path
									fill="#4285f4"
									d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
								></path>
								<path
									fill="#34a853"
									d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
								></path>
								<path
									fill="#fbbc05"
									d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
								></path>
								<path
									fill="#eb4335"
									d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
								></path>
							</svg>
							<span>{isGooglePending ? "Signing in..." : "Google"}</span>
						</Button>
						<Button onClick={handleGithubClick} type="button" className="cursor-pointer" variant="outline">
							<Image src={GithubIcon} alt="Github Icon" width={20} height={20} className="" />
							<span>{isGithubPending ? "Signing in..." : "Github"}</span>
						</Button>
					</div>
				</div>

				<div className="p-3">
					<p className="text-accent-foreground text-center text-sm">
						Have an account ?
						<Button asChild variant="link" className="px-2">
							<Link href="/sign-in">Sign In</Link>
						</Button>
					</p>
				</div>
			</form>
		</section>
	);
}
