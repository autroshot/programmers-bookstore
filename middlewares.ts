import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from './errors';

const validationResultHandler: RequestHandler = (req, _res, next) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        next();
        return;
    }
    console.error(result.array());
    next(new ValidationError());
    return;
};

export { validationResultHandler };
