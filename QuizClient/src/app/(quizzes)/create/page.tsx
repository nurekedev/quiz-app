import { QuizCreatePage } from "@quizzes/create";
import { verifyJwt } from "@shared/utils/verifyJwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
	const refreshToken = (await cookies()).get("refreshToken");

	const { isAdmin } = await verifyJwt(refreshToken?.value || "");

	if (!isAdmin) {
		redirect("/");
	}

	return <QuizCreatePage />;
}
