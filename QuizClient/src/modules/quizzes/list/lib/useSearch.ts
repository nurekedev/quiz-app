import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@shared/hooks/useDebounce";
import { useFilterStore } from "./index";

export const useSearch = () => {
	const [localQuery, setLocalQuery] = useState("");
	const setQuery = useFilterStore((state) => state.setQuery);

	const { debouncedQuery } = useDebounce(localQuery);

	useEffect(() => {
		setQuery(debouncedQuery);
	}, [debouncedQuery, setQuery]);

	const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const newQuery = e.target.value;
		setLocalQuery(newQuery);
	}, []);

	return {
		localQuery,
		handleSearch,
	};
};
