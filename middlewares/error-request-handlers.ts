import {
    AuthenticationError,
    AuthorizationError,
    DBError,
    ValidationError,
} from '@errors';
import type { ErrorRequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const authenticationErrorHandler: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    if (err instanceof AuthenticationError) {
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
    authorizationErrorHandler,
    errorHandler,
    validationErrorHandler,
};
