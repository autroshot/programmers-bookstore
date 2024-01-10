import { findMany as findManyService } from '@services/category';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandler = expressAsyncHandler(async (req, res) => {
    const categories = await findManyService();

    res.status(StatusCodes.OK).json(categories);
    return;
});

export { findMany };
