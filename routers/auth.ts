import express from 'express';
import {
    basic as basicController,
    email as emailController,
} from '../controllers/auth';
const router = express.Router();

router.route('/basic').post(basicController);
router.route('/email').post(emailController);

export default router;
