import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuizAnswers = Record<string, string | string[]>;

interface QuizState {
	quizStarted: boolean;
	currentStep: number;
	answers: QuizAnswers;
	score?: number;
	setAnswer: (questionId: string, answer: string | string[]) => void;
	nextStep: (total: number) => void;
	prevStep: () => void;
	resetQuiz: () => void;
	setQuizStarted: () => void;
	setScore: (score: number) => void;
}

export const useQuizStore = create<QuizState>()(
	persist(
		(set) => ({
			quizStarted: false,
			currentStep: 0,
			answers: {},
			score: undefined,
			setScore: (score) => set({ score }),
			setQuizStarted: () => set({ quizStarted: true }),
			setAnswer: (questionId, answer) =>
				set((state) => ({
					answers: { ...state.answers, [questionId]: answer },
				})),
			nextStep: (total) =>
				set((state) => ({
					currentStep: Math.min(state.currentStep + 1, total - 1),
				})),
			prevStep: () =>
				set((state) => ({
					currentStep: Math.max(state.currentStep - 1, 0),
				})),
			resetQuiz: () =>
				set({
					currentStep: 0,
					answers: {},
					quizStarted: false,
					score: undefined,
				}),
		}),
		{ name: "quiz-storage" },
	),
);
