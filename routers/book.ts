import {
    cancelLike as cancelLikeController,
    findMany as findManyController,
    findOne as findOneController,
    like as likeController,
} from '@controllers/book';
import {
    authenticate,
    validationResultHandler,
} from '@middlewares/request-handlers';
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

router
    .route('/:id/likes')
    .post(
        authenticate,
        checkSchema(idSchema, ['params']),
        validationResultHandler,
        likeController
    )
    .delete(
        authenticate,
        checkSchema(idSchema, ['params']),
        validationResultHandler,
        cancelLikeController
    );

export default router;
