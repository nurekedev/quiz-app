"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@shared/ui";
import { useSearch } from "../../lib";

export const Search = () => {
	const { localQuery, handleSearch } = useSearch();

	return (
		<div className="relative">
			<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-4" />
			<Input
				type="search"
				placeholder="Search quizzes..."
				className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
				value={localQuery}
				onChange={handleSearch}
			/>
		</div>
	);
};
