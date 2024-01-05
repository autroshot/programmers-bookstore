import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';

const basic: RequestHandler = expressAsyncHandler((req, res) => {
    res.status(200).json('basic auth');
});

const email: RequestHandler = expressAsyncHandler((req, res) => {
    res.status(200).json('email auth');
});

export { basic, email };
