import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import pool from '../maria-db';

const join: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    const result = await pool.execute(
        'INSERT INTO `programmers_bookstore`.`users` (`email`, `password`) VALUES (:email, :password)',
        { email, password }
    );
    console.log(result);

    res.status(201).end();
});

export { join };
