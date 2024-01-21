import {
    create as createRequestHandlers,
    isExist as isExistRequestHandlers,
    remove as removeRequestHandlers,
} from '@controllers/like';
import express from 'express';

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(...isExistRequestHandlers)
    .post(...createRequestHandlers)
    .delete(...removeRequestHandlers);

export default router;
