import { Button } from "@shared/ui";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@shared/ui/dialog";
import { RateForm } from "./RateForm";

export const RateQuiz = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger onClick={() => setIsOpen(true)}>
				<Button className="mt-4">Rate Quiz</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rate this Quiz</DialogTitle>
					<DialogDescription>
						Please provide your feedback on the quiz to help other learners. Do
						you think this quiz was helpful?
					</DialogDescription>
				</DialogHeader>
				<RateForm setOpen={setIsOpen} />
			</DialogContent>
		</Dialog>
	);
};
