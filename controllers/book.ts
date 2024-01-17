import {
    count as countService,
    findMany as findManyService,
    findOne as findOneService,
} from '@services/book';
import {
    create as createLikeService,
    findOne as findOneLikeService,
    remove as removeLikeService,
} from '@services/like';
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

const findOneLike: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { id: bookId } = matchedData(req) as {
        id: number;
    };
    const userId = req.authenticatedId as number;

    const like = await findOneLikeService(userId, bookId);
    const isLikeExist = like !== undefined;

    res.status(StatusCodes.OK).json(isLikeExist);
    return;
});

const like: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { id: bookId } = matchedData(req) as {
        id: number;
    };
    const userId = req.authenticatedId as number;

    await createLikeService(userId, bookId);

    res.status(StatusCodes.CREATED).end();
    return;
});

const cancelLike: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { id: bookId } = matchedData(req) as {
        id: number;
    };
    const userId = req.authenticatedId as number;

    const isSuccess = await removeLikeService(userId, bookId);

    if (!isSuccess) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
        return;
    }
    res.status(StatusCodes.NO_CONTENT).end();
    return;
});

export { cancelLike, findMany, findOne, findOneLike, like };
