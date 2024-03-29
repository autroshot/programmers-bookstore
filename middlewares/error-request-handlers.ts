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
            case 1452: {
                res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
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

const JSONParsingErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (
        assertJSONParsingError(err) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        err.statusCode === StatusCodes.BAD_REQUEST
    ) {
        console.error(err);
        res.status(StatusCodes.BAD_REQUEST).end();
        return;
    }
    next(err);
    return;
};

const serverErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
};

const errorHandlers: Array<ErrorRequestHandler> = [
    authenticationErrorHandler,
    validationErrorHandler,
    authorizationErrorHandler,
    DBErrorHandler,
    JSONParsingErrorHandler,
    serverErrorHandler,
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertJSONParsingError(err: any): err is JSONParsingError {
    return (
        'expose' in err &&
        'statusCode' in err &&
        'status' in err &&
        'body' in err &&
        'type' in err
    );
}

interface JSONParsingError extends SyntaxError {
    expose: boolean;
    statusCode: number;
    status: number;
    body: string;
    type: string;
}

export default errorHandlers;
