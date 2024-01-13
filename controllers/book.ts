import type { Pagination } from '@services/book';
import {
    findMany as findManyService,
    findOne as findOneService,
} from '@services/book';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { page, limit } = matchedData(req) as {
        page?: number;
        limit?: number;
    };

    const DBPagination = toDBPagination(page, limit);
    const books = await findManyService(undefined, DBPagination);

    res.status(StatusCodes.OK).json(books);
    return;
});

const findOne: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { id } = matchedData(req) as {
        id: number;
    };

    const book = await findOneService(id);

    if (book === undefined) {
        res.status(StatusCodes.NOT_FOUND).end();
        return;
    }
    res.status(StatusCodes.OK).json(book);
    return;
});

function toDBPagination(
    page: number | undefined,
    limit: number | undefined
): Pagination | undefined {
    if (typeof page === 'undefined' || typeof limit === 'undefined')
        return undefined;
    const offset = (page - 1) * limit;
    return { offset, limit };
}

export { findMany, findOne };
