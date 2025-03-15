"use client";

import React, { useState, useEffect, useRef } from "react";

import type { RealtimeChannel } from "@supabase/supabase-js";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { DocumentPresence, UserPresence } from "@/lib/presence";
import { deleteDocument, getDocument, updateDocument } from "@/actions/document";
import UserCursor from "./user-cursor";
import ShareDialog from "./share-dialog";
import RichTextEditor from "./rich-text-editor";
import { motion } from "motion/react";
import { Trash2, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DocumentEditorProps {
	id: string;
}

interface User {
	id: string;
	email: string;
	username?: string;
}

const colors = [
	"#FF6B6B", // Red
	"#4ECDC4", // Teal
	"#45B7D1", // Blue
	"#96CEB4", // Green
	"#FFEEAD", // Yellow
	"#D4A5A5", // Pink
	"#9B59B6", // Purple
	"#3498DB", // Light Blue
];

const getUserColor = (userId: string) => {
	const index = Math.abs(userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
	return colors[index];
};

const debounce = (func: (content: string) => Promise<void>, wait: number): ((content: string) => void) => {
	let timeout: NodeJS.Timeout;
	return (content: string) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(content), wait);
	};
};

const DocumentEditor: React.FC<DocumentEditorProps> = ({ id }) => {
	const [content, setContent] = useState("");
	const [ownerId, setOwnerId] = useState("");
	const [user, setUser] = useState<User | null>(null);
	const [showShareDialog, setShowShareDialog] = useState(false);
	const [presence, setPresence] = useState<DocumentPresence>({});

	const editorRef = useRef<HTMLDivElement>(null);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const tipTapRef = useRef<any>(null);
	const presenceChannel = useRef<RealtimeChannel | null>(null);
	const isLocalChange = useRef(false);
	const supabase = createClient();
	const router = useRouter();

	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);

	// SETUP PRESENCE & REALTIME CHANNEL
	useEffect(() => {
		const setupPresence = async () => {
			if (!user?.id || !id) return;

			const channel = supabase.channel(`document:${id}`, {
				config: {
					presence: {
						key: user.id,
					},
				},
			});

			channel.on("presence", { event: "sync" }, () => {
				const state = channel.presenceState();
				const presenceData: DocumentPresence = {};
				Object.entries(state).forEach(([key, value]) => {
					if (Array.isArray(value) && value.length > 0) {
						const presence = value[0] as unknown as UserPresence;
						presenceData[key] = presence;
					}
				});
				setPresence(presenceData);
			});

			// Listen for content changes from other users
			channel.on("broadcast", { event: "content_change" }, ({ payload }) => {
				if (payload.userId !== user.id) {
					isLocalChange.current = true;
					setContent(payload.content);
				}
			});

			channel.on("broadcast", { event: "presence" }, ({ payload }) => {
				if (payload.type === "join") {
					const { key, presence } = payload;
					setPresence((prev) => ({ ...prev, [key]: presence as UserPresence }));
				} else if (payload.type === "leave") {
					const { key } = payload;
					setPresence((prev) => {
						const newPresence = { ...prev };
						delete newPresence[key];
						return newPresence;
					});
				}
			});

			await channel.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					await channel.track({
						user: {
							id: user.id,
							email: user.email,
							username: user.email.split("@")[0],
						},
						cursor: null,
						lastSeen: new Date().getTime(),
					});
				}
			});

			presenceChannel.current = channel;
		};

		setupPresence();

		return () => {
			if (presenceChannel.current) {
				presenceChannel.current.unsubscribe();
			}
		};
	}, [user?.id, id, supabase, user?.email]);

	// HANDLE LIVE CARET (selection-change)
	useEffect(() => {
		const handleSelectionChange = async (range: { index: number; length: number } | null) => {
			if (!range || !presenceChannel.current || !user?.id) return;

			const quill = tipTapRef.current?.getEditor();
			if (!quill) return;

			try {
				const bounds = quill.getBounds(range.index);
				const x = bounds.left;
				const y = bounds.top;

				await presenceChannel.current.track({
					user: {
						id: user.id,
						email: user.email,
						username: user.email.split("@")[0],
					},
					cursor: { x, y },
					lastSeen: new Date().getTime(),
				});
			} catch (error) {
				console.error("Error tracking cursor position:", error);
			}
		};

		const tipTapInstance = tipTapRef.current?.getEditor();
		if (tipTapInstance) {
			tipTapInstance.on("selection-change", handleSelectionChange);
		}

		return () => {
			if (tipTapInstance) {
				tipTapInstance.off("selection-change", handleSelectionChange);
			}
		};
	}, [user, presenceChannel]);

	// FETCH DOCUMENT CONTENT & USER INFO
	useEffect(() => {
		const fetchDocument = async () => {
			try {
				const {
					data: { user: supabaseUser },
				} = await supabase.auth.getUser();

				if (!supabaseUser?.id || !supabaseUser?.email) {
					console.error("User data is incomplete");
					return;
				}

				const userData: User = {
					id: supabaseUser.id,
					email: supabaseUser.email,
					username: supabaseUser.email.split("@")[0],
				};

				setUser(userData);

				const doc = await getDocument(id, userData.id);
				if (doc) {
					setContent(doc?.content);
					setOwnerId(doc?.ownerId);
				}
			} catch (err) {
				console.error("Error fetching document:", err);
			}
		};

		fetchDocument();
	}, [id, supabase]);

	// CRUD HANDLERS (SAVE, DELETE, SHARE)
	const handleSave = async () => {
		try {
			setSaving(true);
			await updateDocument(id, user?.id || "", { content });
			// alert("Document saved successfully!");
			toast.success("Document saved successfully!");
		} catch (err) {
			console.error("Error saving document:", err);
			// alert("Error saving document");
			toast.error("Error saving document");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		try {
			setDeleting(true);
			await deleteDocument(id);
			// alert("Document deleted successfully!");
			toast.success("Document deleted successfully!");
			router.push("/explore");
		} catch (err) {
			console.error("Error deleting document:", err);
			// alert("Error deleting document");
			toast.error("Error deleting document");
		} finally {
			setDeleting(false);
		}
	};

	const handleShare = () => {
		setShowShareDialog(true);
	};

	// BROADCAST CONTENT CHANGES
	const broadcastContentChange = debounce(async (newContent: string) => {
		if (!presenceChannel.current || !user?.id || isLocalChange.current) {
			isLocalChange.current = false;
			return;
		}

		await presenceChannel.current.send({
			type: "broadcast",
			event: "content_change",
			payload: {
				userId: user.id,
				content: newContent,
			},
		});
	}, 100);

	const handleContentChange = (newContent: string) => {
		setContent(newContent);
		broadcastContentChange(newContent);
	};

	if (!content) {
		return (
			<div className="flex items-center h-screen justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
					<p className="mt-4 text-gray-400">Loading document...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-4xl"
			>
				<motion.div
					className="bg-gray-950 shadow-2xl rounded-xl p-8 border border-gray-800 relative"
					whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)" }}
					transition={{ duration: 0.3 }}
				>
					<div className="flex justify-between items-center mb-6">
						<motion.h1
							className="text-3xl font-bold text-white"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2, duration: 0.4 }}
						>
							Edit Document
						</motion.h1>

						<div className="flex items-center gap-6">
							<motion.div
								className="flex -space-x-3"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3, duration: 0.4 }}
							>
								{Object.values(presence).map((p: UserPresence) => (
									<motion.div
										key={p.user.id}
										className="w-10 h-10 text-black cursor-pointer rounded-full flex items-center justify-center ring-2 ring-gray-900"
										style={{ backgroundColor: getUserColor(p.user.id) }}
										title={p.user.email}
										whileHover={{ y: -5, zIndex: 10 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										{p.user.email[0].toUpperCase()}
									</motion.div>
								))}
							</motion.div>

							{ownerId && ownerId === user?.id && (
								<div className="flex gap-5">
									<motion.button
										onClick={handleDelete}
										className="text-red-500 cursor-pointer hover:text-red-400 p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
										title="Delete Document"
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
									>
										{deleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
									</motion.button>
									<motion.button
										onClick={handleShare}
										className="text-blue-400 cursor-pointer hover:text-blue-300 p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
										title="Share Document"
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.95 }}
									>
										<Share2 size={20} />
									</motion.button>
								</div>
							)}
						</div>
					</div>

					<motion.div
						ref={editorRef}
						className="relative rounded-lg overflow-hidden"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
					>
						<div className="rounded-lg p-1">
							<RichTextEditor content={content} onChange={handleContentChange} />
							<div
								className="absolute inset-0 pointer-events-none"
								style={{
									top: tipTapRef.current?.getEditor().container.querySelector(".ql-toolbar")?.offsetHeight || 0,
									zIndex: 99999,
									pointerEvents: "none",
								}}
							>
								{Object.values(presence).map(
									(p: UserPresence) =>
										p.cursor &&
										p.user.id !== user?.id && (
											<UserCursor
												key={p.user.id}
												x={p.cursor.x}
												y={p.cursor.y}
												color={getUserColor(p.user.id)}
												name={p.user.email.split("@")[0]}
											/>
										)
								)}
							</div>
						</div>
					</motion.div>

					<div className="w-full justify-end items-center flex">
						<motion.button
							onClick={handleSave}
							className="w-max font-semibold cursor-pointer bg-gradient-to-r from-slate-500 to-zinc-400 hover:from-slate-400 hover:to-zinc-500 text-white py-2 px-6 rounded-lg shadow-lg hover:shadow-pink-500/20 transition-all flex items-center justify-center gap-2"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.4 }}
						>
							<motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
								{saving ? (
									<div className="flex gap-2 items-center">
										<Loader2 size={20} className="animate-spin" />
										<span>Saving...</span>
									</div>
								) : (
									"Save Document"
								)}
							</motion.span>
						</motion.button>
					</div>
				</motion.div>

				{showShareDialog && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ type: "spring", stiffness: 300, damping: 25 }}
					>
						<ShareDialog
							documentId={id}
							ownerId={user?.id || ""}
							currentUserId={user?.id || ""}
							isOpen={showShareDialog}
							onClose={() => setShowShareDialog(false)}
						/>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
};

export default DocumentEditor;
