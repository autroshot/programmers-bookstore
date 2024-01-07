import 'dotenv/config';
import express from 'express';
import { checkSchema } from 'express-validator';
import {
    join as joinController,
    update as updateController,
} from './controllers/user';
import {
    DBErrorHandler,
    errorHandler,
    validationErrorHandler,
    validationResultHandler,
} from './middlewares';
import authRouter from './routers/auth';
import { form } from './validators/user';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('My Server');
});

app.post(
    '/users',
    checkSchema(form, ['body']),
    validationResultHandler,
    joinController
);
app.patch(
    '/user',
    checkSchema(form, ['body']),
    validationResultHandler,
    updateController
);

app.use('/auth', authRouter);

app.use(validationErrorHandler, DBErrorHandler, errorHandler);
