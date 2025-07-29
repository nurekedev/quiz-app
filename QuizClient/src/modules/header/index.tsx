import Link from "next/link";
import { NavUser } from "@modules/header/components/nav-user";

export const Header = ({ isAdmin }: { isAdmin: boolean }) => {
	return (
		<div className="flex items-center justify-between py-4">
			<Link href="/" className="text-2xl font-bold">
				Quizz App
			</Link>
			<div className="flex items-center gap-6">
				{isAdmin && (
					<div className="flex gap-4">
						<Link href="/" className="hover:underline">
							Quizzes
						</Link>
						<Link href="/create" className="hover:underline">
							Create Quiz
						</Link>
					</div>
				)}
				<NavUser />
			</div>
		</div>
	);
};
