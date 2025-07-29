import { useEffect, useState } from "react";

export const useDebounce = (query: string, debounce = 500) => {
	const [debouncedQuery, setDebouncedQuery] = useState(query);
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		setIsPending(true);
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
			setIsPending(false);
		}, debounce);

		return () => {
			clearTimeout(handler);
			setIsPending(false);
		};
	}, [query, debounce]);

	return { debouncedQuery, isPending };
};
