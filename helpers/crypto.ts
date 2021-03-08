/**
 * next-shortener
 * Copyright (C) 2021 Marvin Schopf
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import argon2 from "argon2";
import { randomBytes, createHash } from "crypto";

export const hashPassword = async (password: string): Promise<string> => {
	return await argon2.hash(password, {
		type: argon2.argon2id,
	});
};

export const randomString = (size: number): string => {
	return randomBytes(size).toString("hex");
};

export const sha256 = (str: string): string => {
	return createHash("sha256").update(str).digest("hex");
};

export const generateKey = (): string => {
	return sha256(randomString(128) + randomString(128));
};
