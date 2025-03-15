"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import MenuBar from "./menu-bar";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
}
const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
	const editor = useEditor({
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

	return (
		<div className="max-w-4xl mx-auto py-8">
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
};

export default RichTextEditor;
