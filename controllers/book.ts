import type { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';

const findMany: RequestHandler = expressAsyncHandler((req, res) => {
    res.json('도서 목록');
});

const findOne: RequestHandler = expressAsyncHandler((req, res) => {
    const { id } = req.params;
    res.json(`도서 상세 ${id}`);
});

export { findMany, findOne };
