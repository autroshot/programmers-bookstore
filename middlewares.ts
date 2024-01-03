import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

const handleValidationResult: RequestHandler = (req, _res, next) => {
    validationResult(req).throw();

    next();
};

export { handleValidationResult };
