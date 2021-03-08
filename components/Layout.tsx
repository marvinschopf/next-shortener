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
import { Fragment, FunctionComponent } from "react";

import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";

import "bootstrap/dist/css/bootstrap.min.css";

type Props = {
	title?: string;
};

const Layout: FunctionComponent<Props> = ({
	children,
	title = "Next Shortener",
}) => {
	return (
		<Fragment>
			<Head>
				<title>{title}</title>
			</Head>
			<Container>
				<Jumbotron>
					{title && <h1>{title}</h1>}
					{children}
				</Jumbotron>
			</Container>
		</Fragment>
	);
};

export default Layout;
