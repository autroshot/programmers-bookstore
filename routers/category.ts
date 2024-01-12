import {
    findManyBooksByCategory as findManyBooksByCategoryController,
    findMany as findManyController,
} from '@controllers/category';
import { validationResultHandler } from '@middlewares/request-handlers';
import { id as idSchema } from '@validators/book';
import express from 'express';
import { checkSchema } from 'express-validator';

const router = express.Router();

router.get('/', findManyController);
router.get(
    '/:id/books',
    checkSchema(idSchema, ['params']),
    validationResultHandler,
    findManyBooksByCategoryController
);

export default router;
