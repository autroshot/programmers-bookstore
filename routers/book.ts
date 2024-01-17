import {
    findMany as findManyController,
    findOne as findOneController,
} from '@controllers/book';
import { validationResultHandler } from '@middlewares/request-handlers';
import { isNew as isNewSchema } from '@validatorSchemas/book';
import idSchema from '@validatorSchemas/id';
import paginationSchema from '@validatorSchemas/pagination';
import express from 'express';
import { checkSchema } from 'express-validator';

const router = express.Router();

router.get(
    '/',
    checkSchema(paginationSchema, ['query']),
    checkSchema(isNewSchema, ['query']),
    validationResultHandler,
    findManyController
);
router.get(
    '/:id',
    checkSchema(idSchema, ['params']),
    validationResultHandler,
    findOneController
);

export default router;
