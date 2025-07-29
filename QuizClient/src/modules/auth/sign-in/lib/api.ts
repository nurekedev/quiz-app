import { apiRequest } from "@/lib/api";
import { setTokens } from "@/lib/refreshToken";
import type { SignInFormI, SignInResponseI } from "./types";

export const SignIn = async (data: SignInFormI) => {
	// Prepare the data for the API request
	const formData = new FormData();
	formData.append("username", data.username);
	formData.append("password", data.password);

	// Make the API request to sign in
	const { access_token, refresh_token } = await apiRequest<SignInResponseI>(
		"post",
		"/auth/login/",
		formData,
		"auth",
	);

	// Set the access token in cookies and axios headers
	setTokens(access_token, refresh_token);
};
