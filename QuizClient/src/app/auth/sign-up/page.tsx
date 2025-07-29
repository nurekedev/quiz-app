import dynamic from "next/dynamic";
import { FormLoader } from "@shared/components";

const SignUpPage = dynamic(() => import("@modules/auth/sign-up"), {
	loading: () => <FormLoader />,
});

export default function page() {
	return <SignUpPage />;
}
