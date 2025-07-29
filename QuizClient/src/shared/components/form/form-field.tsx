import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@shared/ui/select";
import { Textarea } from "@shared/ui/textarea";
import type { Control, FieldValues, Path } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	FormField as UIFormField,
} from "../../ui";
import type { FieldConfig } from "./dynamic-form";

export type FieldType =
	| "text"
	| "email"
	| "password"
	| "number"
	| "select"
	| "textarea"
	| "radio"
	| "checkbox";

type CustomFormFieldProps<T extends FieldValues> = {
	fieldName: string;
	control: Control<T>;
	config: FieldConfig;
	selectItems?: { value: string; label: string }[];
	type?: FieldType;
};

export const FormField = <T extends FieldValues>({
	fieldName,
	control,
	config,
	selectItems,
	type = "text",
}: CustomFormFieldProps<T>) => {
	return (
		<UIFormField
			control={control}
			name={fieldName as Path<T>}
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel>{config.label}</FormLabel>
					<FormControl>
						{type === "select" && selectItems ? (
							<Select onValueChange={field.onChange} value={field.value}>
								<SelectTrigger className="w-full">
									<SelectValue
										placeholder={config.placeholder || "Выберите значение"}
									/>
								</SelectTrigger>
								<SelectContent>
									{selectItems.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						) : type === "textarea" ? (
							<Textarea
								placeholder={config.placeholder}
								value={field.value?.toString() ?? ""}
								onChange={field.onChange}
								onBlur={field.onBlur}
								name={field.name}
								ref={field.ref}
							/>
						) : (
							<Input
								type={config.type || "text"}
								placeholder={config.placeholder}
								value={field.value?.toString() ?? ""}
								onChange={field.onChange}
								onBlur={field.onBlur}
								name={field.name}
								ref={field.ref}
							/>
						)}
					</FormControl>
					{config.description && (
						<FormDescription>{config.description}</FormDescription>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
