import { authenticate } from '@middlewares/request-handlers';
import { findMany as findManyService } from '@services/cart';
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
    requestHandler: (req, res) => {
        const { id: bookId, count } = matchedData(req) as {
            id: number;
            count: number;
        };
        const userId = req.authenticatedId as number;

        res.status(StatusCodes.CREATED).json(
            `findMany userId: ${userId}, bookId: ${bookId}, count: ${count}`
        );
        return;
    },
});

const remove: RequestHandlers = createRequestHandlers({
    validations: [authenticate, checkSchema(idSchema, ['params'])],
    requestHandler: (req, res) => {
        const { id: bookId } = matchedData(req) as {
            id: number;
        };
        const userId = req.authenticatedId as number;

        res.status(StatusCodes.NO_CONTENT).json(
            `findMany userId: ${userId}, bookId: ${bookId}`
        );
        return;
    },
});

export { findMany, remove, upsert };
