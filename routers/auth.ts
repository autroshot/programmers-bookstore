import {
    basic as basicRequestHandlers,
    email as emailRequestHandlers,
    logout as logoutRequestHandlers,
} from '@controllers/auth';
import express from 'express';

const router = express.Router();

router.route('/').delete(...logoutRequestHandlers);
router.route('/basic').post(...basicRequestHandlers);
router.route('/email').post(...emailRequestHandlers);

export default router;
