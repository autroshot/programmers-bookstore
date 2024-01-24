import {
    findMany as findManyRequestHandlers,
    remove as removeRequestHandlers,
    upsert as upsertRequestHandlers,
} from '@requestHandlers/cart';
import type { RequestHandler } from 'express';
import express from 'express';

const router = express.Router();

const recoverBaseUrl: RequestHandler = (req, res, next) => {
    req.url = req.baseUrl.concat(req.url);
    next();
};
router.use(recoverBaseUrl);

router.route('/cart-items').get(...findManyRequestHandlers);
router
    .route('/cart-item/:id')
    .put(...upsertRequestHandlers)
    .delete(...removeRequestHandlers);

export default router;
