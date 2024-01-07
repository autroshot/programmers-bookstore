import {
    create as createService,
    update as updateService,
} from '@services/user';
import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const join: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    await createService({ email, password });
    res.status(StatusCodes.CREATED).end();
});

const update: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    const result = await updateService({ email, password });

    if (result[0].affectedRows >= 1) {
        res.status(StatusCodes.NO_CONTENT).end();
        return;
    }
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
});

export { join, update };
