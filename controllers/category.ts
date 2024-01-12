import { findMany as findManyBooksService } from '@services/book';
import { findMany as findManyCategoriesService } from '@services/category';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandler = expressAsyncHandler(async (req, res) => {
    const categories = await findManyCategoriesService();

    res.status(StatusCodes.OK).json(categories);
    return;
});

const findManyBooks: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { id: categoryId } = matchedData(req) as {
        id: number;
    };

    const books = await findManyBooksService(categoryId);

    res.status(StatusCodes.OK).json(books);
    return;
});

export { findMany, findManyBooks };
