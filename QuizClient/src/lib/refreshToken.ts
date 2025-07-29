import type { SignInResponseI } from "@modules/auth/sign-in/lib";
import { logout } from "@modules/header/lib/utils";
import axios from "axios";
import Cookies from "js-cookie";
import type { NextRequest } from "next/server";
import { CORE_API, coreClient } from "./api";

export const refreshToken = async (): Promise<SignInResponseI> => {
	try {
		const refreshToken = Cookies.get("refreshToken");
		const response = await axios.post(
			`${CORE_API}auth/refresh?refresh_token=${refreshToken}`,
			{ refresh_token: refreshToken },
			{
				withCredentials: true,
			},
		);
		const { access_token, refresh_token } = response.data as SignInResponseI;
		setTokens(access_token, refresh_token);
		return { access_token, refresh_token };
	} catch (error) {
		logout();
		throw error;
	}
};

export const setTokens = (
	access_token: string,
	refresh_token: string,
	req?: NextRequest,
) => {
	// Проверка на валидность токена
	if (!access_token || access_token.trim() === "") {
		return;
	}

	// Установка cookies с флагами безопасности
	Cookies.set("accessToken", access_token, {
		expires: 1 / 24,
		sameSite: "strict",
	});

	Cookies.set("refreshToken", refresh_token, {
		expires: 30,
		sameSite: "strict",
	});

	coreClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;

	if (req) {
		req.cookies.set("accessToken", access_token);
	}
};
