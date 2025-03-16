"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import MenuBar from "./menu-bar";
import { useEffect } from "react";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
}
const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
	console.log("CONTENT RICH TEXT EDITOR", content);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				bulletList: {
					HTMLAttributes: {
						class: "list-disc ml-3",
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: "list-decimal ml-3",
					},
				},
			}),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Highlight,
		],
		content: content,
		editorProps: {
			attributes: {
				class:
					"min-h-[200px] max-h-[200px] overflow-y-auto focus:border-gray-500 focus:ring-0.5 focus:outline-none border bg-gradient-to-r from-gray-950/80 to-zinc-950 p-4 rounded-lg",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	// Add this effect to update the editor when content prop changes
	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			// Prevent onChange from firing during external updates
			const currentOnUpdate = editor.options.onUpdate;
			editor.options.onUpdate = () => {};

			// Set content from props
			editor.commands.setContent(content);

			// Restore the onUpdate handler
			setTimeout(() => {
				editor.options.onUpdate = currentOnUpdate;
			}, 0);
		}
	}, [content, editor]);

	return (
		<div className="max-w-4xl mx-auto py-8">
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
};

export default RichTextEditor;
