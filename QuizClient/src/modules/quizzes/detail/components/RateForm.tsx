import { Button, Form } from "@shared/ui";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@shared/ui/form";
import { Star } from "lucide-react";
import { useQuizRate } from "../lib/useQuizRate";

export const RateForm = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
	const { form, hoverValue, setHoverValue, onSubmit } = useQuizRate(setOpen);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="rating"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Choose a rating</FormLabel>
							<FormControl>
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											className="p-1 transition-colors hover:scale-110"
											onMouseEnter={() => setHoverValue(star)}
											onMouseLeave={() => setHoverValue(0)}
											onClick={() => field.onChange(star)}
										>
											<Star
												className={`w-6 h-6 transition-colors ${
													star <= (hoverValue || field.value)
														? "fill-yellow-400 text-yellow-400"
														: "text-gray-300"
												}`}
											/>
										</button>
									))}
								</div>
							</FormControl>
							<FormDescription>Click on the stars to rate</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full">
					Submit Feedback
				</Button>
			</form>
		</Form>
	);
};
