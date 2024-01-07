import express from 'express';
import { checkSchema } from 'express-validator';
import {
    basic as basicController,
    email as emailController,
} from '../controllers/auth';
import { validationResultHandler } from '../middlewares';
import { email, form } from '../validators/user';
const router = express.Router();

router
    .route('/basic')
    .post(
        checkSchema(form, ['body']),
        validationResultHandler,
        basicController
    );
router
    .route('/email')
    .post(
        checkSchema({ email }, ['body']),
        validationResultHandler,
        emailController
    );

export default router;
