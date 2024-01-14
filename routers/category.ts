import {
    findManyBooksByCategory as findManyBooksByCategoryController,
    findMany as findManyController,
} from '@controllers/category';
import { validationResultHandler } from '@middlewares/request-handlers';
import { isNew as isNewSchema } from '@validatorSchemas/book';
import idSchema from '@validatorSchemas/id';
import paginationSchema from '@validatorSchemas/pagination';
import express from 'express';
import { checkSchema } from 'express-validator';

const router = express.Router();

router.get('/', findManyController);
router.get(
    '/:id/books',
    checkSchema(idSchema, ['params']),
    checkSchema(paginationSchema, ['query']),
    checkSchema(isNewSchema, ['query']),
    validationResultHandler,
    findManyBooksByCategoryController
);

export default router;
