import { findMany as findManyBookService } from '@services/book';
import { findMany as findManyService } from '@services/category';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandler = expressAsyncHandler(async (req, res) => {
    const categories = await findManyService();

    res.status(StatusCodes.OK).json(categories);
    return;
});

const findManyBooks: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { id: categoryId } = matchedData(req) as {
        id: number;
    };

    const books = await findManyBookService(categoryId);

    res.status(StatusCodes.OK).json(books);
    return;
});

export { findMany, findManyBooks };
