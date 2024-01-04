import { ErrorRequestHandler, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from './errors';

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
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).end();
};

export { errorHandler, validationErrorHandler, validationResultHandler };
