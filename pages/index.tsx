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
import { useState } from "react";
import Layout from "../components/Layout";

import { getBaseURL } from "./../helpers/meta";

import { CopyToClipboard } from "react-copy-to-clipboard";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FaClipboard, FaClipboardCheck } from "react-icons/fa";

type Props = {
	baseUrl: string;
};

const Index: NextPage<Props> = ({ baseUrl }) => {
	const [targetUrl, setTargetUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [createdShortlink, setCreatedShortlink] = useState(null);
	const [shortLinkCopied, setShortLinkCopied] = useState(false);

	return (
		<Layout title="Next Shortener">
			{createdShortlink && (
				<Alert variant="success">
					<p>
						<b>Successfully created!</b>
					</p>
					<Form.Group>
						<Form.Label>Shortlink</Form.Label>
						<Row>
							<Col xs={12} lg={11} md={8}>
								<Form.Control
									disabled
									value={`${baseUrl}${createdShortlink.slug}`}
								/>
							</Col>
							<Col lg={1} md={4} xs={12}>
								<CopyToClipboard
									text={`${baseUrl}${createdShortlink.slug}`}
									onCopy={() => {
										setShortLinkCopied(true);
									}}
								>
									<Button variant="secondary" block>
										{!shortLinkCopied && <FaClipboard />}
										{shortLinkCopied && (
											<FaClipboardCheck />
										)}
									</Button>
								</CopyToClipboard>
							</Col>
						</Row>
					</Form.Group>
				</Alert>
			)}
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
					setIsLoading(false);
					if (response.status === 200) {
						const json = await response.json();
						setCreatedShortlink(json.shortlink);
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

Index.getInitialProps = async () => {
	return { baseUrl: getBaseURL() };
};

export default Index;
