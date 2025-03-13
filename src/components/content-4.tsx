import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ContentSection() {
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto max-w-5xl px-6">
				<div className="grid gap-6 md:grid-cols-2 md:gap-12">
					<h2 className="text-4xl font-medium">
						Write, Share, and Collaborate with Ease.Represents a continuous flow of updates
					</h2>
					<div className="space-y-6">
						<p>
							Easily share notes with colleagues, friends, or anyone by adding their email, just like Google Docs. With
							seamless cloud integration, secure access control, and instant updates via WebSockets, SyncScribe is your
							go-to platform for efficient and hassle-free note-taking.
						</p>
						<p>
							SyncScribe is designed to make{" "}
							<span className="font-bold">note-taking simple, fast, and collaborative.</span> No more lost notes or
							outdated versions—SyncScribe ensures that your notes are always up to date with real-time syncing.
						</p>
						<Button asChild variant="secondary" size="sm" className="gap-1 pr-1.5">
							<Link href="#">
								<span>Learn More</span>
								<ChevronRight className="size-2" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
