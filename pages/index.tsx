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
import { Fragment, useState, useRef, MutableRefObject } from "react";

import AES from "crypto-js/aes";

import Layout from "../components/Layout";

import { getAppName, getBaseURL } from "./../helpers/meta";

import { CopyToClipboard } from "react-copy-to-clipboard";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FaClipboard, FaClipboardCheck, FaLock } from "react-icons/fa";

import HCaptcha from "@hcaptcha/react-hcaptcha";

import isURL from "validator/lib/isURL";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

type Props = {
	baseUrl: string;
	hcaptchaSiteKey?: string;
	hcaptchaEnabled?: boolean;
	appName: string;
};

const Index: NextPage<Props> = ({
	baseUrl,
	hcaptchaEnabled,
	hcaptchaSiteKey,
	appName,
}) => {
	const { t } = useTranslation("common");

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

	const router = useRouter();

	return (
		<Layout appName={appName}>
			{error.length >= 1 && (
				<Alert variant="danger">
					<b>{t("Error")}: </b> {error}
				</Alert>
			)}

			{createdShortlink && (
				<Alert variant="success">
					<p>
						<b>{t("SuccessfullyCreated")}</b>
					</p>
					<Form.Group>
						<Form.Label>{t("ShortLink")}</Form.Label>
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
						if (!isURL(targetUrl)) {
							setIsLoading(false);
							setError(t("EnterValidURL"));
							return;
						}
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
								if (hcaptchaEnabled)
									hcaptchaElement.current.resetCaptcha();
								setIsLoading(false);
								if (response.status === 200) {
									const json = await response.json();
									setCreatedShortlink(json.shortlink);
									setEncryptionPassword("");
									setVerifyEncryptionPassword("");
									setEncrypted(false);
									setError("");
								} else {
									setError(response.status.toString());
								}
							} else {
								setIsLoading(false);
								setError(t("PasswordsDontMatch"));
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
						setError(t("SolveCaptcha"));
					}
				}}
			>
				<Form.Group controlId="formBasicTarget">
					<Form.Label>{t("DestinationURL")}</Form.Label>
					<Form.Control
						type="text"
						placeholder={t("DestinationURL")}
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
								<FaLock /> {t("EncryptedRedirect")}
							</Fragment>
						}
					/>
				</Form.Group>
				{isEncrypted && (
					<Fragment>
						<Form.Group>
							<Form.Label>{t("Password")}</Form.Label>
							<Form.Control
								type="password"
								placeholder={t("Password")}
								required
								onChange={(event) => {
									setEncryptionPassword(event.target.value);
								}}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>{t("VerifyPassword")}</Form.Label>
							<Form.Control
								type="password"
								placeholder={t("VerifyPassword")}
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
						languageOverride={
							router.locale ? router.locale : "auto"
						}
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
					{t("Save")}
				</Button>
			</Form>
		</Layout>
	);
};

export const getStaticProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale, ["common"])),
		baseUrl: getBaseURL(),
		hcaptchaSiteKey: process.env.HCAPTCHA_SITE_KEY
			? process.env.HCAPTCHA_SITE_KEY
			: "",
		hcaptchaEnabled: process.env.HCAPTCHA_SITE_KEY ? true : false,
		appName: getAppName(),
	},
});

export default Index;
