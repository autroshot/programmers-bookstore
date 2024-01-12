import { findMany as findManyService } from '@services/category';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandler = expressAsyncHandler(async (req, res) => {
    const categories = await findManyService();

    res.status(StatusCodes.OK).json(categories);
    return;
});

const findManyBooks: RequestHandler = expressAsyncHandler((req, res) => {
    const { id } = req.params;

    res.status(StatusCodes.OK).json(`범주 ${id}에 해당하는 도서 목록`);
    return;
});

export { findMany, findManyBooks };
