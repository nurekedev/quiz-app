import { QuizDetailPage } from "@quizzes/detail";

export default async function page({
	params,
}: {
	params: Promise<{ quizId: string }>;
}) {
	const { quizId } = await params;
	
	return <QuizDetailPage quizId={quizId} />;
}
