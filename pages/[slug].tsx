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
import { FaLock, FaLockOpen } from "react-icons/fa";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useState } from "react";

import { enc as CryptoEnc } from "crypto-js";
import AES from "crypto-js/aes";
import isURL from "validator/lib/isURL";
import { getAppName } from "../helpers/meta";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

type Props = {
	slug?: string;
	shortlink?: Shortlink;
	display404: boolean;
	isEncrypted?: boolean;
	appName: string;
};

const Redirect: NextPage<Props> = (props) => {
	const { t } = useTranslation("common");

	const router = useRouter();

	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	if (props.display404) {
		return (
			<Layout title={t("Error404").toString()} appName={props.appName}>
				<h1>{t("Error404")}</h1>
				<p>
					Unfortunately, the requested short link could not be found.
				</p>
			</Layout>
		);
	} else {
		if (props.isEncrypted) {
			return (
				<Layout
					title={t("EncryptedLink").toString()}
					appName={props.appName}
				>
					<h1>
						<FaLock /> {t("EncryptedLink")}
					</h1>
					{error.length >= 1 && (
						<Alert variant="danger">
							<b>{t("Error")}: </b> {error}
						</Alert>
					)}
					<Form
						onSubmit={(event) => {
							event.preventDefault();
							try {
								const decryptedTarget: string = AES.decrypt(
									props.shortlink.target,
									password
								).toString(CryptoEnc.Utf8);
								if (!isURL(decryptedTarget)) {
									setError(t("InvalidDestinationURL"));
									return;
								}
								router.push(decryptedTarget);
							} catch (e) {
								setError(t("DecryptionFailed"));
								return;
							}
						}}
					>
						<Form.Group>
							<Form.Label>{t("Password")}</Form.Label>
							<Form.Control
								type="password"
								placeholder={t("Password")}
								required
								onChange={(event) => {
									setPassword(event.target.value);
								}}
							/>
						</Form.Group>
						<Button variant="primary" block size="lg" type="submit">
							<FaLockOpen /> {t("Decrypt")}
						</Button>
					</Form>
				</Layout>
			);
		}
		return <Layout appName={props.appName}></Layout>;
	}
};

export const getServerSideProps = async (context: NextPageContext) => {
	const appName: string = getAppName();
	if (context.query && context.query.slug) {
		const database: Adapter = getAdapter();
		try {
			const shortlink: Shortlink = await database.getShortlinkBySlug(
				context.query.slug.toString()
			);
			if (shortlink && shortlink.target) {
				if (shortlink.encrypted && shortlink.encrypted == true) {
					return {
						props: {
							slug: context.query.slug,
							isEncrypted: true,
							display404: false,
							shortlink: shortlink,
							appName,
							// @ts-ignore
							...(await serverSideTranslations(context.locale, [
								"common",
							])),
						},
					};
				} else {
					context.res.writeHead(307, { location: shortlink.target });
					context.res.end();
					return {
						props: {
							slug: context.query.slug,
							shortlink: shortlink,
							display404: false,
							isEncrypted: false,
							appName,
							// @ts-ignore
							...(await serverSideTranslations(context.locale, [
								"common",
							])),
						},
					};
				}
			} else {
				context.res.statusCode = 404;
				return {
					props: {
						display404: true,
						isEncrypted: false,
						appName,
						// @ts-ignore
						...(await serverSideTranslations(context.locale, [
							"common",
						])),
					},
				};
			}
		} catch (e) {
			context.res.statusCode = 404;
			return {
				props: {
					display404: true,
					isEncrypted: false,
					appName,
					// @ts-ignore
					...(await serverSideTranslations(context.locale, [
						"common",
					])),
				},
			};
		}
	} else {
		context.res.statusCode = 404;
		return {
			props: {
				display404: true,
				isEncrypted: false,
				appName,
				// @ts-ignore
				...(await serverSideTranslations(context.locale, ["common"])),
			},
		};
	}
};

export default Redirect;
