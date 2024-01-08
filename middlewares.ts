import { ACCESS_TOKEN_KEY } from '@@constants';
import {
    AuthError,
    AuthorizationError,
    DBError,
    ValidationError,
} from '@errors';
import { verifyToken } from '@utils/auth';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const authenticate: RequestHandler = (req, res, next) => {
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

const authorize: RequestHandler = (req, res, next) => {
    const data = matchedData(req);
    if (typeof data.email !== 'string')
        throw new Error('유효한 이메일 입력값이 없습니다.');

    if (typeof req.authenticatedEmail !== 'string')
        throw new Error('인증된 이메일 값이 없습니다.');

    const inputEmail = data.email;
    const authenticatedEmail = req.authenticatedEmail;
    if (inputEmail !== authenticatedEmail) throw new AuthorizationError();
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

const authorizationErrorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    if (err instanceof AuthorizationError) {
        console.error(err);

        res.status(StatusCodes.FORBIDDEN).end();
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
    authenticate,
    authenticationErrorHandler,
    authorizationErrorHandler,
    authorize,
    errorHandler,
    validationErrorHandler,
    validationResultHandler,
};
