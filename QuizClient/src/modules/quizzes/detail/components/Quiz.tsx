"use client";

import { Button, Input, Label } from "@shared/ui";
import { Checkbox } from "@shared/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import type { QuizDetail } from "../lib/types";
import { useQuizSubmit } from "../lib/useQuizSubmit";

export type QuizProps = {
	quiz: QuizDetail;
	quizId: string;
};

export default function Quiz({ quiz, quizId }: QuizProps) {
	const {
		currentStep,
		total,
		question,
		qid,
		currentAnswer,
		isAnswered,
		handleSelect,
		handleText,
		prevStep,
		submit,
	} = useQuizSubmit({ quizId, quiz });

	return (
		<div className="w-full max-w-xl mx-auto">
			<h2 className="text-xl font-bold mb-3">{question.text}</h2>

			{/* Single choice */}
			{question.type === "single" && (
				<RadioGroup
					value={typeof currentAnswer === "string" ? currentAnswer : ""}
					onValueChange={(value) => handleSelect(value)}
				>
					{question.options.map((opt) => (
						<div key={opt.id} className="flex items-center space-x-2 mb-2">
							<RadioGroupItem value={String(opt.id)} id={`${qid}-${opt.id}`} />
							<Label htmlFor={`${qid}-${opt.id}`}>{opt.text}</Label>
						</div>
					))}
				</RadioGroup>
			)}

			{/* Multiple choice */}
			{question.type === "multiple" &&
				question.options.map((opt) => (
					<div key={opt.id} className="flex items-center space-x-2 mb-2">
						<Checkbox
							id={`${qid}-${opt.id}`}
							checked={
								Array.isArray(currentAnswer) &&
								currentAnswer.includes(String(opt.id))
							}
							onCheckedChange={() => handleSelect(String(opt.id))}
						/>
						<Label htmlFor={`${qid}-${opt.id}`}>{opt.text}</Label>
					</div>
				))}

			{/* Text input */}
			{question.type === "text" && (
				<Input
					type="text"
					value={typeof currentAnswer === "string" ? currentAnswer : ""}
					onChange={handleText}
					placeholder="Введите ваш ответ"
				/>
			)}

			{/* Navigation */}
			<div className="flex justify-between mt-10">
				<Button onClick={() => prevStep()} disabled={currentStep === 0}>
					Назад
				</Button>

				<Button onClick={submit} disabled={!isAnswered}>
					{currentStep === total - 1 ? "Завершить" : "Далее"}
				</Button>
			</div>
		</div>
	);
}
