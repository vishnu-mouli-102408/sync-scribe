"use client";

import { getDocumentShares, removeShare, shareDocument } from "@/actions/document";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ShareDialogProps {
	documentId: string;
	ownerId: string;
	currentUserId: string;
	isOpen: boolean;
	onClose: () => void;
	//   shares: Array<{
	//     id: string;
	//     userId: string;
	//     user: {
	//       email: string;
	//       username: string;
	//     };
	//   }>;
}

export default function ShareDialog({
	documentId,
	ownerId,
	currentUserId,
	isOpen,
	onClose,
}: //   shares,
ShareDialogProps) {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const isOwner = currentUserId === ownerId;

	const [sharedEmails, setSharedEmails] = useState<
		({
			user: {
				id: string;
				email: string;
				createdAt: Date;
				updatedAt: Date;
			};
		} & {
			documentId: string;
			id: string;
			userId: string;
		})[]
	>([]);

	useEffect(() => {
		async function fetchShares() {
			try {
				const sharesData = await getDocumentShares(documentId);
				setSharedEmails(sharesData);
			} catch (error) {
				console.error("Failed to fetch document shares:", error);
			}
		}

		fetchShares();
	}, [documentId]);

	const handleShare = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setLoading(true);
		setError("");

		try {
			const newShare = await shareDocument(documentId, currentUserId, email);
			setSharedEmails((prev) => [
				...prev,
				{ ...newShare, user: { id: "", email, createdAt: new Date(), updatedAt: new Date() } },
			]);
			setEmail("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to share document");
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveShare = async (userId: string) => {
		if (!isOwner) return;

		try {
			await removeShare(documentId, currentUserId, userId);
			setSharedEmails((prev) => prev.filter((share) => share.userId !== userId));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to remove share");
		}
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div
					className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 w-full max-w-md overflow-hidden"
					initial={{ scale: 0.9, y: 20, opacity: 0 }}
					animate={{ scale: 1, y: 0, opacity: 1 }}
					exit={{ scale: 0.9, y: 20, opacity: 0 }}
					transition={{ type: "spring", damping: 25, stiffness: 300 }}
				>
					<div className="p-6">
						<h2 className="text-2xl font-bold mb-6 text-white flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 mr-2 text-blue-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.48-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
								/>
							</svg>
							Share Document
						</h2>

						{isOwner && (
							<motion.form
								onSubmit={handleShare}
								className="mb-6 space-y-3"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
							>
								<div className="relative">
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Enter email address"
										className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
									/>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<motion.button
									type="submit"
									disabled={loading}
									className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.98 }}
								>
									{loading ? (
										<span className="flex items-center justify-center">
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Sharing...
										</span>
									) : (
										"Share"
									)}
								</motion.button>
								{error && (
									<motion.p className="text-red-500 mt-2 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
										{error}
									</motion.p>
								)}
							</motion.form>
						)}

						<motion.div
							className="space-y-3"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
						>
							<h3 className="font-medium text-gray-300 mb-3 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-1 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
								Shared with
							</h3>

							<AnimatePresence>
								{sharedEmails.length === 0 ? (
									<motion.p
										className="text-gray-500 text-sm italic py-2"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										No one has access to this document yet
									</motion.p>
								) : (
									<motion.div className="max-h-60 overflow-y-auto pr-1 space-y-2">
										{sharedEmails.map((share) => (
											<motion.div
												key={share.id}
												className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												layout
											>
												<div className="flex items-center">
													<div className="bg-gray-700 rounded-full p-1.5 mr-3">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-4 w-4 text-gray-300"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
															/>
														</svg>
													</div>
													<p className="text-gray-200 text-sm">{share.user.email}</p>
												</div>
												{isOwner && (
													<motion.button
														onClick={() => handleRemoveShare(share.userId)}
														className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-700 transition-colors"
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.95 }}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
													</motion.button>
												)}
											</motion.div>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</div>

					<motion.div
						className="bg-gray-800 px-6 py-4 border-t border-gray-700 flex justify-end"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<motion.button
							onClick={onClose}
							className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							Close
						</motion.button>
					</motion.div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
