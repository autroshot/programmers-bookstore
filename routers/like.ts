import {
    create as createController,
    isExist as isExistController,
    remove as removeController,
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
    .get(isExistController)
    .post(createController)
    .delete(removeController);

export default router;
