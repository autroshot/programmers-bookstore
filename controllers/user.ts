import {
    create as createService,
    update as updateService,
} from '@services/user';
import { createSalt, hashPassword } from '@utils/encryption';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const join: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    const salt = createSalt();
    const hashedPassword = hashPassword(password, salt);
    await createService({ email, password: hashedPassword, salt });

    res.status(StatusCodes.CREATED).end();
});

const update: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    const salt = createSalt();
    const hashedPassword = hashPassword(password, salt);
    const result = await updateService({
        email,
        password: hashedPassword,
        salt,
    });

    if (result[0].affectedRows >= 1) {
        res.status(StatusCodes.NO_CONTENT).end();
        return;
    }
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
});

export { join, update };
