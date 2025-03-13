import { Logo } from "@/components/logo";
import Link from "next/link";

const links = [
	{
		title: "Features",
		href: "#",
	},
	// {
	// 	title: "Solution",
	// 	href: "#",
	// },
	// {
	// 	title: "Customers",
	// 	href: "#",
	// },
	// {
	// 	title: "Pricing",
	// 	href: "#",
	// },
	{
		title: "Help",
		href: "#",
	},
	{
		title: "About",
		href: "#",
	},
];

export default function FooterSection() {
	return (
		<footer className="py-16 md:py-32">
			<div className="mx-auto max-w-5xl px-6">
				<Link href="/" aria-label="go home" className="mx-auto block size-fit">
					<Logo />
				</Link>

				<div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
					{links.map((link, index) => (
						<Link key={index} href={link.href} className="text-muted-foreground hover:text-primary block duration-150">
							<span>{link.title}</span>
						</Link>
					))}
				</div>
				<div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
					<Link
						href="https://x.com/iamVishnuMouli"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="X/Twitter"
						className="text-muted-foreground hover:text-primary block"
					>
						<svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
							></path>
						</svg>
					</Link>
					<Link
						href="https://www.linkedin.com/in/ganivada-mouli/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn"
						className="text-muted-foreground hover:text-primary block"
					>
						<svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
							></path>
						</svg>
					</Link>
					{/* <Link
						href="#"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Facebook"
						className="text-muted-foreground hover:text-primary block"
					>
						<svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
							></path>
						</svg>
					</Link>
					<Link
						href="#"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Threads"
						className="text-muted-foreground hover:text-primary block"
					>
						<svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
								d="M19.25 8.505c-1.577-5.867-7-5.5-7-5.5s-7.5-.5-7.5 8.995s7.5 8.996 7.5 8.996s4.458.296 6.5-3.918c.667-1.858.5-5.573-6-5.573c0 0-3 0-3 2.5c0 .976 1 2 2.5 2s3.171-1.027 3.5-3c1-6-4.5-6.5-6-4"
								color="currentColor"
							></path>
						</svg>
					</Link>
					<Link
						href="#"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Instagram"
						className="text-muted-foreground hover:text-primary block"
					>
						<svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
							></path>
						</svg>
					</Link> */}
					<Link
						href="https://github.com/vishnu-mouli-102408"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Github"
						className="text-muted-foreground hover:text-primary block"
					>
						<svg
							className="size-6"
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="47"
							viewBox="0 0 48 47"
							id="github"
						>
							<g id="Icons" fill="currentColor" fillRule="evenodd" stroke="none" strokeWidth="1">
								<g id="Black" fill="currentColor" transform="translate(-700 -560)">
									<path
										id="Github"
										d="M723.999 560C710.745 560 700 570.787 700 584.097c0 10.644 6.876 19.675 16.414 22.861 1.2.222 1.639-.522 1.639-1.16 0-.573-.021-2.088-.034-4.098-6.676 1.456-8.085-3.23-8.085-3.23-1.09-2.784-2.663-3.525-2.663-3.525-2.18-1.495.165-1.465.165-1.465 2.407.17 3.674 2.483 3.674 2.483 2.143 3.683 5.618 2.62 6.986 2.002.217-1.557.838-2.619 1.524-3.221-5.33-.609-10.932-2.675-10.932-11.908 0-2.63.934-4.781 2.47-6.466-.247-.61-1.07-3.059.235-6.377 0 0 2.015-.647 6.6 2.47 1.915-.534 3.967-.801 6.008-.811 2.039.01 4.092.277 6.01.811 4.58-3.117 6.592-2.47 6.592-2.47 1.31 3.318.486 5.767.239 6.377 1.538 1.685 2.467 3.835 2.467 6.466 0 9.256-5.611 11.293-10.957 11.89.86.744 1.629 2.213 1.629 4.462 0 3.22-.03 5.819-.03 6.61 0 .644.432 1.394 1.65 1.157C741.13 603.763 748 594.738 748 584.097c0-13.31-10.746-24.097-24.001-24.097"
									></path>
								</g>
							</g>
						</svg>
					</Link>
				</div>
				<span className="text-muted-foreground block text-center text-sm">
					{" "}
					© {new Date().getFullYear()} Sync Slide, All rights reserved
				</span>
			</div>
		</footer>
	);
}
