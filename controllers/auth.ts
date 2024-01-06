import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { findOne as findOneService } from '../services/user';

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
    if (typeof process.env.JWT_SECRET_KEY !== 'string')
        throw Error('필요한 환경 변수가 없습니다.');
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: '5m',
        issuer: process.env.JWT_ISSUER,
    });

    res.cookie('access_token', token, {
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
