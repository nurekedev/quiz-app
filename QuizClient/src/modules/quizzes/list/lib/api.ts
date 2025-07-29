import type { TagI } from "@quizzes/create/lib";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";

export type QuizI = {
	id: number;
	name: string;
	description: string;
	created_at: string;
	tags: TagI[];
};

type getQuizzesQuery = {
	query: string;
	tag_list?: string[];
};

const getQuizzes = (query: getQuizzesQuery) => {
	const params = new URLSearchParams();

	if (query.query) {
		params.append("query", query.query);
	}

	if (query.tag_list && query.tag_list.length > 0) {
		params.append("tag_list", query.tag_list.join(","));
	}

	const queryString = params.toString();
	const url = queryString ? `/quizzes?${queryString}` : "/quizzes";

	return apiRequest<ApiResponse<QuizI>>("get", url);
};

export const useQuizzes = (query: getQuizzesQuery) => {
	return useQuery({
		queryKey: ["quizzes", query],
		queryFn: () => getQuizzes(query),
	});
};

const getTags = () => {
	return apiRequest<ApiResponse<TagI>>("get", "/quizzes/tags");
};

export const useTags = () => {
	return useQuery({
		queryKey: ["tags"],
		queryFn: getTags,
	});
};
