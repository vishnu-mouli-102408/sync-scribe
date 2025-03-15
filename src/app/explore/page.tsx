"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Share2, FileText, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createDocument, deleteDocument, getDocuments } from "@/actions/document";
import ShareDialog from "@/components/share-dialog";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import RichTextEditor from "@/components/rich-text-editor";

type Document = {
	id: string;
	content: string;
	ownerId: string;
	createdAt: Date;
	updatedAt: Date;
	version: number;
	lastEditedBy: string | null;
	shares: {
		id: string;
		documentId: string;
		userId: string;
		user: {
			email: string;
			username: string;
		};
	}[];
	owner: {
		email: string;
		username: string;
	};
};

const DocumentsPage = () => {
	const [documents, setDocuments] = useState<Document[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
	const [showShareDialog, setShowShareDialog] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [content, setContent] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const supabase = createClient();
	const router = useRouter();

	const fetchDocuments = useCallback(async () => {
		setLoading(true);
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user?.id) {
				router.push("/sign-in");
				return;
			} else {
				setUser(user);
			}
			const docs = await getDocuments(user.id);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			setDocuments(docs);
		} catch (error) {
			console.error("Error fetching documents:", error);
		} finally {
			setLoading(false);
		}
	}, [router, supabase.auth]);

	useEffect(() => {
		fetchDocuments();
	}, [fetchDocuments]);

	const handleAddDocument = async () => {
		if (!content.trim()) {
			toast.warning("Please enter some content");
			return;
		}

		try {
			setIsCreating(true);
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user?.id) {
				router.push("/sign-in");
				return;
			}

			await createDocument(content, user.id);
			setContent("");
			await fetchDocuments();
			router.refresh();
			toast.success("Document created successfully");
		} catch (error) {
			console.error("Error creating document:", error);
			toast.error("Failed to create document");
		} finally {
			setIsCreating(false);
		}
	};

	const handleDeleteDocument = async (docId: string, e: React.MouseEvent) => {
		e.stopPropagation();

		const toastId = toast.loading("Deleting document...");

		try {
			await deleteDocument(docId);
			setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== docId));
			router.refresh();
			toast.success("Document deleted successfully", { id: toastId });
		} catch (error) {
			console.error("Error deleting document:", error);
			toast.error("Failed to delete document", { id: toastId });
		}
	};

	const handleShare = async (doc: Document, e: React.MouseEvent) => {
		e.stopPropagation();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (doc.ownerId !== user?.id) return;

		setSelectedDoc(doc);
		setShowShareDialog(true);
	};

	const handleDocumentClick = (docId: string) => {
		router.push(`/explore/${docId}`);
	};

	const handleShareDialogClose = () => {
		setShowShareDialog(false);
		setSelectedDoc(null);
		fetchDocuments();
	};

	return (
		<div className="min-h-screen bg-black text-gray-100 pb-20">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="max-w-7xl mx-auto px-4 sm:px-6 py-12"
			>
				<motion.div
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className=" text-center"
				>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-slate-200 via-white to-gray-200 text-transparent bg-clip-text">
						Your Documents
					</h1>
					<p className="text-gray-400 mt-2">Create, manage and share your documents</p>
				</motion.div>

				<div className="max-w-4xl mx-auto py-8">
					<RichTextEditor
						content={content}
						onChange={(content: string) => {
							setContent(content);
							console.log("CONTENT", content);
						}}
					/>

					<div className="flex justify-end items-center">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleAddDocument}
							disabled={isCreating}
							className="w-max font-semibold mb-12 cursor-pointer bg-gradient-to-r from-slate-500 to-zinc-400 hover:from-slate-400 hover:to-zinc-500 text-white py-2 px-6 rounded-lg shadow-lg hover:shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
						>
							{isCreating ? (
								<>
									<Loader2 size={20} className="mr-2 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Plus size={20} />
									Create Document
								</>
							)}
						</motion.button>
					</div>
				</div>

				{loading ? (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
							className="w-16 h-16 border-4 border-zinc-800 border-t-pink-500 rounded-full mx-auto mb-4"
						></motion.div>
						<p className="text-gray-400 text-lg mt-4">Loading your documents...</p>
					</motion.div>
				) : documents.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="text-center py-16 bg-zinc-900 rounded-xl border border-zinc-800"
					>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.5, type: "spring" }}
						>
							<FileText size={64} className="mx-auto text-gray-600 mb-4" />
						</motion.div>
						<p className="text-gray-400 text-lg">No documents yet. Create your first document above!</p>
					</motion.div>
				) : (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<AnimatePresence>
								{documents.map((doc, index) => (
									<motion.div
										key={doc.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.9 }}
										transition={{ delay: index * 0.05, duration: 0.4 }}
										whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(255, 0, 255, 0.15)" }}
										onClick={() => handleDocumentClick(doc.id)}
										className="group relative bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-pink-500/30 cursor-pointer transition-all duration-300"
									>
										<div className="flex justify-between items-start mb-4">
											<motion.div
												whileHover={{ scale: 1.01 }}
												className="absolute -top-3 -left-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs font-bold"
											>
												v{doc.version}
											</motion.div>

											<h2 className="text-lg font-semibold text-gray-100 truncate pr-16 group-hover:text-pink-400 transition-colors">
												{doc.content
													.replace(/<[^>]+>/g, "")
													.split(" ")
													.slice(0, 5)
													.join(" ")}
												...
											</h2>

											{doc && doc.ownerId === user?.id && (
												<div className="absolute top-4 right-4 flex gap-2">
													<motion.button
														whileHover={{ scale: 1.15, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
														whileTap={{ scale: 0.95 }}
														onClick={(e) => handleDeleteDocument(doc.id, e)}
														className="text-red-500 cursor-pointer hover:text-red-400 transition-all p-2 rounded-full hover:bg-zinc-800"
														title="Delete Document"
													>
														<Trash2 size={18} />
													</motion.button>
													<motion.button
														whileHover={{ scale: 1.15, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
														whileTap={{ scale: 0.95 }}
														onClick={(e) => handleShare(doc, e)}
														className="text-gray-400 cursor-pointer hover:text-gray-300 transition-all p-2 rounded-full hover:bg-zinc-800"
														title="Share Document"
													>
														<Share2 size={18} />
													</motion.button>
												</div>
											)}
										</div>

										<div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-gray-500">
											<span>Last updated: {new Date(doc.updatedAt).toLocaleDateString()}</span>
											<motion.span
												whileHover={{ scale: 1.05 }}
												className="px-2 py-1 bg-zinc-800 rounded-full text-pink-400"
											>
												{doc.shares.length} {doc.shares.length === 1 ? "share" : "shares"}
											</motion.span>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</motion.div>
				)}

				{showShareDialog && selectedDoc && (
					<ShareDialog
						documentId={selectedDoc.id}
						ownerId={selectedDoc.ownerId}
						currentUserId={selectedDoc.ownerId}
						isOpen={showShareDialog}
						onClose={handleShareDialogClose}
					/>
				)}
			</motion.div>
		</div>
	);
};

export default DocumentsPage;
