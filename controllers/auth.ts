import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { findOne as findOneService } from '../services/user';

const basic: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };
    const user = await findOneService(email);
    if (user?.password === password) {
        res.status(200).end();
        return;
    }
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
    return;
});

const email: RequestHandler = expressAsyncHandler((req, res) => {
    res.status(200).json('email auth');
});

export { basic, email };
