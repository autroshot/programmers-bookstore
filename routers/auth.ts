import express from 'express';
import { checkSchema } from 'express-validator';
import {
    basic as basicController,
    email as emailController,
} from '../controllers/auth';
import { validationResultHandler } from '../middlewares';
import {
    email as eamilParamSchema,
    form as formSchema,
} from '../validators/user';
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
