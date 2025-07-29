import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { User } from "./types";

const getUser = async () => {
	return await apiRequest<User>("get", "/auth/me/");
};

export const useUserData = () => {
	return useQuery({
		queryKey: ["userData"],
		queryFn: getUser,
	});
};
