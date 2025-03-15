"use client";

import { motion } from "framer-motion";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-slate-900">
			<div className="relative">
				{/* Animated background glow effect */}
				<motion.div
					className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30"
					animate={{
						scale: [1, 1.1, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				<div className="relative px-8 py-10 bg-black bg-opacity-90 rounded-lg shadow-2xl backdrop-blur-sm">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="flex flex-col items-center text-center space-y-6"
					>
						<motion.div
							animate={{
								rotate: [0, 360],
							}}
							transition={{
								duration: 20,
								repeat: Infinity,
								ease: "linear",
							}}
							className="text-red-500"
						>
							<AlertCircle size={64} />
						</motion.div>

						<motion.h1
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="text-3xl font-bold text-white"
						>
							Something Went Wrong
						</motion.h1>

						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="text-gray-400 max-w-md"
						>
							We apologize for the inconvenience. An unexpected error has occurred. Please try again later.
						</motion.p>

						<div className="flex gap-4">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={reset}
								className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
							>
								<RefreshCcw size={20} />
								Try Again
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => (location.href = "/")}
								className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
							>
								<Home size={20} />
								Go Home
							</motion.button>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
