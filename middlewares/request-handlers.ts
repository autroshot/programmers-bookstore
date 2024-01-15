import { ACCESS_TOKEN_KEY } from '@@constants';
import {
    AuthenticationError,
    AuthorizationError,
    ValidationError,
} from '@errors';
import { verifyToken } from '@utils/auth';
import type { RequestHandler } from 'express';
import { matchedData, validationResult } from 'express-validator';

const authenticate: RequestHandler = (req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = req.cookies?.[ACCESS_TOKEN_KEY];
    if (typeof token !== 'string') throw new AuthenticationError();

    let payload;
    try {
        payload = verifyToken(token);
    } catch (err) {
        if (err instanceof Error) {
            throw new AuthenticationError(err.message);
        }
        throw err;
    }
    if (typeof payload === 'string') throw new AuthenticationError();
    if (typeof payload?.email !== 'string') throw new AuthenticationError();
    if (typeof payload?.id !== 'number') throw new AuthenticationError();

    const email = payload.email;
    const id = payload.id;
    req.authenticatedEmail = email;
    req.authenticatedId = id;

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

const validationResultHandler: RequestHandler = (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        next();
        return;
    }
    next(new ValidationError());
    return;
};

export { authenticate, authorize, validationResultHandler };
