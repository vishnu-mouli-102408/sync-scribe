"use client";

import { motion } from "framer-motion";
import { KeyRound, ArrowRight, Shield, Timer } from "lucide-react";
import Link from "next/link";

export default function PasswordResetSent() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-md w-full bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/50 p-8 relative overflow-hidden border border-gray-800"
			>
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-900 via-purple-600 to-purple-900" />

				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
					className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-700 rotate-45 relative"
				>
					<div className="-rotate-45">
						<KeyRound className="w-10 h-10 text-purple-400" />
					</div>
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
					<h1 className="text-3xl font-bold text-center text-gray-100 mb-2">Check your inbox</h1>
					<p className="text-center text-gray-400 mb-8">
						We&apos;ve sent password reset instructions to your email address. The link will expire in 30 minutes.
					</p>
				</motion.div>

				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
							<Shield className="w-6 h-6 text-purple-400 mb-2" />
							<h3 className="text-sm font-medium text-gray-200">Secure Link</h3>
							<p className="text-xs text-gray-400 mt-1">Reset link is encrypted and single-use only</p>
						</div>
						<div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
							<Timer className="w-6 h-6 text-purple-400 mb-2" />
							<h3 className="text-sm font-medium text-gray-200">Time Sensitive</h3>
							<p className="text-xs text-gray-400 mt-1">Link expires in 30 minutes for security</p>
						</div>
					</div>

					<Link
						href="/sign-in"
						className="flex items-center justify-center w-full px-4 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-purple-900 to-purple-700 rounded-lg hover:from-purple-800 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg shadow-purple-900/20"
					>
						<span>Return to login</span>
						<ArrowRight className="ml-2 w-4 h-4" />
					</Link>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-800"></div>
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-gray-900 px-2 text-gray-500">Or</span>
						</div>
					</div>

					<button className="w-full text-center text-sm text-gray-400 hover:text-purple-400 transition-colors">
						Need help? Contact support
					</button>
				</motion.div>
			</motion.div>
		</div>
	);
}
