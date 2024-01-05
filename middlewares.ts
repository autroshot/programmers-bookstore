import { ErrorRequestHandler, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { DBError, ValidationError } from './errors';

const validationResultHandler: RequestHandler = (req, _res, next) => {
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

        res.status(400).end();
        return;
    }
    next(err);
    return;
};

const DBErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof DBError) {
        switch (err.errorNo) {
            case 1062: {
                res.status(409).end();
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
    res.status(500).end();
};

export {
    DBErrorHandler,
    errorHandler,
    validationErrorHandler,
    validationResultHandler,
};
