import { authenticate } from '@middlewares/request-handlers';
import {
    create as createLikeService,
    findOne as findOneLikeService,
    remove as removeLikeService,
} from '@services/like';
import { getId } from '@utils/req';
import type { RequestHandlers } from '@utils/request-handler';
import { createRequestHandlers } from '@utils/request-handler';
import idSchema from '@validatorSchemas/id';
import { checkSchema, matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const validations: RequestHandlers = [
    authenticate,
    checkSchema(idSchema, ['params']),
];

const isExist: RequestHandlers = createRequestHandlers({
    validations,
    requestHandler: async (req, res) => {
        const { id: bookId } = matchedData(req) as {
            id: number;
        };
        const userId = getId(req);

        const like = await findOneLikeService(userId, bookId);
        const isLikeExist = like !== undefined;

        res.status(StatusCodes.OK).json(isLikeExist);
        return;
    },
});

const create: RequestHandlers = createRequestHandlers({
    validations,
    requestHandler: async (req, res) => {
        const { id: bookId } = matchedData(req) as {
            id: number;
        };
        const userId = getId(req);

        await createLikeService(userId, bookId);

        res.status(StatusCodes.CREATED).end();
        return;
    },
});

const remove: RequestHandlers = createRequestHandlers({
    validations,
    requestHandler: async (req, res) => {
        const { id: bookId } = matchedData(req) as {
            id: number;
        };
        const userId = getId(req);

        const isSuccess = await removeLikeService(userId, bookId);

        if (!isSuccess) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
            return;
        }
        res.status(StatusCodes.NO_CONTENT).end();
        return;
    },
});

export { create, isExist, remove };
