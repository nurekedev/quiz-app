import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30 * 1000 * 10,
			gcTime: 30 * 1000,
			refetchOnWindowFocus: true,
			retry: 0,
		},
	},
});

export { queryClient };
