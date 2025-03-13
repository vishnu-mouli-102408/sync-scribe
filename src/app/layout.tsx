import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Real Time Notes",
	description: "This is a real time notes app built with Tailwind CSS and websockets.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang="en">
			<head>
				<link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
				<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
				<link rel="shortcut icon" href="/favicon/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
				<link rel="manifest" href="/favicon/site.webmanifest" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
				<main>
					{children}
					<Toaster richColors />
				</main>
			</body>
		</html>
	);
}
