import 'dotenv/config';
import express, { ErrorRequestHandler } from 'express';
import { checkSchema } from 'express-validator';
import { join as joinController } from './controllers/user';
import { ValidationError } from './errors';
import { handleValidationResult } from './middlewares';
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
    handleValidationResult,
    joinController
);

const validationErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        res.status(400).end();
        return;
    }
    next(err);
    return;
};
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).end();
};

app.use(validationErrorHandler, errorHandler);
