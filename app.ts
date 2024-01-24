import 'dotenv/config';

import errorHandlers from '@middlewares/error-request-handlers';
import {
    join as joinRequestHandlers,
    update as updateRequestHandlers,
} from '@requestHandlers/user';
import authRouter from '@routers/auth';
import bookRouter from '@routers/book';
import cartRouter from '@routers/cart';
import categoryRouter from '@routers/category';
import likeRouter from '@routers/like';
import { getEnvValue } from '@utils/env';
import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();
const PORT = getEnvValue('SERVER_PORT');

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('My Server');
});

app.post('/users', ...joinRequestHandlers);
app.patch('/user', ...updateRequestHandlers);

app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.use('/books/:id/likes', likeRouter);
app.use('/categories', categoryRouter);
app.use('/cart-items?', cartRouter);

app.use(errorHandlers);
