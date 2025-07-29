import { Card, CardContent, CardFooter, CardHeader } from "@shared/ui/card";
import { Skeleton } from "../../ui/skeleton";

export const FormLoader = () => {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-1/2 mb-2" />
				<Skeleton className="h-4 w-full" />
			</CardHeader>
			<CardContent>
				<div>
					<Skeleton className="h-4 w-1/4" />
					<Skeleton className="h-10 w-full mt-2" />
				</div>
				<div className="mt-4">
					<Skeleton className="h-4 w-1/4" />
					<Skeleton className="h-10 w-full mt-2" />
				</div>
			</CardContent>
			<CardFooter>
				<Skeleton className="h-4 w-full" />
			</CardFooter>
		</Card>
	);
};
