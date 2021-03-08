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

export const getBaseURL = (): string => {
	if (process.env.VERCEL_URL) {
		if (process.env.VERCEL_URL.slice(-1) === "/") {
			if (
				process.env.VERCEL_URL.startsWith("http://") ||
				process.env.VERCEL_URL.startsWith("https://")
			) {
				return process.env.VERCEL_URL;
			} else {
				return `https://${process.env.VERCEL_URL}`;
			}
		} else {
			if (process.env.VERCEL_URL.startsWith("http")) {
				return process.env.VERCEL_URL + "/";
			} else {
				return `https://${process.env.VERCEL_URL}/`;
			}
		}
	}
	if (process.env.BASE_URL) {
		if (process.env.BASE_URL.slice(-1) === "/") {
			if (
				process.env.BASE_URL.startsWith("http://") ||
				process.env.BASE_URL.startsWith("https://")
			) {
				return process.env.BASE_URL;
			} else {
				return `https://${process.env.BASE_URL}`;
			}
		} else {
			if (
				process.env.BASE_URL.startsWith("http://") ||
				process.env.BASE_URL.startsWith("https://")
			) {
				return process.env.BASE_URL + "/";
			} else {
				return `https://${process.env.BASE_URL}/`;
			}
		}
	}
	return "/";
};
