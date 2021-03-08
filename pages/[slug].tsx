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

type Props = {
	slug?: string;
	shortlink?: Shortlink;
	display404: boolean;
};

const Redirect: NextPage<Props> = (props) => {
	const router = useRouter();

	return (
		<Layout>
			{props.display404 && <h1>Error 404</h1>}
			{props.slug && !props.display404 && <h1>{props.slug}</h1>}
		</Layout>
	);
};

export const getServerSideProps = async (context: NextPageContext) => {
	if (context.query && context.query.slug) {
		return {
			slug: context.query.slug,
		};
	} else {
		context.res.statusCode = 404;
		return {
			display404: true,
		};
	}
};

export default Redirect;