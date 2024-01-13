import {
    findManyBooksByCategory as findManyBooksByCategoryController,
    findMany as findManyController,
} from '@controllers/category';
import { validationResultHandler } from '@middlewares/request-handlers';
import idSchema from '@validators/id';
import paginationSchema from '@validators/pagination';
import express from 'express';
import { checkSchema } from 'express-validator';

const router = express.Router();

router.get('/', findManyController);
router.get(
    '/:id/books',
    checkSchema(idSchema, ['params']),
    checkSchema(paginationSchema, ['query']),
    validationResultHandler,
    findManyBooksByCategoryController
);

export default router;
