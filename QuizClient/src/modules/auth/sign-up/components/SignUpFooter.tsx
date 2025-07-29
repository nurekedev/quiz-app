import Link from "next/link";

export const SignUpFooter = () => {
	return (
		<p className="text-center text-sm w-full">
			<span className="text-gray-500">Already have an account?</span>{" "}
			<Link href="/auth/sign-in" className="text-primary font-medium">
				Sign in
			</Link>
		</p>
	);
};
