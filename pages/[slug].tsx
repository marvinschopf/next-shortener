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

import { NextPage } from "next";
import { useRouter } from "next/router";
import Adapter from "../adapter/Adapter";
import getAdapter from "./../adapter/AdapterManager";

import type { NextPageContext } from "next";
import Layout from "../components/Layout";
import { Fragment } from "react";

type Props = {
	slug?: string;
	shortlink?: Shortlink;
	display404: boolean;
};

const Redirect: NextPage<Props> = (props) => {
	const router = useRouter();

	if (props.display404) {
		return (
			<Layout title="Error 404">
				<p>
					Unfortunately, the requested short link could not be found.
				</p>
			</Layout>
		);
	} else {
		return <Layout></Layout>;
	}
};

export const getServerSideProps = async (context: NextPageContext) => {
	if (context.query && context.query.slug) {
		const database: Adapter = getAdapter();
		try {
			const shortlink: Shortlink = await database.getShortlinkBySlug(
				context.query.slug.toString()
			);
			if (shortlink && shortlink.target) {
				context.res.writeHead(307, { location: shortlink.target });
				context.res.end();
				return {
					props: {
						slug: context.query.slug,
						shortlink: shortlink,
						display404: false,
					},
				};
			} else {
				context.res.statusCode = 404;
				return {
					props: {
						display404: true,
					},
				};
			}
		} catch (e) {
			context.res.statusCode = 404;
			return {
				props: {
					display404: true,
				},
			};
		}
	} else {
		context.res.statusCode = 404;
		return {
			props: {
				display404: true,
			},
		};
	}
};

export default Redirect;
