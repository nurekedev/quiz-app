"use client";

import { DynamicForm } from "@shared/components";
import { SignInFooter } from "./components/SingInFooter";
import { signInFieldConfig, signInFormSchema, useSignIn } from "./lib";
import { SignIn } from "./lib/api";

export default function SignInPage() {
	const { onSuccess } = useSignIn();

	return (
		<DynamicForm
			schema={signInFormSchema}
			onSuccess={onSuccess}
			fields={signInFieldConfig}
			onSubmit={SignIn}
			submitText="Sign In"
			title="Sign In"
			description="Please enter your credentials to sign in."
			footer={<SignInFooter />}
		/>
	);
}
