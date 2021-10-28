import { Response, NextFunction, Request } from "express";
import { ExtendedRequest } from "../types/types";
import { UNAUTHORIZED_ERROR } from "../constants";
import firebaseAdmin from "../utils/firebaseService";

import { auth } from "firebase-admin";

export const getAuthToken = (
	req: Request,
	_res: Response,
	next: NextFunction
): any => {
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "Bearer"
	) {
		(req as ExtendedRequest).authToken =
			req.headers.authorization.split(" ")[1];
	} else {
		(req as ExtendedRequest).authToken = null;
	}
	next();
};

export const getAuthId = async (
	req: Request,
	_res: Response,
	next: NextFunction
): Promise<any> => {
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "Bearer"
	) {
		const authToken = req.headers.authorization.split(" ")[1];
		(req as ExtendedRequest).authToken = authToken;
		try {
			const userInfo = await firebaseAdmin
				.auth()
				.verifyIdToken(authToken);

			(req as ExtendedRequest).authId = userInfo.uid;
		} catch (err) {
			(req as ExtendedRequest).authToken = null;
			(req as ExtendedRequest).authId = null;
		}
	} else {
		(req as ExtendedRequest).authToken = null;
		(req as ExtendedRequest).authId = null;
	}
	next();
};

export const checkIfAuthenticated = (
	req: ExtendedRequest,
	res: Response,
	next: NextFunction
): any => {
	getAuthToken(req, res, async () => {
		try {
			if (!req.authToken) return res.status(401).json(UNAUTHORIZED_ERROR);

			const userInfo = await firebaseAdmin
				.auth()
				.verifyIdToken(req.authToken);

			req.authId = userInfo.uid;

			return next();
		} catch (e) {
			return res.status(401).json(UNAUTHORIZED_ERROR);
		}
	});
};

export const getUserInfo = async (
	authToken: string | null
): Promise<auth.DecodedIdToken | null> => {
	try {
		if (!authToken) return null;
		return await firebaseAdmin.auth().verifyIdToken(authToken);
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const checkIfAdmin = (
	req: ExtendedRequest,
	res: Response,
	next: NextFunction
): any => {
	getAuthToken(req, res, async () => {
		try {
			if (!req.authToken) return res.status(401).json(UNAUTHORIZED_ERROR);

			const userInfo = await firebaseAdmin
				.auth()
				.verifyIdToken(req.authToken);

			if (userInfo.admin === true) {
				req.authId = userInfo.uid;
				return next();
			}

			throw new Error("unauthorized");
		} catch (e) {
			return res.status(401).json(UNAUTHORIZED_ERROR);
		}
	});
};

export const makeUserAdmin = async (userId: string): Promise<boolean> => {
	try {
		await firebaseAdmin.auth().setCustomUserClaims(userId, { admin: true });
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};
