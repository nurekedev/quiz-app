"use client";

import { FormField } from "@shared/components/form/form-field";
import { Form } from "@shared/ui";
import { Button } from "@shared/ui/button";
import { useQuizCreate } from "../lib";
import { QuestionField } from "./QuestionField";
import { QuizFormBtn } from "./QuizFormBtn";
import { TagSelector } from "./TagSelector";

export default function QuizForm() {
	const { methods, control, handleSubmit, fields, append, remove, onSubmit } =
		useQuizCreate();

	return (
		<Form {...methods}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6 max-w-2xl my-10"
			>
				<FormField
					fieldName="name"
					control={control}
					config={{ label: "Name", placeholder: "Enter quiz name" }}
				/>

				<FormField
					fieldName="description"
					control={control}
					config={{ label: "Description", placeholder: "Enter description" }}
				/>

				<TagSelector />

				<QuestionField fields={fields} remove={remove} />

				<div className="flex justify-end">
					<Button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							append({ text: "", type: "text", point: 1, options: [] });
						}}
						className="mb-0 mr-2"
						variant="link"
					>
						Add Question
					</Button>

					<QuizFormBtn />
				</div>
			</form>
		</Form>
	);
}
