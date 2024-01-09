import {
    findMany as findManyController,
    findOne as findOneController,
} from '@controllers/book';

import express from 'express';

const router = express.Router();

router.get('/', findManyController);
router.get('/:id', findOneController);

export default router;
