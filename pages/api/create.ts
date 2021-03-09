import type { NextApiRequest, NextApiResponse } from "next";

import fetch from "node-fetch";

import { generateKey, randomString } from "./../../helpers/crypto";

import getAdapter from "./../../adapter/AdapterManager";
import Adapter from "../../adapter/Adapter";

import isURL from "validator/es/lib/isURL";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "POST") {
		if (req.body) {
			const body = JSON.parse(req.body);
			if (body.target) {
				if (
					process.env.HCAPTCHA_SITE_KEY &&
					process.env.HCAPTCHA_SECRET
				) {
					if (body.hcaptchaToken) {
						const _captchaResponse = await fetch(
							"https://hcaptcha.com/siteverify",
							{
								headers: {
									"Content-Type":
										"application/x-www-form-urlencoded",
								},
								method: "POST",
								body: `response=${body.hcaptchaToken.toString()}&secret=${
									process.env.HCAPTCHA_SECRET
								}`,
							}
						);
						const captchaResponse = await _captchaResponse.json();
						if (captchaResponse.success != true) {
							res.status(400).json({
								success: false,
								error: "CAPTCHA_INVALID",
							});
							return;
						}
					} else {
						res.status(400).json({
							success: false,
							error: "CAPTCHA_MISSING",
						});
						return;
					}
				}

				const encrypted: boolean =
					body.encrypted && body.encrypted == true ? true : false;

				if (!isURL(body.target) && !encrypted) {
					res.status(400).json({
						success: false,
						error: "INVALID_TARGET",
					});
					return;
				}

				const editKey: string = generateKey();

				let shortlink: Shortlink = {
					target: body.target,
					id: null,
					slug: randomString(4, true),
					editKey,
					encrypted: encrypted,
				};

				const database: Adapter = getAdapter();

				shortlink = await database.createShortlink(shortlink);
				shortlink.editKey = editKey;

				res.status(200).json({
					success: true,
					shortlink,
				});
			} else {
				res.status(400).json({
					success: false,
					error: "INVALID",
					errorMessage: "No target URL in request body.",
				});
			}
		} else {
			res.status(400).json({
				success: false,
				error: "INVALID",
				errorMessage: "No body in request.",
			});
		}
	} else {
		res.status(405).json({
			success: false,
			error: "NOT_ALLOWED",
		});
	}
};
