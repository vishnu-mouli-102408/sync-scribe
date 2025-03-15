"use client";
import Link from "next/link";
import { Logo } from "./logo";
import { Loader2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface HeroHeaderProps {
	user: User | null;
}

export const HeroHeader = ({ user }: HeroHeaderProps) => {
	const [menuState, setMenuState] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [loggingOut, setLoggingOut] = useState(false);

	console.log("USER CLIENT", user);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const router = useRouter();

	const handleLogOut = async () => {
		console.log("LOGOUT");
		setLoggingOut(true);
		try {
			const response = await signOut();
			console.log("LOGOUT RESPONSE", response);

			if (response?.status === 200) {
				router.push("/sign-in");
				toast.success(response.message, {
					description: "User Logged Out successfully",
					duration: 3000,
					position: "bottom-center",
					closeButton: true,
				});
			} else {
				toast.error(response.message, {
					description: "There was an error logging out. Please try again later.",
					duration: 3000,
					position: "bottom-center",
					closeButton: true,
				});
			}
		} catch (error) {
			console.log("LOGOUT ERROR", error);
			toast.error("Oops! Something went wrong.", {
				description: "There was an error logging out. Please try again later.",
				duration: 3000,
				position: "bottom-center",
				closeButton: true,
			});
		} finally {
			setLoggingOut(false);
		}
	};

	return (
		<header>
			<nav data-state={menuState && "active"} className="fixed z-20 w-full px-2">
				<div
					className={cn(
						"mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
						isScrolled && "bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5"
					)}
				>
					<div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
						<div className="flex w-full justify-between lg:w-auto">
							<Link href="/" aria-label="home" className="flex items-center space-x-2">
								<Logo />
							</Link>

							<button
								onClick={() => setMenuState(!menuState)}
								aria-label={menuState == true ? "Close Menu" : "Open Menu"}
								className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
							>
								<Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
								<X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
							</button>
						</div>

						<div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
							<div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
								{user ? (
									<>
										<Button asChild size="sm" variant="outline" className={cn(isScrolled && "lg:hidden")}>
											<Link href="/explore">
												<span>Start Writing</span>
											</Link>
										</Button>
										<Button
											onClick={handleLogOut}
											asChild
											size="sm"
											className={cn("cursor-pointer", isScrolled && "lg:hidden")}
										>
											{loggingOut ? (
												<span>
													<Loader2 className="w-4 h-4 animate-spin " />
													Logging Out...
												</span>
											) : (
												<span>Logout</span>
											)}
										</Button>
									</>
								) : (
									<>
										<Button asChild variant="outline" size="sm" className={cn(isScrolled && "lg:hidden")}>
											<Link href="/sign-in">
												<span>Login</span>
											</Link>
										</Button>
										<Button asChild size="sm" className={cn(isScrolled && "lg:hidden")}>
											<Link href="/sign-up">
												<span>Sign Up</span>
											</Link>
										</Button>
									</>
								)}

								<Button asChild size="sm" className={cn(isScrolled ? "lg:inline-flex" : "hidden")}>
									<Link href={user ? "/explore" : "/sign-up"}>
										<span>{user ? "Explore" : "Get Strated"}</span>
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};
