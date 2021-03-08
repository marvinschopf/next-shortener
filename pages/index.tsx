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
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Layout title="Next Shortener">
			<Form
				onSubmit={async (event) => {
					event.preventDefault();
					setIsLoading(true);
					const response = await fetch("/api/create", {
						method: "POST",
						body: JSON.stringify({
							target: targetUrl,
						}),
					});
					if (response.status === 200) {
						const json = await response.json();
						alert(json.shortlink.slug);
					} else {
						alert(response.status);
					}
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

export default Index;
