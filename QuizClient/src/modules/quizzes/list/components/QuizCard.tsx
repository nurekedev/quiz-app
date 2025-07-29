import Link from "next/link";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@shared/ui";
import { Badge } from "@shared/ui/badge";
import type { QuizI } from "../lib/api";

export const QuizCard = ({ quiz }: { quiz: QuizI }) => {
	return (
		<Card className="group hover:shadow-xl transition-all p-4 overflow-hidden gap-2">
			<div className="flex flex-wrap gap-2">
				{quiz.tags.map((tag) => (
					<Badge key={tag.id} variant="outline">
						{tag.name}
					</Badge>
				))}
			</div>
			<CardHeader className="p-0">
				<CardTitle className="group-hover:text-primary text-xl">
					{quiz.name}
				</CardTitle>
				<CardDescription className="text-sm">
					{quiz.description}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex items-center justify-between p-0">
				<p className="text-sm text-muted-foreground">
					{new Date(quiz.created_at).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>

				<Link href={`/${quiz.id}`}>
					<Button className="bg-transparent text-primary hover:bg-primary hover:text-white">
						Start Quiz
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
};
