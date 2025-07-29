import { Button } from "@shared/ui";
import { useFormContext } from "react-hook-form";
import type { QuizFormValues } from "../lib";

export const QuizFormBtn = () => {
	const {
		formState: { isValid, isSubmitting },
	} = useFormContext<QuizFormValues>();

	return (
		<Button type="submit" disabled={!isValid || isSubmitting}>
			{isSubmitting ? "Creating..." : "Create Quiz"}
		</Button>
	);
};
