import 'dotenv/config';

import {
    join as joinController,
    update as updateController,
} from '@controllers/user';
import {
    DBErrorHandler,
    authenticationErrorHandler,
    authorizationErrorHandler,
    errorHandler,
    validationErrorHandler,
} from '@middlewares/errorRequestHandlers';
import {
    authenticate,
    authorize,
    validationResultHandler,
} from '@middlewares/requestHandlers';
import authRouter from '@routers/auth';
import bookRouter from '@routers/book';
import { form as formSchema } from '@validators/user';
import cookieParser from 'cookie-parser';
import express from 'express';
import { checkSchema } from 'express-validator';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('My Server');
});

app.post(
    '/users',
    checkSchema(formSchema, ['body']),
    validationResultHandler,
    joinController
);
app.patch(
    '/user',
    authenticate,
    checkSchema(formSchema, ['body']),
    validationResultHandler,
    authorize,
    updateController
);

app.use('/auth', authRouter);
app.use('/books', bookRouter);

app.use(
    authenticationErrorHandler,
    validationErrorHandler,
    authorizationErrorHandler,
    DBErrorHandler,
    errorHandler
);
