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
import { Fragment, useState, useRef, MutableRefObject } from "react";

import AES from "crypto-js/aes";

import Layout from "../components/Layout";

import { getBaseURL } from "./../helpers/meta";

import { CopyToClipboard } from "react-copy-to-clipboard";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FaClipboard, FaClipboardCheck, FaLock } from "react-icons/fa";

import HCaptcha from "@hcaptcha/react-hcaptcha";

type Props = {
	baseUrl: string;
	hcaptchaSiteKey?: string;
	hcaptchaEnabled?: boolean;
};

const Index: NextPage<Props> = ({
	baseUrl,
	hcaptchaEnabled,
	hcaptchaSiteKey,
}) => {
	const [targetUrl, setTargetUrl] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [createdShortlink, setCreatedShortlink] = useState(null);
	const [shortLinkCopied, setShortLinkCopied] = useState(false);
	const [isEncrypted, setEncrypted] = useState(false);
	const [encryptionPassword, setEncryptionPassword] = useState("");
	const [verifyEncryptionPassword, setVerifyEncryptionPassword] = useState(
		""
	);

	const [error, setError] = useState("");

	const [hcaptchaToken, setHcaptchaToken] = useState("");

	const hcaptchaElement: MutableRefObject<HCaptcha> = useRef();

	return (
		<Layout title="Next Shortener">
			{error.length >= 1 && (
				<Alert variant="danger">
					<b>Error: </b> {error}
				</Alert>
			)}

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
					if (
						(hcaptchaEnabled && hcaptchaToken.length >= 1) ||
						!hcaptchaEnabled
					) {
						if (isEncrypted) {
							if (
								encryptionPassword === verifyEncryptionPassword
							) {
								const response = await fetch("/api/create", {
									method: "POST",
									body: JSON.stringify({
										target: AES.encrypt(
											targetUrl,
											encryptionPassword
										).toString(),
										encrypted: true,
										hcaptchaToken: hcaptchaToken,
									}),
								});
								setIsLoading(false);
								if (response.status === 200) {
									const json = await response.json();
									setCreatedShortlink(json.shortlink);
									setEncryptionPassword("");
									setVerifyEncryptionPassword("");
									setEncrypted(false);
									setError("");
									hcaptchaElement.current.resetCaptcha();
								} else {
									hcaptchaElement.current.resetCaptcha();
									setError(response.status.toString());
								}
							} else {
								setIsLoading(false);
								setError(
									"The encryption passwords do not match."
								);
							}
						} else {
							const response = await fetch("/api/create", {
								method: "POST",
								body: JSON.stringify({
									target: targetUrl,
									hcaptchaToken: hcaptchaToken,
								}),
							});
							setIsLoading(false);
							if (response.status === 200) {
								const json = await response.json();
								setCreatedShortlink(json.shortlink);
							} else {
								setError(response.status.toString());
							}
						}
					} else {
						setIsLoading(false);
						setError("Please solve the captcha.");
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
						required
					/>
				</Form.Group>
				<Form.Group>
					<Form.Check
						type="checkbox"
						onChange={(event) => {
							setEncrypted(event.target.checked);
						}}
						label={
							<Fragment>
								<FaLock /> Encrypted redirect
							</Fragment>
						}
					/>
				</Form.Group>
				{isEncrypted && (
					<Fragment>
						<Form.Group>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								required
								onChange={(event) => {
									setEncryptionPassword(event.target.value);
								}}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Verify Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Verify Password"
								required
								onChange={(event) => {
									setVerifyEncryptionPassword(
										event.target.value
									);
								}}
							/>
						</Form.Group>
					</Fragment>
				)}
				{hcaptchaEnabled && (
					<HCaptcha
						ref={hcaptchaElement}
						sitekey={hcaptchaSiteKey}
						onVerify={(token: string) => {
							setHcaptchaToken(token);
						}}
						onExpire={() => {
							setHcaptchaToken("");
						}}
						onError={() => {
							setHcaptchaToken("");
						}}
					/>
				)}
				<Button
					variant="primary"
					size="lg"
					block
					type="submit"
					disabled={isLoading}
				>
					Save
				</Button>
			</Form>
		</Layout>
	);
};

Index.getInitialProps = async () => {
	return {
		baseUrl: getBaseURL(),
		hcaptchaSiteKey: process.env.HCAPTCHA_SITE_KEY
			? process.env.HCAPTCHA_SITE_KEY
			: "",
		hcaptchaEnabled: process.env.HCAPTCHA_SITE_KEY ? true : false,
	};
};

export default Index;
