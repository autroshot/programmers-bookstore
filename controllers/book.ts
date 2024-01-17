import {
    count as countService,
    findMany as findManyService,
    findOne as findOneService,
} from '@services/book';
import { toDBPagination } from '@utils/pagination';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { page, limit, isNew } = matchedData(req) as {
        page: number;
        limit: number;
        isNew: boolean;
    };

    const DBPagination = toDBPagination(page, limit);
    const books = await findManyService(DBPagination, isNew);
    const count = await countService();

    const body = { books, totalPages: count };
    res.status(StatusCodes.OK).json(body);
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

export { findMany, findOne };
