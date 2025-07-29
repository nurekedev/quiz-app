import { Skeleton } from "@shared/ui/skeleton";

export const QuizCardSkeleton = () => {
	return (
		<>
			<Skeleton className="h-80 w-full" />
			<Skeleton className="h-80 w-full" />
			<Skeleton className="h-80 w-full" />
			<Skeleton className="h-80 w-full" />
		</>
	);
};
