import { ACCESS_TOKEN_KEY } from '@@constants';
import { AuthError, DBError, ValidationError } from '@errors';
import { verifyToken } from '@utils/auth';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const verifyAuthentication: RequestHandler = (req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = req.cookies?.[ACCESS_TOKEN_KEY];
    if (typeof token !== 'string') throw new AuthError();

    let payload;
    try {
        payload = verifyToken(token);
    } catch (err) {
        if (err instanceof Error) {
            throw new AuthError(err.message);
        }
        throw err;
    }
    if (typeof payload === 'string') throw new AuthError();
    if (typeof payload?.email !== 'string') throw new AuthError();

    const email = payload.email;
    req.authenticatedEmail = email;
    next();
    return;
};

const authenticationErrorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    if (err instanceof AuthError) {
        console.error(err);
        if (err.message.length !== 0) {
            console.error(err.message);
        }

        res.status(StatusCodes.UNAUTHORIZED).end();
        return;
    }
    next(err);
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
    authenticationErrorHandler,
    errorHandler,
    validationErrorHandler,
    validationResultHandler,
    verifyAuthentication,
};
