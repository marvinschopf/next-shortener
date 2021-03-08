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

import { useState } from "react";

import { enc as CryptoEnc } from "crypto-js";
import AES from "crypto-js/aes";

type Props = {
	slug?: string;
	shortlink?: Shortlink;
	display404: boolean;
	isEncrypted?: boolean;
};

const Redirect: NextPage<Props> = (props) => {
	const router = useRouter();

	const [password, setPassword] = useState("");

	if (props.display404) {
		return (
			<Layout title="Error 404">
				<p>
					Unfortunately, the requested short link could not be found.
				</p>
			</Layout>
		);
	} else {
		if (props.isEncrypted) {
			return (
				<Layout title="Encrypted link" omitTitle={true}>
					<h1>
						<FaLock /> Encrypted link
					</h1>
					<Form
						onSubmit={(event) => {
							event.preventDefault();
							router.push(
								AES.decrypt(
									props.shortlink.target,
									password
								).toString(CryptoEnc.Utf8)
							);
						}}
					>
						<Form.Group>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								required
								onChange={(event) => {
									setPassword(event.target.value);
								}}
							/>
						</Form.Group>
						<Button variant="primary" block size="lg" type="submit">
							<FaLockOpen /> Decrypt
						</Button>
					</Form>
				</Layout>
			);
		}
		return <Layout></Layout>;
	}
};

export const getServerSideProps = async (context: NextPageContext) => {
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
						},
					};
				}
			} else {
				context.res.statusCode = 404;
				return {
					props: {
						display404: true,
						isEncrypted: false,
					},
				};
			}
		} catch (e) {
			context.res.statusCode = 404;
			return {
				props: {
					display404: true,
					isEncrypted: false,
				},
			};
		}
	} else {
		context.res.statusCode = 404;
		return {
			props: {
				display404: true,
				isEncrypted: false,
			},
		};
	}
};

export default Redirect;
