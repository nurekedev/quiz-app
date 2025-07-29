import dynamic from "next/dynamic";
import { FormLoader } from "@shared/components/form/form-loader";

const SignInPage = dynamic(() => import("@modules/auth/sign-in"), {
	loading: () => <FormLoader />,
});

export default function Page() {
	return <SignInPage />;
}
