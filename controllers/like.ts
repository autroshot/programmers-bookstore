import {
    create as createLikeService,
    findOne as findOneLikeService,
    remove as removeLikeService,
} from '@services/like';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const isExist: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { id: bookId } = matchedData(req) as {
        id: number;
    };
    const userId = req.authenticatedId as number;

    const like = await findOneLikeService(userId, bookId);
    const isLikeExist = like !== undefined;

    res.status(StatusCodes.OK).json(isLikeExist);
    return;
});

const create: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { id: bookId } = matchedData(req) as {
        id: number;
    };
    const userId = req.authenticatedId as number;

    await createLikeService(userId, bookId);

    res.status(StatusCodes.CREATED).end();
    return;
});

const remove: RequestHandler = expressAsyncHandler(async (req, res) => {
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

export { create, isExist, remove };
