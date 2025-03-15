import Link from "next/link";
import React from "react";
import { Logo } from "./logo";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ForgotPassword = () => {
	return (
		<section className="flex min-h-screen bg-zinc-50 px-4  dark:bg-transparent">
			<form
				action=""
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
							<Input placeholder="Enter Email Address" type="email" required name="email" id="email" />
						</div>

						<Button className="w-full cursor-pointer">Submit</Button>
					</div>
				</div>
			</form>
		</section>
	);
};

export default ForgotPassword;
