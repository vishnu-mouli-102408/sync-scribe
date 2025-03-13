import CallToAction from "@/components/call-to-action";
import ContentSection from "@/components/content-4";
import Features from "@/components/features-2";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";

export default function Home() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<HeroSection />
			<Features />
			<ContentSection />
			<CallToAction />
			<FooterSection />
		</div>
	);
}
