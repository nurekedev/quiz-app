import type { QuestionApiResponse, TagI } from "@quizzes/create/lib";
import z from "zod";
import type { ApiResponse } from "@/lib/types";

export type QuizDetail = {
	id: string;
	name: string;
	description: string;
	tags: TagI[];
	created_at: string;
	questions: ApiResponse<QuestionApiResponse>;
};

export type QuizRateI = {
	id: number;
	started_at: string;
	completed_at: string;
	rating: number | null;
	quiz_id: number;
	user_id: number;
	total_score: number;
	user: {
		full_name: string;
		username: string;
	};
};

export const RateFormSchema = z.object({
	rating: z
		.number()
		.min(1, {
			message: "Please select a rating.",
		})
		.max(5),
});

export type RateFormValues = z.infer<typeof RateFormSchema>;
