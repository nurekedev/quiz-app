import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { rateQuiz } from "./api";
import { RateFormSchema, type RateFormValues } from "./types";

export const useQuizRate = (setOpen: (open: boolean) => void) => {
	const { quizId } = useParams();
	const [hoverValue, setHoverValue] = useState(0);
	const form = useForm<RateFormValues>({
		resolver: zodResolver(RateFormSchema),
		defaultValues: {
			rating: 0,
		},
	});

	async function onSubmit(values: RateFormValues) {
		if (!quizId) {
			toast.error("Quiz ID is missing.");
			return;
		}
		await rateQuiz(quizId as string, values);
		toast.success("Thank you for your feedback!", {
			description: `You rated this quiz ${values.rating} out of 5 stars.`,
		});
		console.log(values);
		setOpen(false);
		form.reset();
	}

	return {
		form,
		hoverValue,
		setHoverValue,
		onSubmit,
	};
};
