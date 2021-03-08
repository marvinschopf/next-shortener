import type { NextApiRequest, NextApiResponse } from 'next'

import {generateKey, randomString} from "./../../helpers/crypto";

import getAdapter from "./../../adapter/AdapterManager";
import Adapter from '../../adapter/Adapter';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method == "post") {
        if(req.body && req.body.target) {

            const editKey: string = generateKey();

            let shortlink: Shortlink = {
                target: req.body.target,
                id: null,
                slug: randomString(4),
                editKey
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
                error: "INVALID"
            });
        }
    } else {
        res.status(405).json({
            success: false,
            error: "NOT_ALLOWED"
        });
    }
}