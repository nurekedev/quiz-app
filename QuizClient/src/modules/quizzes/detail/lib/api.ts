import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import type { QuizDetail, QuizRateI } from "./types";

export const getQuizByID = async (id: string) => {
	return apiRequest<QuizDetail>("get", `/quizzes/${id}`);
};

export const useQuizDetail = (id: string) => {
	return useQuery({
		queryKey: ["quizDetail", id],
		queryFn: () => getQuizByID(id),
	});
};

const getQuizResults = async (id: string) => {
	return apiRequest<ApiResponse<QuizRateI>>(
		"get",
		`/quizzes/${id}/result-list`,
	);
};

export const useQuizResults = (id: string) => {
	return useQuery({
		queryKey: ["quizResults", id],
		queryFn: () => getQuizResults(id),
	});
};

export const rateQuiz = async (quizId: string, data: { rating: number }) => {
	return apiRequest("post", `/quizzes/${quizId}/rate`, { body: data });
};
