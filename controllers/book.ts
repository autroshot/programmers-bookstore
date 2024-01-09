import { findMany as findManyService } from '@services/book';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandler = expressAsyncHandler(async (req, res) => {
    const books = await findManyService();

    res.status(StatusCodes.OK).json(books);
    return;
});

const findOne: RequestHandler = expressAsyncHandler((req, res) => {
    const { id } = req.params;
    res.json(`도서 상세 ${id}`);
});

export { findMany, findOne };
