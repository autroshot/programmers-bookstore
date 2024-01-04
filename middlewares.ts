import { RequestHandler } from 'express';
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

export { validationResultHandler };
