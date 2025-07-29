import { type NextRequest, NextResponse } from "next/server";

const createRedirectResponse = (req: NextRequest, path: string) => {
	console.error("Redirecting to:", path);
	return NextResponse.redirect(new URL(path, req.url));
};

const isPublicPath = (pathname: string) => {
	return (
		pathname.startsWith("/auth") ||
		pathname.startsWith("/static") ||
		pathname.startsWith("/api") ||
		pathname === "/favicon.ico"
	);
};

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const refreshToken = req.cookies.get("refreshToken")?.value;
	const hasAuth = !!refreshToken;

	if (isPublicPath(pathname)) {
		if (hasAuth) {
			return createRedirectResponse(req, "/");
		}

		return NextResponse.next();
	}

	// Protect all other paths
	if (!hasAuth) {
		console.warn("Unauthorized access attempt to:", pathname);
		return createRedirectResponse(req, "/auth/sign-in");
	}

	return NextResponse.next();
}
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
