import { FormField } from "@shared/components/form/form-field";
import { useFormContext } from "react-hook-form";
import type { QuizFormValues } from "../lib";
import { useTags } from "../lib/api";

export const TagSelector = () => {
	const { control } = useFormContext<QuizFormValues>();
	const { data } = useTags();

	const tags =
		data?.items.map((tag) => ({
			value: tag.name,
			label: tag.name,
		})) || [];

	return (
		<FormField
			fieldName="tags"
			control={control}
			config={{
				label: "Tags",
				placeholder: "Enter tags separated by commas",
			}}
			type="select"
			selectItems={tags}
		/>
	);
};
