import CreateQuizForm from "./components/CreateQuizForm";

export const QuizCreatePage = () => {
	return (
		<div>
			<h1 className="text-2xl font-bold">Create Quiz</h1>
			<p>
				Fill out the form below to create a new quiz. Make sure to provide
				accurate information and add questions that are engaging and
				informative.
			</p>
			<CreateQuizForm />
		</div>
	);
};
