import z from "zod";

const OptionSchema = z.object({
	text: z.string().min(2).max(100),
	is_correct: z.boolean(),
});

export type OptionI = z.infer<typeof OptionSchema>;

const QuestionSchema = z.object({
	text: z.string().min(2).max(100),
	type: z.enum(["text", "single", "multiple"]),
	point: z.union([
		z.string().min(1, "Points must be at least 1"),
		z.number().min(1, "Points must be at least 1"),
	]),
	correct_text_answer: z.string().optional().or(z.literal("")),
	options: z.array(OptionSchema),
});

export type Question = z.infer<typeof QuestionSchema>;

export type QuestionApiResponse = {
	id: number;
	text: string;
	type: "text" | "single" | "multiple";
	point: number;
	correct_text_answer?: string;
	options: {
		id: number;
		text: string;
	}[];
};

export const QuizFormSchema = z.object({
	name: z.string().min(2).max(100),
	description: z.string().min(2).max(500).optional(),
	tags: z.string().min(1, "Choose at least one tag").max(100),
	questions: z.array(QuestionSchema).min(1).max(10),
});

export type QuizFormValues = z.infer<typeof QuizFormSchema>;

export type TagI = {
	id: string;
	name: string;
};
