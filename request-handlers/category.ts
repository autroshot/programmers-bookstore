import {
    count as countService,
    findMany as findManyBooksService,
    findOne as findOneBookService,
} from '@services/book';
import { findMany as findManyCategoriesService } from '@services/category';
import { calculateTotalPages, toDBPagination } from '@utils/pagination';
import type { RequestHandlers } from '@utils/request-handler';
import { createRequestHandlers } from '@utils/request-handler';
import { isNew as isNewSchema } from '@validatorSchemas/book';
import idSchema from '@validatorSchemas/id';
import paginationSchema from '@validatorSchemas/pagination';
import { checkSchema, matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const findMany: RequestHandlers = createRequestHandlers({
    requestHandler: async (req, res) => {
        const categories = await findManyCategoriesService();

        res.status(StatusCodes.OK).json(categories);
        return;
    },
});

const findManyBooksByCategory: RequestHandlers = createRequestHandlers({
    validations: [
        checkSchema(idSchema, ['params']),
        checkSchema(paginationSchema, ['query']),
        checkSchema(isNewSchema, ['query']),
    ],
    requestHandler: async (req, res) => {
        const {
            id: categoryId,
            page,
            limit,
            'is-new': isNew,
        } = matchedData(req) as {
            id: number;
            page: number;
            limit: number;
            'is-new': boolean;
        };

        const category = await findOneBookService(categoryId);
        if (category === undefined) {
            res.status(StatusCodes.NOT_FOUND).end();
            return;
        }
        const DBPagination = toDBPagination(page, limit);
        const books = await findManyBooksService(
            DBPagination,
            isNew,
            categoryId
        );
        const count = await countService(isNew, categoryId);

        const totalPages = calculateTotalPages(count, limit);
        const body = { books, totalPages };
        res.status(StatusCodes.OK).json(body);
        return;
    },
});

export { findMany, findManyBooksByCategory };
