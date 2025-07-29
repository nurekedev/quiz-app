import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { QuizFormSchema, type QuizFormValues } from "./types";

export const useQuizCreate = () => {
	const methods = useForm<QuizFormValues>({
		resolver: zodResolver(QuizFormSchema),
		defaultValues: {
			name: "",
			description: "",
			tags: "",
			questions: [],
		},
	});

	const { register, control, handleSubmit, setValue } = methods;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "questions",
	});

	const { mutateAsync } = useMutation({
		mutationFn: async (data: QuizFormValues) => {
			const finalData = {
				...data,
				tags: [data.tags],
			};
			return await apiRequest("post", "/quizzes", finalData);
		},
		onSuccess: () => {
			toast.success("Quiz created successfully!");
			queryClient.invalidateQueries({
				queryKey: ["quizzes"],
			});
			methods.reset();
		},
		onError: (error) => {
			toast.error(`Error creating quiz: ${error.message}`);
		},
	});

	const onSubmit = async (data: QuizFormValues) => {
		await mutateAsync(data);
	};

	return {
		methods,
		register,
		control,
		handleSubmit,
		setValue,
		fields,
		append,
		remove,
		onSubmit,
	};
};
