import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { matchedData } from 'express-validator';
import { DBError } from '../errors';
import pool from '../maria-db';

const join: RequestHandler = expressAsyncHandler(async (req, res) => {
    const { email, password } = matchedData(req) as {
        email: string;
        password: string;
    };

    try {
        const result = await pool.execute(
            'INSERT INTO `programmers_bookstore`.`users` (`email`, `password`) VALUES (:email, :password)',
            { email, password }
        );
        console.log(result);

        res.status(201).end();
    } catch (err) {
        if (assertMySQLError(err)) {
            console.error(err);
            throw new DBError(err.errno);
        }
        throw err;
    }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertMySQLError(err: any): err is MySQLError {
    return (
        'code' in err &&
        'errno' in err &&
        'sql' in err &&
        'sqlState' in err &&
        'sqlMessage' in err
    );
}

interface MySQLError extends Error {
    code: string;
    errno: number;
    sql: string;
    sqlState: string;
    sqlMessage: string;
}

export { join };
