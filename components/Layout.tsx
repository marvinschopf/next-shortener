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

import Head from "next/head";
import { FunctionComponent } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";

import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
	title?: string;
	omitTitle?: boolean;
};

const Layout: FunctionComponent<Props> = ({
	children,
	title = "Next Shortener",
	omitTitle = false,
}) => {
	return (
		<div>
			<Head>
				<title>{title}</title>
			</Head>
			<Jumbotron>
				{title && !omitTitle && <h1>{title}</h1>}
				{children}
			</Jumbotron>
		</div>
	);
};

export default Layout;
