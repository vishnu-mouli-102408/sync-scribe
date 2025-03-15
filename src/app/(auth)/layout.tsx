import { getuserSession } from "@/actions/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const AuthLayout = async ({
	children,
}: Readonly<{
	children: ReactNode;
}>) => {
	const response = await getuserSession();
	if (response?.status === 200) {
		redirect("/");
	}
	return <div>{children}</div>;
};

export default AuthLayout;
