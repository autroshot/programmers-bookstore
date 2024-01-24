import { authenticate } from '@middlewares/request-handlers';
import {
    findMany as findManyService,
    remove as removeService,
    upsert as upsertService,
} from '@services/cart';
import type { RequestHandlers } from '@utils/request-handler';
import { createRequestHandlers } from '@utils/request-handler';
import { count as countSchema } from '@validatorSchemas/cart';
import idSchema from '@validatorSchemas/id';
import { checkSchema, matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandlers = createRequestHandlers({
    validations: [authenticate],
    requestHandler: async (req, res) => {
        const userId = req.authenticatedId as number;

        const cartItems = await findManyService(userId);

        res.status(StatusCodes.OK).json(cartItems);
        return;
    },
});

const upsert: RequestHandlers = createRequestHandlers({
    validations: [
        authenticate,
        checkSchema(idSchema, ['params']),
        checkSchema(countSchema, ['body']),
    ],
    requestHandler: async (req, res) => {
        const { id: bookId, count } = matchedData(req) as {
            id: number;
            count: number;
        };
        const userId = req.authenticatedId as number;

        const isSuccess = await upsertService({ userId, bookId, count });

        if (!isSuccess) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
            return;
        }
        res.status(StatusCodes.NO_CONTENT).end();
        return;
    },
});

const remove: RequestHandlers = createRequestHandlers({
    validations: [authenticate, checkSchema(idSchema, ['params'])],
    requestHandler: async (req, res) => {
        const { id: bookId } = matchedData(req) as {
            id: number;
        };
        const userId = req.authenticatedId as number;

        const isSuccess = await removeService(userId, bookId);

        if (!isSuccess) {
            res.status(StatusCodes.NOT_FOUND).end();
            return;
        }
        res.status(StatusCodes.NO_CONTENT).end();
        return;
    },
});

export { findMany, remove, upsert };
