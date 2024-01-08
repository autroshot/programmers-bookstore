import { DBError, ValidationError } from '@errors';
import { verifyToken } from '@utils/auth';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const verifyAuth: RequestHandler = (req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = req.cookies?.access_token;
    if (typeof token !== 'string') throw Error('인증 오류');

    const payload = verifyToken(token);
    if (typeof payload === 'string') throw Error('인증 오류');
    if (typeof payload?.email !== 'string') throw Error('인증 오류');

    next();
    return;
};

const validationResultHandler: RequestHandler = (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        next();
        return;
    }
    next(new ValidationError());
    return;
};

const validationErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        const result = validationResult(req);
        console.error(result.array());

        res.status(StatusCodes.BAD_REQUEST).end();
        return;
    }
    next(err);
    return;
};

const DBErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof DBError) {
        switch (err.errorNo) {
            case 1062: {
                res.status(StatusCodes.CONFLICT).end();
                return;
            }
            default: {
                next(err);
                return;
            }
        }
    }
    next(err);
    return;
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
};

export {
    DBErrorHandler,
    errorHandler,
    validationErrorHandler,
    validationResultHandler,
    verifyAuth,
};
