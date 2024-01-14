import {
    findMany as findManyBooksService,
    findOne as findOneBookService,
} from '@services/book';
import { findMany as findManyCategoriesService } from '@services/category';
import { toDBPagination } from '@utils/pagination';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandler = expressAsyncHandler(async (req, res) => {
    const categories = await findManyCategoriesService();

    res.status(StatusCodes.OK).json(categories);
    return;
});

const findManyBooksByCategory: RequestHandler = expressAsyncHandler(
    async (req, res) => {
        const {
            id: categoryId,
            page,
            limit,
        } = matchedData(req) as {
            id: number;
            page: number;
            limit: number;
        };

        const category = await findOneBookService(categoryId);
        if (category === undefined) {
            res.status(StatusCodes.NOT_FOUND).end();
            return;
        }
        const DBPagination = toDBPagination(page, limit);
        const books = await findManyBooksService(categoryId, DBPagination);

        res.status(StatusCodes.OK).json(books);
        return;
    }
);

export { findMany, findManyBooksByCategory };
