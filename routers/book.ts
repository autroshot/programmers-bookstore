import {
    cancelLike as cancelLikeController,
    findMany as findManyController,
    findOne as findOneController,
    findOneLike as findOneLikeController,
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

router.use(
    '/:id/likes',
    authenticate,
    checkSchema(idSchema, ['params']),
    validationResultHandler
);
router
    .route('/:id/likes')
    .get(findOneLikeController)
    .post(likeController)
    .delete(cancelLikeController);

export default router;
