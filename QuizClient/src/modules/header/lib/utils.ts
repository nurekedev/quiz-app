import Cookies from "js-cookie";

export const logout = () => {
	Cookies.remove("accessToken");
	Cookies.remove("refreshToken");
	window.location.href = "/auth/sign-in";
};
