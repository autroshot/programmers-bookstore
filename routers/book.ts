import {
    findMany as findManyController,
    findOne as findOneController,
} from '@controllers/book';
import { validationResultHandler } from '@middlewares/requestHandlers';
import { id as idSchema } from '@validators/book';

import express from 'express';
import { checkSchema } from 'express-validator';

const router = express.Router();

router.get('/', findManyController);
router.get(
    '/:id',
    checkSchema(idSchema, ['params']),
    validationResultHandler,
    findOneController
);

export default router;
