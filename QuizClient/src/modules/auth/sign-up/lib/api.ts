import { apiRequest } from "@/lib/api";
import type { SignUpFormI } from "./types";

export const SignUp = async (data: SignUpFormI) => {
	const finalData = {
		full_name: `${data.firstName} ${data.lastName}`,
		username: data.username,
		password: data.password,
	};

	await apiRequest<void>("post", "/auth/register/", finalData, "auth");
};
