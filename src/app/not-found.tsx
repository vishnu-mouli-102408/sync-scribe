import React from "react";
import * as motion from "motion/react-client";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
	return (
		<div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
			<div className="relative z-10 max-w-3xl w-full">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
					className="flex flex-col md:flex-row items-center justify-between gap-12 backdrop-blur-sm bg-black/20 rounded-2xl p-12 border border-white/5"
				>
					<div className="flex-1 text-left">
						<motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
							<h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40 mb-4">
								404
							</h1>
							<p className="text-2xl text-white/80 font-light mb-6">Page not found</p>
							<p className="text-white/60 mb-8 max-w-md">
								The page you&apos;re looking for might have been removed, had its name changed, or is temporarily
								unavailable.
							</p>
							<motion.a
								href="/"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="inline-flex items-center px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all duration-300"
							>
								<Home className="w-5 h-5 mr-2" />
								Return Home
							</motion.a>
						</motion.div>
					</div>

					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
						className="relative"
					>
						<div className="relative z-10">
							<AlertCircle className="w-32 h-32 text-white/80" />
						</div>
						<div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent blur-2xl transform scale-150"></div>
					</motion.div>
				</motion.div>
			</div>

			{/* Background effects */}
			<div className="absolute inset-0 z-0">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1.5 }}
					className="absolute inset-0"
				>
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
					<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
				</motion.div>
			</div>
		</div>
	);
};

export default NotFound;
