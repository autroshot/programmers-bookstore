import { validationResultHandler } from '@middlewares/request-handlers';
import {
    count as countService,
    findMany as findManyService,
    findOne as findOneService,
} from '@services/book';
import { toDBPagination } from '@utils/pagination';
import { isNew as isNewSchema } from '@validatorSchemas/book';
import idSchema from '@validatorSchemas/id';
import paginationSchema from '@validatorSchemas/pagination';
import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { checkSchema, matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

type RequestHandlers = Array<Array<RequestHandler> | RequestHandler>;

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

/**
 * 라우터에 사용될 요청 처리기 배열을 만든다.
 * @param requestHandler 가장 마지막에 실행될 요청 처리기 (비동기도 가능)
 * @param validations 먼저 실행될 유효성 검사들
 * @returns 요청 처리기 배열
 */
function createRequestHandlers({
    validations,
    requestHandler,
}: Params): RequestHandlers {
    if (validations === undefined) return [expressAsyncHandler(requestHandler)];
    return [
        ...validations,
        validationResultHandler,
        expressAsyncHandler(requestHandler),
    ];
}

interface Params {
    requestHandler: (
        ...arg: Parameters<RequestHandler>
    ) => void | Promise<void>;
    validations?: RequestHandlers;
}

export { findMany, findOne };
