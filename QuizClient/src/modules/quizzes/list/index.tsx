import { Filter } from "./components/filter/Filter";
import { QuizList } from "./components/QuizList";

export const AllQuizzes = () => {
	return (
		<div>
			<Filter />

			<h1 className="text-2xl font-bold">All Quizzes</h1>
			<p className="text-sm text-muted-foreground">
				Explore a variety of quizzes on different topics.
			</p>
			<QuizList />
		</div>
	);
};
