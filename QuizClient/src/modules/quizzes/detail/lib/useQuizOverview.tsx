import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useQuizDetail, useQuizResults } from "./api";
import { useQuizStore } from "./useQuizStore";

export const useQuizOverview = (quizId: string) => {
	const router = useRouter();
	const { data, isLoading, error } = useQuizDetail(quizId);
	const {
		data: quizResults,
		isLoading: isLoadingResults,
		error: errorResults,
	} = useQuizResults(quizId);

	const quizStarted = useQuizStore((state) => state.quizStarted);
	const setQuizStarted = useQuizStore((state) => state.setQuizStarted);
	const score = useQuizStore((state) => state.score);
	const resetQuiz = useQuizStore((state) => state.resetQuiz);

	const startQuiz = async (quizId: string) => {
		await apiRequest("post", `quizzes/${quizId}/start`);
		resetQuiz();
		setQuizStarted();
	};

	const handleGoHome = () => {
		resetQuiz();
		router.push("/");
	};

	return {
		data,
		isLoading,
		error,
		quizStarted,
		startQuiz,
		handleGoHome,
		score,
		isLoadingResults,
		errorResults,
		quizResults,
	};
};
