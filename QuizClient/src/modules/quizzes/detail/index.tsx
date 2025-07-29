"use client";

import { Button } from "@shared/ui";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Quiz from "./components/Quiz";
import { RateQuiz } from "./components/RateQuiz";
import { TopList } from "./components/TopList";
import { useQuizOverview } from "./lib/useQuizOverview";

export const QuizDetailPage = ({ quizId }: { quizId: string }) => {
	const {
		data,
		isLoading,
		error,
		quizStarted,
		startQuiz,
		handleGoHome,
		score,
		quizResults,
		isLoadingResults,
		errorResults,
	} = useQuizOverview(quizId);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="animate-spin size-10" />
			</div>
		);
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	if (!data) {
		return <div>No quiz data available.</div>;
	}

	return (
		<div className="max-w-7xl mx-auto flex flex-col items-center justify-center  h-dvh space-y-4 px-4 xl:px-0">
			{!score && score !== 0 && !quizStarted && (
				<div className="space-x-4">
					<Link href="/">Go to Home</Link>
					<Button onClick={() => startQuiz(quizId)}>Start Quiz</Button>
				</div>
			)}

			{quizStarted && <Quiz quiz={data} quizId={quizId} />}

			{(score || score === 0) && (
				<div className="flex flex-col items-center justify-center h-dvh">
					<h2 className="text-2xl font-bold">Your Score: {score.toFixed(2)}</h2>
					<p className="text-lg">Thank you for participating!</p>
					<RateQuiz />
					<div className="mt-5">
						<Button onClick={handleGoHome} className="text-lg" variant="link">
							Go to Home
						</Button>
						<Button
							onClick={() => startQuiz(quizId)}
							className="text-lg"
							variant="link"
						>
							Retry
						</Button>
					</div>
				</div>
			)}
			{!quizStarted && quizResults && quizResults.items.length > 0 && (
				<TopList
					isLoading={isLoadingResults}
					error={errorResults}
					data={quizResults.items}
				/>
			)}
		</div>
	);
};
