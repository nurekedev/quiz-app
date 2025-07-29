import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Award } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@shared/ui/table";
import type { QuizRateI } from "../lib/types";

const getMedalColor = (position: number) => {
	switch (position) {
		case 1:
			return "text-yellow-500";
		case 2:
			return "text-gray-400";
		case 3:
			return "text-amber-700";
		default:
			return "";
	}
};

const columns: ColumnDef<QuizRateI>[] = [
	{
		accessorKey: "id",
		header: "Position",
		cell: ({ row }) => {
			const pos = row.index + 1; // Позиция по индексу в таблице
			const color = getMedalColor(pos);
			return (
				<div className="flex items-center gap-2">
					{pos <= 3 && <Award className={`w-5 h-5 ${color}`} />}
					<span>{pos}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "user.full_name",
		header: "Player",
		cell: ({ row }) => (
			<span className="font-medium">{row.original.user.full_name}</span>
		),
	},
	{
		accessorKey: "total_score",
		header: "Points",
		cell: ({ row }) => (
			<span className="font-semibold">{row.original.total_score} pt.</span>
		),
	},
];

export const TopList = ({
	isLoading,
	error,
	data,
}: {
	isLoading: boolean;
	error: Error | null;
	data: QuizRateI[];
}) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>An error occurred: {error.message}</div>;
	}

	if (!data) {
		return <div>No data available.</div>;
	}

	return (
		<div className="rounded-xl border p-4 shadow-md bg-white w-full">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id} className="text-sm font-bold">
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id} className="py-2 text-start">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
