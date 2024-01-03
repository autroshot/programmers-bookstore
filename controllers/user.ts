import { RequestHandler } from 'express';

const join: RequestHandler = (req, res) => {
    res.send('join');
};

export { join };
