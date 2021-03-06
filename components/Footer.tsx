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

import { useRouter } from "next/router";
import { Fragment, FunctionComponent } from "react";
import useDarkMode, { DarkMode } from "use-dark-mode";

import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";

const Footer: FunctionComponent = () => {
	const router = useRouter();

	const darkMode: DarkMode = useDarkMode();

	return (
		<Fragment>
			<div className="d-flex">
				<div>
					<Form.Control
						as="select"
						aria-label="Language"
						onChange={(event) => {
							router.push(
								{
									pathname: router.pathname,
									query: router.query,
								},
								router.asPath,
								{ locale: event.target.value }
							);
						}}
					>
						<option selected={router.locale === "en"} value="en">
							English
						</option>
						<option selected={router.locale === "de"} value="de">
							Deutsch
						</option>
					</Form.Control>
				</div>
				<div className="ml-auto">
					Powered by{" "}
					<a href="https://github.com/marvinschopf/next-shortener">
						next-shortener
					</a>
				</div>
			</div>
		</Fragment>
	);
};

export default Footer;
