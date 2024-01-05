import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import {
    create as createService,
    update as updateService,
} from '../services/user';

const join: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    await createService({ email, password });
    res.status(201).end();
});

const update: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    const result = await updateService({ email, password });

    if (result[0].affectedRows >= 1) {
        res.status(204).end();
        return;
    }
    res.status(422).end();
});

export { join, update };
