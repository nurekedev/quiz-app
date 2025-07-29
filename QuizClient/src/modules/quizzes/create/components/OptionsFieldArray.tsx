import { FormField } from "@shared/components/form/form-field";
import { X } from "lucide-react";
import { useMemo } from "react";
import {
	type Control,
	Controller,
	type UseFormSetValue,
	useFieldArray,
	useWatch,
} from "react-hook-form";
import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import type { OptionI, QuizFormValues } from "../lib";

type Props = {
	control: Control<QuizFormValues>;
	questionIndex: number;
	type: string;
	setValue: UseFormSetValue<QuizFormValues>;
};

export function OptionsFieldArray({
	control,
	questionIndex,
	type,
	setValue,
}: Props) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: `questions.${questionIndex}.options`,
	});

	const memoizedFields = useMemo(() => fields, [fields]);

	// Получаем текущие значения опций для single choice
	const options = useWatch({
		control,
		name: `questions.${questionIndex}.options`,
	});

	// Находим индекс выбранной опции для single choice
	const selectedIndex =
		options?.findIndex((opt: OptionI) => opt.is_correct) ?? -1;

	return (
		<div className="space-y-2">
			{type === "single" ? (
				// Один RadioGroup для всех опций при single choice
				<Controller
					control={control}
					name={`questions.${questionIndex}.options`}
					render={() => (
						<RadioGroup
							value={selectedIndex >= 0 ? String(selectedIndex) : undefined}
							onValueChange={(val) => {
								fields.forEach((_, i) =>
									setValue(
										`questions.${questionIndex}.options.${i}.is_correct`,
										i === Number(val),
									),
								);
							}}
						>
							{memoizedFields.map((opt, idx) => (
								<div key={opt.id} className="relative">
									<FormField
										fieldName={`questions.${questionIndex}.options.${idx}.text`}
										control={control}
										config={{
											label: "Option",
											placeholder: "Enter option text",
										}}
									/>
									<div className="absolute top-4.5 right-2 flex items-center gap-2">
										<RadioGroupItem value={String(idx)} />
										<Button
											type="button"
											variant="link"
											className="!px-0"
											onClick={() => remove(idx)}
										>
											<X className="size-5" />
										</Button>
									</div>
								</div>
							))}
						</RadioGroup>
					)}
				/>
			) : (
				// Отдельные чекбоксы для multiple choice
				memoizedFields.map((opt, idx) => (
					<div key={opt.id} className="relative">
						<FormField
							fieldName={`questions.${questionIndex}.options.${idx}.text`}
							control={control}
							config={{
								label: "Option",
								placeholder: "Enter option text",
							}}
						/>
						<div className="absolute top-4.5 right-2 flex items-center gap-2">
							<Controller
								control={control}
								name={`questions.${questionIndex}.options.${idx}.is_correct`}
								render={({ field }) => (
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								)}
							/>
							<Button
								type="button"
								variant="link"
								className="!px-0"
								onClick={() => remove(idx)}
							>
								<X className="size-5" />
							</Button>
						</div>
					</div>
				))
			)}
			<Button
				variant="link"
				onClick={() => append({ text: "", is_correct: false })}
				className="ml-auto block"
				type="button"
			>
				add option
			</Button>
		</div>
	);
}
