import {
    findManyBooksByCategory as findManyBooksByCategoryController,
    findMany as findManyController,
} from '@requestHandlers/category';
import express from 'express';

const router = express.Router();

router.get('/', ...findManyController);
router.get('/:id/books', ...findManyBooksByCategoryController);

export default router;
