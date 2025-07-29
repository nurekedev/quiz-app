import { FormField } from "@shared/components/form/form-field";
import { Button, Label } from "@shared/ui";
import { memo } from "react";
import {
	Controller,
	type FieldArrayWithId,
	useFormContext,
	useWatch,
} from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shared/ui/select";
import type { QuizFormValues } from "../lib";
import { OptionsFieldArray } from "./OptionsFieldArray";

const QuestionTypes = [
	{ value: "text", label: "Text" },
	{ value: "single", label: "Single Choice" },
	{ value: "multiple", label: "Multiple Choice" },
];

const SingleQuestion = memo(
	({
		question,
		index,
		remove,
	}: {
		question: FieldArrayWithId<QuizFormValues, "questions", "id">;
		index: number;
		remove: (index: number) => void;
	}) => {
		const { control, setValue } = useFormContext<QuizFormValues>();

		const type = useWatch({
			control,
			name: `questions.${index}.type`,
		});

		return (
			<div key={question.id} className="border p-3 rounded space-y-4">
				<FormField
					fieldName={`questions.${index}.text`}
					control={control}
					config={{
						label: "Question",
						placeholder: "Enter question text",
					}}
				/>

				<div className="grid grid-cols-2 gap-2 items-center">
					<Controller
						control={control}
						name={`questions.${index}.type`}
						render={({ field }) => (
							<Label className="flex-col gap-2 items-start">
								Type
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Question Type" />
									</SelectTrigger>
									<SelectContent>
										{QuestionTypes.map((item) => (
											<SelectItem key={item.value} value={item.value}>
												{item.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Label>
						)}
					/>

					<FormField
						fieldName={`questions.${index}.point`}
						control={control}
						config={{
							label: "Points",
							placeholder: "Enter points",
							type: "number",
						}}
					/>
				</div>

				{type === "text" && (
					<FormField
						fieldName={`questions.${index}.correct_text_answer`}
						control={control}
						config={{
							label: "Right Answer",
							placeholder: "Enter right answer",
						}}
					/>
				)}

				{(type === "single" || type === "multiple") && (
					<OptionsFieldArray
						control={control}
						questionIndex={index}
						type={type}
						setValue={setValue}
					/>
				)}

				<Button
					type="button"
					variant="destructive"
					onClick={() => remove(index)}
					className="mr-auto"
				>
					Remove Question
				</Button>
			</div>
		);
	},
);

SingleQuestion.displayName = "SingleQuestion";

interface QuestionFieldProps {
	fields: FieldArrayWithId<QuizFormValues, "questions", "id">[];
	remove: (index: number) => void;
}

export const QuestionField = ({ fields, remove }: QuestionFieldProps) => {
	return (
		<div className="space-y-4">
			{fields.map((question, index) => (
				<SingleQuestion
					key={question.id}
					question={question}
					index={index}
					remove={remove}
				/>
			))}
		</div>
	);
};
