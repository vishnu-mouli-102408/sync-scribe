// app/documents/[id]/page.tsx

import DocumentEditor from "@/components/document-editor";
import { createClient } from "@/utils/supabase/server";

interface DocumentPageProps {
	params: Promise<{ id: string }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
	const { id } = await params;

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return <p className="p-4">Please log in to access this document.</p>;
	}

	return (
		<div className="min-h-screen">
			<DocumentEditor id={id} />
		</div>
	);
}
