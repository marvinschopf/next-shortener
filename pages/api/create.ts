import type { NextApiRequest, NextApiResponse } from 'next'

import {generateKey, randomString} from "./../../helpers/crypto";

import getAdapter from "./../../adapter/AdapterManager";
import Adapter from '../../adapter/Adapter';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === "POST") {
        if(req.body) {
            const body = JSON.parse(req.body);
            if(body.target) {
                const editKey: string = generateKey();

                let shortlink: Shortlink = {
                    target: body.target,
                    id: null,
                    slug: randomString(4, true),
                    editKey,
                    encrypted: body.encrypted && body.encrypted == true ? true : false
                }

                const database: Adapter = getAdapter();

                shortlink = await database.createShortlink(shortlink);
                shortlink.editKey = editKey;

                res.status(200).json({
                    success: true,
                    shortlink
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: "INVALID",
                    errorMessage:  "No target URL in request body."
                });
            }
        } else {
            res.status(400).json({
                success: false,
                error: "INVALID",
                errorMessage: "No body in request."
            });
        }
    } else {
        res.status(405).json({
            success: false,
            error: "NOT_ALLOWED"
        });
    }
}