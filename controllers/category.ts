import {
    findMany as findManyBooksService,
    findOne as findOneBookService,
} from '@services/book';
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

    const category = await findOneBookService(categoryId);
    if (category === undefined) {
        res.status(StatusCodes.NOT_FOUND).end();
        return;
    }
    const books = await findManyBooksService(categoryId);

    res.status(StatusCodes.OK).json(books);
    return;
});

export { findMany, findManyBooks };
