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

import Adapter from "./Adapter";

import faunadb from "faunadb";

import { hashPassword } from "./../helpers/crypto";

const q: typeof faunadb.query = faunadb.query;

export class FaunaAdapter extends Adapter {
	client: faunadb.Client;

	constructor(secret: string) {
		super();
		this.client = new faunadb.Client({
			secret: secret,
		});
	}

	async getShortlink(id: string): Promise<Shortlink> {
		const response: any = await this.client.query(q.Get(parseInt(id)));
		const shortlink: Shortlink = {
			id: response.ref.toString(),
			slug: response.data.slug,
			target: response.data.target,
			editKey: response.data.editKey,
		};
		return shortlink;
	}

	async getShortlinkBySlug(slug: string): Promise<Shortlink> {
		const response: any = await this.client.query(
			q.Get(q.Match(q.Index("links_by_slug"), slug))
		);
		const shortlink: Shortlink = {
			id: response.ref.toString(),
			slug: response.data.slug,
			target: response.data.target,
			editKey: response.data.editKey,
		};
		return shortlink;
	}

	async createShortlink(shortlink: Shortlink): Promise<Shortlink> {
		const hashedPassword: string = await hashPassword(shortlink.editKey);
		const response: any = await this.client.query(
			q.Create(q.Collection("links"), {
				data: {
					editKey: hashedPassword,
					slug: shortlink.slug,
					target: shortlink.target,
				},
			})
		);
		return {
			id: response.ref.id,
			editKey: hashedPassword,
			slug: shortlink.slug,
			target: shortlink.target,
		};
	}

	async deleteShortlink(shortlink: Shortlink): Promise<true> {
		const response: any = await this.client.query(
			q.Delete(parseInt(shortlink.id))
		);
		return true;
	}
}

export default FaunaAdapter;
