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

import { ChangeEvent, FunctionComponent, useState } from "react";
import Layout from "../components/Layout";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Index: FunctionComponent = () => {
	const [targetUrl, setTargetUrl] = useState("");

	return (
		<Layout title="Kurzlink erstellen">
			<Form
				onSubmit={(event) => {
					event.preventDefault();
					alert(targetUrl);
				}}
			>
				<Form.Group controlId="formBasicTarget">
					<Form.Label>Target URL</Form.Label>
					<Form.Control
						type="text"
						placeholder="Target URL"
						onChange={(event) => {
							setTargetUrl(event.target.value);
							console.log(event.target.value);
						}}
					/>
				</Form.Group>
				<Button variant="primary" size="lg" block type="submit">
					Save
				</Button>
			</Form>
		</Layout>
	);
};
