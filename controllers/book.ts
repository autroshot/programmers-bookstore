import {
    findMany as findManyService,
    findOne as findOneService,
} from '@services/book';
import { create as createLikeService } from '@services/like';
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

const like: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { id: bookId } = matchedData(req) as {
        id: number;
    };
    const userId = req.authenticatedId as number;

    await createLikeService(userId, bookId);

    res.status(201).end();
    return;
});

const cancelLike: RequestHandler = expressAsyncHandler((req, res) => {
    const { id: bookId } = matchedData(req) as {
        id: number;
    };
    const userId = req.authenticatedId as number;

    console.log('bookId: ' + bookId);
    console.log('userId: ' + userId);

    res.status(204).end();
    return;
});

export { cancelLike, findMany, findOne, like };
