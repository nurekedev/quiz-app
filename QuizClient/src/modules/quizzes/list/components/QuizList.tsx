"use client";

import { useFilterStore } from "../lib";
import { useQuizzes } from "../lib/api";
import { QuizCard } from "./QuizCard";
import { QuizCardSkeleton } from "./QuizCardSkeleton";

export const QuizList = () => {
	const tags = useFilterStore((state) => state.tags);
	const query = useFilterStore((state) => state.query);
	const { data, isLoading } = useQuizzes({
		query,
		tag_list: tags,
	});

	const quizList = data?.items || [];

	return (
		<div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{isLoading && <QuizCardSkeleton />}
			{!isLoading &&
				quizList.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
		</div>
	);
};
