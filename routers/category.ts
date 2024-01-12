import {
    findManyBooks as findManyBooksController,
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
    findManyBooksController
);

export default router;
