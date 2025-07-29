import Link from "next/link";

export const SignInFooter = () => {
	return (
		<p className="text-center text-sm w-full">
			<span className="text-gray-500">Don't have an account?</span>{" "}
			<Link href="/auth/sign-up" className="text-primary font-medium">Sign up</Link>
		</p>
	);
};
