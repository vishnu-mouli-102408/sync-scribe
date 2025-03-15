"use client";

import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { resendVerificationEmail } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense, useState } from "react";
import LoadingSpinner from "@/components/loading-spinner";

function VerifyEmailPage() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const [loading, setLoading] = useState(false);
	const handleClick = async () => {
		if (email) {
			setLoading(true);
			resendVerificationEmail(email)
				?.then((res) => {
					console.log("Email sent successfully", res);
					if (res?.status === 200) {
						toast.success(res.message, {
							duration: 3000,
							position: "bottom-center",
							description: "Email sent successfully",
							closeButton: true,
						});
					}
				})
				?.catch((err) => {
					console.error("Error resending email:", err);
					toast.error(err.message, {
						duration: 3000,
						position: "bottom-center",
						description: "Internal Server Error",
						closeButton: true,
					});
				})
				?.finally(() => {
					setLoading(false);
				});
		}
	};
	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-gray-950 flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-md w-full bg-gray-900 rounded-2xl shadow-2xl shadow-black/50 p-8 relative overflow-hidden border border-gray-800"
			>
				<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-800 to-gray-800" />

				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
					className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-700"
				>
					<Mail className="w-8 h-8 text-gray-300" />
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
					<h1 className="text-2xl font-bold text-center text-gray-100 mb-2">Check your email</h1>
					<p className="text-center text-gray-400 mb-8">
						We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to
						verify your account.
					</p>
				</motion.div>

				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-4">
					<div className="bg-gray-800 rounded-lg p-4 flex items-start space-x-3 border border-gray-700">
						<CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
						<div>
							<h3 className="text-sm font-medium text-gray-200">Email sent successfully</h3>
							<p className="text-sm text-gray-400 mt-1">
								The verification email has been sent to your inbox. If you don&apos;t see it, please check your spam
								folder.
							</p>
						</div>
					</div>

					<Link
						href="/sign-in"
						className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors border border-gray-700"
					>
						<span>Continue to login</span>
						<ArrowRight className="ml-2 w-4 h-4" />
					</Link>

					<p className="text-center text-sm text-gray-500">
						Didn&apos;t receive the email?{" "}
						{loading ? (
							<span className="text-gray-300">Resending...</span>
						) : (
							<button
								onClick={handleClick}
								className="text-gray-300 cursor-pointer hover:text-white font-medium transition-colors"
							>
								Click here to resend email
							</button>
						)}
					</p>
				</motion.div>
			</motion.div>
		</div>
	);
}

const Page = () => {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<VerifyEmailPage />
		</Suspense>
	);
};

export default Page;
