export const __prod__ = process.env.NODE_ENV === "production";

export const EMAIL_EXISTS = {
	code: "EMAIL_EXISTS",
	message: "Email Address already exists",
};

export const AUTH_FAIL_ERROR = {
	code: "AUTH_FAIL",
	message: "Incorrect Email Address or Password",
};

export const NOT_LOGGED_IN_ERROR = {
	code: "NOT_LOGGED_IN",
	message: "You are not logged in.",
};

export const USER_NOT_FOUND_ERROR = {
	code: "USER_NOT_FOUND",
	message: "User with provided User ID was not found",
};

export const UNAUTHORIZED_ERROR = {
	code: "UNAUTHORIZED",
	message: "You are not authorized to do this action.",
};
