"use server";

import { importSPKI, jwtVerify } from "jose";

const PUBLIC_KEY = process.env.PUBLIC_KEY;
if (!PUBLIC_KEY)
	throw new Error("PUBLIC_KEY environment variable is not defined");

export async function verifyJwt(
	token: string,
): Promise<{ isValid: boolean; isAdmin: boolean }> {
	if (!PUBLIC_KEY) return { isValid: false, isAdmin: false };

	if (!token) {
		console.error("No token provided for verification");
		return { isValid: false, isAdmin: false };
	}
	try {
		// Импортируем публичный ключ
		const publicKey = await importSPKI(PUBLIC_KEY, "RS256");

		// Верифицируем JWT токен
		const { payload } = await jwtVerify(token, publicKey, {
			algorithms: ["RS256"],
		});

		return { isValid: true, isAdmin: payload.role === "ADMIN" };
	} catch (err) {
		console.error("JWT verification failed:", err);
		return { isValid: false, isAdmin: false };
	}
}
