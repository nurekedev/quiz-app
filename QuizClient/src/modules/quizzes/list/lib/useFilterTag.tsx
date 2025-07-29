import type { TagI } from "@quizzes/create/lib";
import { useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTags } from "./api";
import { useFilterStore } from "./useFilterStore";

export const useFilterTag = () => {
	const { tags, addTag, removeTag } = useFilterStore(
		useShallow((state) => {
			const { tags, addTag, removeTag } = state;
			return { tags, addTag, removeTag };
		}),
	);

	const { data, isLoading } = useTags();

	const tagsSet = useMemo(() => new Set(tags), [tags]);

	const allTags = useMemo(
		() =>
			data?.items
				.map((tag) => ({
					tag,
					checked: tagsSet.has(tag.id),
				}))
				.sort((a, b) => {
					if (a.checked && !b.checked) return -1;
					if (!a.checked && b.checked) return 1;
					return a.tag.name.localeCompare(b.tag.name);
				}),
		[tagsSet, data?.items],
	);

	const onChange = useCallback(
		(tag: TagI) => {
			if (tags.includes(tag.id)) {
				removeTag(tag.id);
			} else {
				addTag(tag.id);
			}
		},
		[tags, addTag, removeTag],
	);

	return {
		allTags,
		isLoading,
		onChange,
	};
};
