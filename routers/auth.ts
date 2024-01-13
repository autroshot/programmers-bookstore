import {
    basic as basicController,
    email as emailController,
} from '@controllers/auth';
import { validationResultHandler } from '@middlewares/request-handlers';
import {
    email as eamilParamSchema,
    form as formSchema,
} from '@validatorSchemas/user';
import express from 'express';
import { checkSchema } from 'express-validator';

const router = express.Router();

router
    .route('/basic')
    .post(
        checkSchema(formSchema, ['body']),
        validationResultHandler,
        basicController
    );
router
    .route('/email')
    .post(
        checkSchema({ email: eamilParamSchema }, ['body']),
        validationResultHandler,
        emailController
    );

export default router;
