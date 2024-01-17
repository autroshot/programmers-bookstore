import {
    cancelLike as cancelLikeController,
    isLikeExist as isLikeExistController,
    like as likeController,
} from '@controllers/like';
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
    .get(isLikeExistController)
    .post(likeController)
    .delete(cancelLikeController);

export default router;
