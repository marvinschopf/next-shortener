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

import { Fragment, FunctionComponent } from "react";
import useDarkMode, { DarkMode } from "use-dark-mode";

const DarkModeProvider: FunctionComponent = (props) => {
	const darkMode: DarkMode = useDarkMode();

	return (
		<Fragment>
			<style jsx global>{`
				#__next {
					height: 100%;
				}
			`}</style>
			{darkMode.value && (
				<div className="bg-dark text-light" style={{ height: "100%" }}>
					{props.children}
				</div>
			)}
			{!darkMode.value && (
				<div className="bg-light text-dark" style={{ height: "100%" }}>
					{props.children}
				</div>
			)}
		</Fragment>
	);
};

export default DarkModeProvider;
