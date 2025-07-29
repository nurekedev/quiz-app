import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignUp = () => {
	const router = useRouter();

	const onSuccess = () => {
		toast.success("Registration successful! Please sign in.");
		router.push("/auth/sign-in");
	};

	return {
		onSuccess,
	};
};
