import { create } from "zustand";
import { persist } from "zustand/middleware";

type FilterStore = {
	query: string;
	debouncedQuery?: string;
	tags: string[];

	setQuery: (query: string) => void;
	setDebouncedQuery: (query: string) => void;
	addTag: (tag: string) => void;
	removeTag: (tag: string) => void;
};

export const useFilterStore = create<FilterStore>()(
	persist(
		(set) => ({
			query: "",
			debouncedQuery: "",
			tags: [],

			setQuery: (query) => set({ query }),
			setDebouncedQuery: (debouncedQuery) => set({ debouncedQuery }),
			addTag: (tag) =>
				set((state) => ({
					tags: [...state.tags, tag],
				})),
			removeTag: (tag) =>
				set((state) => ({
					tags: state.tags.filter((t) => t !== tag),
				})),
		}),
		{
			name: "filter-store",
		},
	),
);
