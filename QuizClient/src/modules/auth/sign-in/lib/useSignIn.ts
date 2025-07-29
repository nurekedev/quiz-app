import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignIn = () => {
	const router = useRouter();

	const onSuccess = () => {
		toast.success("Sign in successful!");
		router.push("/");
	};

	return {
		onSuccess,
	};
};
