import { findMany as findManyController } from '@controllers/category';
import express from 'express';

const router = express.Router();

router.get('/', findManyController);

export default router;
