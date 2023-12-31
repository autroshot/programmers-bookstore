import {
    findMany as findManyService,
    findOne as findOneService,
} from '@services/book';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandler = expressAsyncHandler(async (req, res) => {
    const books = await findManyService();

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

export { findMany, findOne };
