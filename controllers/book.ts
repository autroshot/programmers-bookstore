import {
    count as countService,
    findMany as findManyService,
    findOne as findOneService,
} from '@services/book';
import { toDBPagination } from '@utils/pagination';
import type { RequestHandlers } from '@utils/request-handler';
import { createRequestHandlers } from '@utils/request-handler';
import { isNew as isNewSchema } from '@validatorSchemas/book';
import idSchema from '@validatorSchemas/id';
import paginationSchema from '@validatorSchemas/pagination';
import { checkSchema, matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandlers = createRequestHandlers({
    validations: [
        checkSchema(paginationSchema, ['query']),
        checkSchema(isNewSchema, ['query']),
    ],
    requestHandler: async (req, res) => {
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
    },
});

const findOne: RequestHandlers = createRequestHandlers({
    validations: [checkSchema(idSchema, ['params'])],
    requestHandler: async (req, res) => {
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
    },
});

export { findMany, findOne };
