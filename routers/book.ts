import {
    findMany as findManyRequestHandlers,
    findOne as findOneController,
} from '@controllers/book';
import { validationResultHandler } from '@middlewares/request-handlers';
import idSchema from '@validatorSchemas/id';
import express from 'express';
import { checkSchema } from 'express-validator';

const router = express.Router();

router.get('/', ...findManyRequestHandlers);
router.get(
    '/:id',
    checkSchema(idSchema, ['params']),
    validationResultHandler,
    findOneController
);

export default router;
