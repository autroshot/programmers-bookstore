import { ACCESS_TOKEN_KEY } from '@@constants';
import { findOne as findOneService } from '@services/user';
import { createToken } from '@utils/auth';
import { hashPassword } from '@utils/encryption';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const basic: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    const user = await findOneService(email);

    if (user === undefined) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
        return;
    }

    const hashedInputPassword = hashPassword(password, user.salt);
    if (hashedInputPassword !== user.password) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
        return;
    }
    const token = createToken({ id: user.id, email }, '5m');

    res.cookie(ACCESS_TOKEN_KEY, token, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
    })
        .status(StatusCodes.OK)
        .end();
    return;
});

const email: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email } = matchedData(req) as {
        email: string;
    };

    const user = await findOneService(email);

    if (user === undefined) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
        return;
    }
    const token = createToken({ id: user.id, email }, '5m');

    res.cookie(ACCESS_TOKEN_KEY, token, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
    })
        .status(StatusCodes.OK)
        .end();
    return;
});

const logout: RequestHandler = (req, res) => {
    res.clearCookie(ACCESS_TOKEN_KEY, { httpOnly: true }).status(204).end();
    return;
};

export { basic, email, logout };
