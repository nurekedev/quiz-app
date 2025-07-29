import type { ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { apiRequest } from "@/lib/api";
import type { QuizProps } from "../components/Quiz";
import { useQuizStore } from "./useQuizStore";

export const useQuizSubmit = ({ quizId, quiz }: QuizProps) => {
	const {
		currentStep,
		answers,
		setAnswer,
		nextStep,
		prevStep,
		setScore,
		reset,
	} = useQuizStore(
		useShallow((state) => ({
			currentStep: state.currentStep,
			answers: state.answers,
			setAnswer: state.setAnswer,
			nextStep: state.nextStep,
			prevStep: state.prevStep,
			setScore: state.setScore,
			reset: state.resetQuiz,
		})),
	);

	const questions = quiz.questions.items;
	const total = quiz.questions.total;
	const question = questions[currentStep];
	const qid = String(question.id);

	const currentAnswer =
		answers[qid] ?? (question.type === "multiple" ? [] : "");

	const handleSelect = (optionId: string): void => {
		if (question.type === "multiple") {
			const selected = Array.isArray(currentAnswer) ? currentAnswer : [];
			const newAnswer = selected.includes(optionId)
				? selected.filter((id) => id !== optionId)
				: [...selected, optionId];
			setAnswer(qid, newAnswer);
		} else {
			setAnswer(qid, optionId);
		}
	};

	const handleText = (e: ChangeEvent<HTMLInputElement>): void =>
		setAnswer(qid, e.target.value);

	const isAnswered =
		(question.type === "text" &&
			typeof currentAnswer === "string" &&
			currentAnswer.trim().length > 0) ||
		(question.type === "multiple" &&
			Array.isArray(currentAnswer) &&
			currentAnswer.length > 0) ||
		(question.type === "single" &&
			typeof currentAnswer === "string" &&
			currentAnswer !== "");

	const formatAnswersForSubmit = () => {
		const formattedAnswers: Record<string, string> = {};

		for (const [questionId, answer] of Object.entries(answers)) {
			if (Array.isArray(answer)) {
				formattedAnswers[questionId] = answer.join(",");
			} else {
				formattedAnswers[questionId] = answer;
			}
		}

		return formattedAnswers;
	};

	const submit = async () => {
		if (currentStep === total - 1) {
			const score = await apiRequest<number>(
				"post",
				`quizzes/${quizId}/submit`,
				{
					answers: formatAnswersForSubmit(),
				},
			);
			reset();
			setScore(score);
		}
		nextStep(total);
	};

	return {
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
	};
};
