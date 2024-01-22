import {
    findMany as findManyRequestHandlers,
    findOne as findOneRequestHandlers,
} from '@requestHandlers/book';
import express from 'express';

const router = express.Router();

router.get('/', ...findManyRequestHandlers);
router.get('/:id', ...findOneRequestHandlers);

export default router;
