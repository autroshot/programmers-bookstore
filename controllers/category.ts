import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandler = expressAsyncHandler((req, res) => {
    res.status(StatusCodes.OK).json('범주 목록 API');
    return;
});

export { findMany };
