import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { findOne as findOneService } from '../services/user';
import { createToken } from '../utils/auth';

const ACCESS_TOKEN = 'access_token';

const basic: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    const user = await findOneService(email);

    if (user?.password !== password) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
        return;
    }
    const token = createToken({ email }, '5m');

    res.cookie(ACCESS_TOKEN, token, {
        maxAge: 5 * 60 * 1000,
        httpOnly: true,
    })
        .status(StatusCodes.OK)
        .end();
    return;
});

const email: RequestHandler = expressAsyncHandler((req, res) => {
    res.status(200).json('email auth');
});

export { basic, email };
