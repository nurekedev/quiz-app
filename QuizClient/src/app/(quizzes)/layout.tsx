import { verifyJwt } from "@shared/utils/verifyJwt";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { Header } from "@modules/header";

export default async function layout({ children }: { children: ReactNode }) {
	const refreshToken = (await cookies()).get("refreshToken");

	const { isAdmin } = await verifyJwt(refreshToken?.value || "");

	return (
		<main className="max-w-7xl mx-auto space-y-4 px-4 xl:px-0">
			<Header isAdmin={isAdmin} />
			<main>{children}</main>
		</main>
	);
}
