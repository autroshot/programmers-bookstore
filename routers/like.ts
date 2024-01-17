import {
    cancelLike as cancelLikeController,
    findOneLike as findOneLikeController,
    like as likeController,
} from '@controllers/book';
import {
    authenticate,
    validationResultHandler,
} from '@middlewares/request-handlers';
import idSchema from '@validatorSchemas/id';
import express from 'express';
import { checkSchema } from 'express-validator';

const router = express.Router({ mergeParams: true });

router.use(
    authenticate,
    checkSchema(idSchema, ['params']),
    validationResultHandler
);

router
    .route('/')
    .get(findOneLikeController)
    .post(likeController)
    .delete(cancelLikeController);

export default router;
