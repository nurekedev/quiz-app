"use client";

import { Skeleton } from "@shared/ui/skeleton";
import { useFilterTag } from "../../lib";
import { Tag } from "./Tag";

export const FilterTag = () => {
	const { allTags, onChange, isLoading } = useFilterTag();

	return (
		<div className="flex flex-wrap items-center gap-2 my-2">
			{isLoading && <Skeleton className="h-8 w-24" />}
			{allTags?.map(({ tag, checked }) => (
				<Tag
					key={tag.id}
					tag={tag}
					checked={checked}
					onChange={() => onChange(tag)}
				/>
			))}
		</div>
	);
};
