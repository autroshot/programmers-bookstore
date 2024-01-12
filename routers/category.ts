import {
    findManyBooks as findManyBooksController,
    findMany as findManyController,
} from '@controllers/category';
import express from 'express';

const router = express.Router();

router.get('/', findManyController);
router.get('/:id/books', findManyBooksController);

export default router;
